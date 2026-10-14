//! Capstone starter tests: build first (`anchor build`), then `cargo test -p cp-amm`.
//! Happy path (init, deposit, swap both ways, withdraw), k never decreases, slippage and fake-vault rejection.

use {
    anchor_lang::{
        prelude::{AccountMeta, Pubkey},
        solana_program::instruction::Instruction,
        system_program, InstructionData, ToAccountMetas,
    },
    litesvm::LiteSVM,
    litesvm_token::{
        get_spl_account, spl_token::state::Account as TokenAccountState, CreateAssociatedTokenAccount, CreateMint, MintTo,
        TOKEN_ID,
    },
    solana_keypair::Keypair,
    solana_message::{Message, VersionedMessage},
    solana_signer::Signer,
    solana_transaction::versioned::VersionedTransaction,
};

const U: u64 = 1_000_000; // 6 decimals

struct World {
    svm: LiteSVM,
    user: Keypair,
    mint_a: Pubkey,
    mint_b: Pubkey,
    pool: Pubkey,
    vault_a: Pubkey,
    vault_b: Pubkey,
    lp_mint: Pubkey,
    user_a: Pubkey,
    user_b: Pubkey,
    user_lp: Pubkey,
}

fn pda(seeds: &[&[u8]]) -> Pubkey {
    Pubkey::find_program_address(seeds, &cp_amm::id()).0
}

fn send(svm: &mut LiteSVM, payer: &Keypair, data: Vec<u8>, accounts: Vec<AccountMeta>) -> Result<(), String> {
    let ix = Instruction::new_with_bytes(cp_amm::id(), &data, accounts);
    let msg = Message::new_with_blockhash(&[ix], Some(&payer.pubkey()), &svm.latest_blockhash());
    let tx = VersionedTransaction::try_new(VersionedMessage::Legacy(msg), &[payer]).unwrap();
    let res = svm.send_transaction(tx).map(|_| ()).map_err(|e| format!("{:?} {:?}", e.err, e.meta.logs));
    svm.expire_blockhash();
    res
}

fn balance(svm: &LiteSVM, account: &Pubkey) -> u64 {
    get_spl_account::<TokenAccountState>(svm, account).unwrap().amount
}

fn setup(fee_bps: u16) -> World {
    let mut svm = LiteSVM::new();
    let bytes = include_bytes!(concat!(env!("CARGO_TARGET_TMPDIR"), "/../deploy/cp_amm.so"));
    svm.add_program(cp_amm::id(), bytes).unwrap();
    let user = Keypair::new();
    svm.airdrop(&user.pubkey(), 10_000_000_000).unwrap();

    let mint_a = CreateMint::new(&mut svm, &user).decimals(6).send().unwrap();
    let mint_b = CreateMint::new(&mut svm, &user).decimals(6).send().unwrap();
    let user_a = CreateAssociatedTokenAccount::new(&mut svm, &user, &mint_a).send().unwrap();
    let user_b = CreateAssociatedTokenAccount::new(&mut svm, &user, &mint_b).send().unwrap();
    MintTo::new(&mut svm, &user, &mint_a, &user_a, 1_000 * U).send().unwrap();
    MintTo::new(&mut svm, &user, &mint_b, &user_b, 1_000 * U).send().unwrap();

    let pool = pda(&[cp_amm::POOL_SEED, mint_a.as_ref(), mint_b.as_ref()]);
    let vault_a = pda(&[cp_amm::VAULT_A_SEED, pool.as_ref()]);
    let vault_b = pda(&[cp_amm::VAULT_B_SEED, pool.as_ref()]);
    let lp_mint = pda(&[cp_amm::LP_SEED, pool.as_ref()]);

    send(&mut svm, &user, cp_amm::instruction::InitializePool { fee_bps }.data(),
        cp_amm::accounts::InitializePool {
            payer: user.pubkey(), pool, mint_a, mint_b, vault_a, vault_b, lp_mint,
            token_program: TOKEN_ID, system_program: system_program::ID,
        }.to_account_metas(None)).expect("initialize pool");

    let user_lp = CreateAssociatedTokenAccount::new(&mut svm, &user, &lp_mint).send().unwrap();
    World { svm, user, mint_a, mint_b, pool, vault_a, vault_b, lp_mint, user_a, user_b, user_lp }
}

fn deposit(w: &mut World, a: u64, b: u64, min_lp: u64) -> Result<(), String> {
    let metas = cp_amm::accounts::Deposit {
        user: w.user.pubkey(), pool: w.pool, mint_a: w.mint_a, mint_b: w.mint_b, vault_a: w.vault_a, vault_b: w.vault_b,
        lp_mint: w.lp_mint, user_a: w.user_a, user_b: w.user_b, user_lp: w.user_lp, token_program: TOKEN_ID,
    }.to_account_metas(None);
    send(&mut w.svm, &w.user, cp_amm::instruction::Deposit { amount_a: a, amount_b: b, min_lp }.data(), metas)
}

fn swap(w: &mut World, a_to_b: bool, amount_in: u64, min_out: u64) -> Result<(), String> {
    let metas = cp_amm::accounts::Swap {
        user: w.user.pubkey(), pool: w.pool, mint_a: w.mint_a, mint_b: w.mint_b, vault_a: w.vault_a, vault_b: w.vault_b,
        user_a: w.user_a, user_b: w.user_b, token_program: TOKEN_ID,
    }.to_account_metas(None);
    send(&mut w.svm, &w.user, cp_amm::instruction::Swap { a_to_b, amount_in, min_out }.data(), metas)
}

fn k(w: &World) -> u128 {
    balance(&w.svm, &w.vault_a) as u128 * balance(&w.svm, &w.vault_b) as u128
}

#[test]
fn deck_numbers_on_chain() {
    let mut w = setup(30);
    deposit(&mut w, 100 * U, 100 * U, 0).unwrap();
    assert_eq!(balance(&w.svm, &w.user_lp), 100 * U, "first deposit mints sqrt(a*b)");

    let before = balance(&w.svm, &w.user_b);
    swap(&mut w, true, 10 * U, 0).unwrap();
    // 10 in at 0.3% fee from a 100/100 pool -> 9.066108 out, the week 3 number.
    assert_eq!(balance(&w.svm, &w.user_b) - before, 9_066_108);
    assert!(k(&w) > (100 * U) as u128 * (100 * U) as u128, "the fee stays in the pool, so k grows");
}

#[test]
fn k_never_decreases_across_trades() {
    let mut w = setup(30);
    deposit(&mut w, 500 * U, 500 * U, 0).unwrap();
    let mut last = k(&w);
    for (i, amt) in [5, 40, 1, 120, 33, 7, 250, 2].iter().enumerate() {
        swap(&mut w, i % 2 == 0, amt * U, 0).unwrap();
        let now = k(&w);
        assert!(now >= last, "k fell after trade {}", i);
        last = now;
    }
}

#[test]
fn slippage_guard_rejects_a_bad_price() {
    let mut w = setup(30);
    deposit(&mut w, 100 * U, 100 * U, 0).unwrap();
    // Asking for 9.5 when the pool can only give 9.066 must fail and move nothing.
    let a_before = balance(&w.svm, &w.user_a);
    assert!(swap(&mut w, true, 10 * U, 9_500_000).is_err());
    assert_eq!(balance(&w.svm, &w.user_a), a_before);
}

#[test]
fn withdraw_returns_your_share() {
    let mut w = setup(30);
    deposit(&mut w, 100 * U, 100 * U, 0).unwrap();
    swap(&mut w, true, 10 * U, 0).unwrap();
    let lp = balance(&w.svm, &w.user_lp);
    let metas = cp_amm::accounts::Withdraw {
        user: w.user.pubkey(), pool: w.pool, mint_a: w.mint_a, mint_b: w.mint_b, vault_a: w.vault_a, vault_b: w.vault_b,
        lp_mint: w.lp_mint, user_a: w.user_a, user_b: w.user_b, user_lp: w.user_lp, token_program: TOKEN_ID,
    }.to_account_metas(None);
    send(&mut w.svm, &w.user, cp_amm::instruction::Withdraw { lp_amount: lp, min_a: 0, min_b: 0 }.data(), metas).unwrap();
    assert_eq!(balance(&w.svm, &w.user_lp), 0);
    assert_eq!(balance(&w.svm, &w.vault_a), 0, "sole LP takes everything back");
    assert_eq!(balance(&w.svm, &w.vault_b), 0);
    // As the only LP and the only trader, the round trip lands exactly where they started.
    assert_eq!(balance(&w.svm, &w.user_a), 1_000 * U);
    assert_eq!(balance(&w.svm, &w.user_b), 1_000 * U);
}

#[test]
fn a_fake_vault_is_rejected() {
    let mut w = setup(30);
    deposit(&mut w, 100 * U, 100 * U, 0).unwrap();
    // The attacker passes their own token account as "vault_b". has_one = vault_b refuses it.
    let mut metas = cp_amm::accounts::Swap {
        user: w.user.pubkey(), pool: w.pool, mint_a: w.mint_a, mint_b: w.mint_b, vault_a: w.vault_a, vault_b: w.user_b,
        user_a: w.user_a, user_b: w.user_b, token_program: TOKEN_ID,
    }.to_account_metas(None);
    metas[5].is_writable = true;
    assert!(send(&mut w.svm, &w.user, cp_amm::instruction::Swap { a_to_b: true, amount_in: 10 * U, min_out: 0 }.data(), metas).is_err());
}

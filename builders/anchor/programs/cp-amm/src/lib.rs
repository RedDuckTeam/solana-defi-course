//! Week 6 capstone starter: a minimal constant-product AMM (x * y = k).
//!
//! One pool per (mint_a, mint_b) pair. The pool PDA owns both token vaults and the LP mint.
//!   initialize_pool  create the pool, its two vaults and its LP mint
//!   deposit          add both tokens, receive LP tokens
//!   swap             trade one token for the other, paying fee_bps to the pool
//!   withdraw         burn LP tokens, receive your share of both vaults
//!
//! Deliberately small. Before anything real it would need: an audit, a minimum-liquidity lock
//! against first-depositor attacks, Token-2022 extension handling, and admin controls.
//! Devnet and local tests only.

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    self, Burn, Mint, MintTo, TokenAccount, TokenInterface, TransferChecked,
};

declare_id!("bSGEvaqpoqpqV8Bpx59vBfVXCYzxotDYenAk5w2F1nj");

pub const POOL_SEED: &[u8] = b"pool";
pub const VAULT_A_SEED: &[u8] = b"vault_a";
pub const VAULT_B_SEED: &[u8] = b"vault_b";
pub const LP_SEED: &[u8] = b"lp";
pub const MAX_FEE_BPS: u16 = 1_000; // 10%
pub const LP_DECIMALS: u8 = 6;

#[program]
pub mod cp_amm {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, fee_bps: u16) -> Result<()> {
        require!(fee_bps <= MAX_FEE_BPS, AmmError::FeeTooHigh);
        require_keys_neq!(ctx.accounts.mint_a.key(), ctx.accounts.mint_b.key(), AmmError::SameMint);
        let pool = &mut ctx.accounts.pool;
        pool.mint_a = ctx.accounts.mint_a.key();
        pool.mint_b = ctx.accounts.mint_b.key();
        pool.vault_a = ctx.accounts.vault_a.key();
        pool.vault_b = ctx.accounts.vault_b.key();
        pool.lp_mint = ctx.accounts.lp_mint.key();
        pool.fee_bps = fee_bps;
        pool.bump = ctx.bumps.pool;
        Ok(())
    }

    /// Add liquidity. The first deposit sets the price and mints sqrt(a * b) LP tokens.
    /// Later deposits mint the smaller of the two pro-rata amounts, so depositing off-ratio
    /// gifts the extra to existing LPs. Exercise: refund the excess instead.
    pub fn deposit(ctx: Context<Deposit>, amount_a: u64, amount_b: u64, min_lp: u64) -> Result<()> {
        require!(amount_a > 0 && amount_b > 0, AmmError::ZeroAmount);
        let reserve_a = ctx.accounts.vault_a.amount as u128;
        let reserve_b = ctx.accounts.vault_b.amount as u128;
        let supply = ctx.accounts.lp_mint.supply as u128;

        let lp = if supply == 0 {
            isqrt((amount_a as u128).checked_mul(amount_b as u128).ok_or(AmmError::Overflow)?)
        } else {
            let from_a = (amount_a as u128).checked_mul(supply).ok_or(AmmError::Overflow)? / reserve_a;
            let from_b = (amount_b as u128).checked_mul(supply).ok_or(AmmError::Overflow)? / reserve_b;
            from_a.min(from_b)
        };
        let lp = u64::try_from(lp).map_err(|_| AmmError::Overflow)?;
        require!(lp > 0, AmmError::ZeroAmount);
        require!(lp >= min_lp, AmmError::SlippageExceeded);

        let a = &ctx.accounts;
        transfer_in(&a.token_program, &a.user_a, &a.mint_a, &a.vault_a, &a.user, amount_a)?;
        transfer_in(&a.token_program, &a.user_b, &a.mint_b, &a.vault_b, &a.user, amount_b)?;

        let seeds: &[&[u8]] = &[POOL_SEED, a.pool.mint_a.as_ref(), a.pool.mint_b.as_ref(), &[a.pool.bump]];
        token_interface::mint_to(
            CpiContext::new_with_signer(
                a.token_program.key(),
                MintTo {
                    mint: a.lp_mint.to_account_info(),
                    to: a.user_lp.to_account_info(),
                    authority: a.pool.to_account_info(),
                },
                &[seeds],
            ),
            lp,
        )
    }

    /// Sell `amount_in` of one side for the other. out = reserve_out * in_after_fee / (reserve_in + in_after_fee).
    /// The whole amount_in stays in the pool, so k grows by the fee on every trade.
    pub fn swap(ctx: Context<Swap>, a_to_b: bool, amount_in: u64, min_out: u64) -> Result<()> {
        require!(amount_in > 0, AmmError::ZeroAmount);
        let a = &ctx.accounts;
        let (reserve_in, reserve_out) = if a_to_b {
            (a.vault_a.amount, a.vault_b.amount)
        } else {
            (a.vault_b.amount, a.vault_a.amount)
        };
        let out = swap_out(reserve_in, reserve_out, amount_in, a.pool.fee_bps)?;
        require!(out > 0, AmmError::ZeroAmount);
        require!(out >= min_out, AmmError::SlippageExceeded);

        let seeds: &[&[u8]] = &[POOL_SEED, a.pool.mint_a.as_ref(), a.pool.mint_b.as_ref(), &[a.pool.bump]];
        if a_to_b {
            transfer_in(&a.token_program, &a.user_a, &a.mint_a, &a.vault_a, &a.user, amount_in)?;
            transfer_out(&a.token_program, &a.vault_b, &a.mint_b, &a.user_b, &a.pool, seeds, out)
        } else {
            transfer_in(&a.token_program, &a.user_b, &a.mint_b, &a.vault_b, &a.user, amount_in)?;
            transfer_out(&a.token_program, &a.vault_a, &a.mint_a, &a.user_a, &a.pool, seeds, out)
        }
    }

    /// Burn LP tokens for a pro-rata share of both vaults.
    pub fn withdraw(ctx: Context<Withdraw>, lp_amount: u64, min_a: u64, min_b: u64) -> Result<()> {
        require!(lp_amount > 0, AmmError::ZeroAmount);
        let a = &ctx.accounts;
        let supply = a.lp_mint.supply as u128;
        require!(supply > 0, AmmError::EmptyPool);
        let out_a = u64::try_from((lp_amount as u128).checked_mul(a.vault_a.amount as u128).ok_or(AmmError::Overflow)? / supply)
            .map_err(|_| AmmError::Overflow)?;
        let out_b = u64::try_from((lp_amount as u128).checked_mul(a.vault_b.amount as u128).ok_or(AmmError::Overflow)? / supply)
            .map_err(|_| AmmError::Overflow)?;
        require!(out_a >= min_a && out_b >= min_b, AmmError::SlippageExceeded);

        token_interface::burn(
            CpiContext::new(
                a.token_program.key(),
                Burn {
                    mint: a.lp_mint.to_account_info(),
                    from: a.user_lp.to_account_info(),
                    authority: a.user.to_account_info(),
                },
            ),
            lp_amount,
        )?;
        let seeds: &[&[u8]] = &[POOL_SEED, a.pool.mint_a.as_ref(), a.pool.mint_b.as_ref(), &[a.pool.bump]];
        transfer_out(&a.token_program, &a.vault_a, &a.mint_a, &a.user_a, &a.pool, seeds, out_a)?;
        transfer_out(&a.token_program, &a.vault_b, &a.mint_b, &a.user_b, &a.pool, seeds, out_b)
    }
}

/// Constant-product output with the fee taken from the input, rounded down (in the pool's favour).
pub fn swap_out(reserve_in: u64, reserve_out: u64, amount_in: u64, fee_bps: u16) -> Result<u64> {
    require!(reserve_in > 0 && reserve_out > 0, AmmError::EmptyPool);
    let in_after_fee = (amount_in as u128)
        .checked_mul(10_000u128.checked_sub(fee_bps as u128).ok_or(AmmError::Overflow)?)
        .ok_or(AmmError::Overflow)?
        / 10_000;
    let numerator = (reserve_out as u128).checked_mul(in_after_fee).ok_or(AmmError::Overflow)?;
    let denominator = (reserve_in as u128).checked_add(in_after_fee).ok_or(AmmError::Overflow)?;
    u64::try_from(numerator / denominator).map_err(|_| AmmError::Overflow.into())
}

fn isqrt(n: u128) -> u128 {
    if n < 2 {
        return n;
    }
    let mut x = n;
    let mut y = (x + 1) / 2;
    while y < x {
        x = y;
        y = (x + n / x) / 2;
    }
    x
}

fn transfer_in<'info>(
    program: &Interface<'info, TokenInterface>,
    from: &InterfaceAccount<'info, TokenAccount>,
    mint: &InterfaceAccount<'info, Mint>,
    to: &InterfaceAccount<'info, TokenAccount>,
    authority: &Signer<'info>,
    amount: u64,
) -> Result<()> {
    token_interface::transfer_checked(
        CpiContext::new(
            program.key(),
            TransferChecked {
                from: from.to_account_info(),
                mint: mint.to_account_info(),
                to: to.to_account_info(),
                authority: authority.to_account_info(),
            },
        ),
        amount,
        mint.decimals,
    )
}

fn transfer_out<'info>(
    program: &Interface<'info, TokenInterface>,
    from: &InterfaceAccount<'info, TokenAccount>,
    mint: &InterfaceAccount<'info, Mint>,
    to: &InterfaceAccount<'info, TokenAccount>,
    pool: &Account<'info, Pool>,
    seeds: &[&[u8]],
    amount: u64,
) -> Result<()> {
    token_interface::transfer_checked(
        CpiContext::new_with_signer(
            program.key(),
            TransferChecked {
                from: from.to_account_info(),
                mint: mint.to_account_info(),
                to: to.to_account_info(),
                authority: pool.to_account_info(),
            },
            &[seeds],
        ),
        amount,
        mint.decimals,
    )
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = 8 + Pool::INIT_SPACE,
        seeds = [POOL_SEED, mint_a.key().as_ref(), mint_b.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(mint::token_program = token_program)]
    pub mint_a: InterfaceAccount<'info, Mint>,
    #[account(mint::token_program = token_program)]
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        payer = payer,
        seeds = [VAULT_A_SEED, pool.key().as_ref()],
        bump,
        token::mint = mint_a,
        token::authority = pool,
        token::token_program = token_program
    )]
    pub vault_a: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        seeds = [VAULT_B_SEED, pool.key().as_ref()],
        bump,
        token::mint = mint_b,
        token::authority = pool,
        token::token_program = token_program
    )]
    pub vault_b: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        seeds = [LP_SEED, pool.key().as_ref()],
        bump,
        mint::decimals = LP_DECIMALS,
        mint::authority = pool,
        mint::token_program = token_program
    )]
    pub lp_mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

/// Shared by deposit and swap: every account is pinned to the pool, so a fake vault or mint fails.
#[derive(Accounts)]
pub struct Deposit<'info> {
    pub user: Signer<'info>,
    #[account(
        seeds = [POOL_SEED, pool.mint_a.as_ref(), pool.mint_b.as_ref()],
        bump = pool.bump,
        has_one = mint_a, has_one = mint_b, has_one = vault_a, has_one = vault_b, has_one = lp_mint
    )]
    pub pool: Account<'info, Pool>,
    pub mint_a: InterfaceAccount<'info, Mint>,
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub vault_a: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub lp_mint: InterfaceAccount<'info, Mint>,
    #[account(mut, token::mint = mint_a, token::authority = user, token::token_program = token_program)]
    pub user_a: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint_b, token::authority = user, token::token_program = token_program)]
    pub user_b: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = lp_mint, token::authority = user, token::token_program = token_program)]
    pub user_lp: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    pub user: Signer<'info>,
    #[account(
        seeds = [POOL_SEED, pool.mint_a.as_ref(), pool.mint_b.as_ref()],
        bump = pool.bump,
        has_one = mint_a, has_one = mint_b, has_one = vault_a, has_one = vault_b
    )]
    pub pool: Account<'info, Pool>,
    pub mint_a: InterfaceAccount<'info, Mint>,
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub vault_a: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint_a, token::authority = user, token::token_program = token_program)]
    pub user_a: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint_b, token::authority = user, token::token_program = token_program)]
    pub user_b: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub user: Signer<'info>,
    #[account(
        seeds = [POOL_SEED, pool.mint_a.as_ref(), pool.mint_b.as_ref()],
        bump = pool.bump,
        has_one = mint_a, has_one = mint_b, has_one = vault_a, has_one = vault_b, has_one = lp_mint
    )]
    pub pool: Account<'info, Pool>,
    pub mint_a: InterfaceAccount<'info, Mint>,
    pub mint_b: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub vault_a: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub lp_mint: InterfaceAccount<'info, Mint>,
    #[account(mut, token::mint = mint_a, token::authority = user, token::token_program = token_program)]
    pub user_a: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = mint_b, token::authority = user, token::token_program = token_program)]
    pub user_b: InterfaceAccount<'info, TokenAccount>,
    #[account(mut, token::mint = lp_mint, token::authority = user, token::token_program = token_program)]
    pub user_lp: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub mint_a: Pubkey,
    pub mint_b: Pubkey,
    pub vault_a: Pubkey,
    pub vault_b: Pubkey,
    pub lp_mint: Pubkey,
    pub fee_bps: u16,
    pub bump: u8,
}

#[error_code]
pub enum AmmError {
    #[msg("Fee is above the 10% cap")]
    FeeTooHigh,
    #[msg("A pool needs two different mints")]
    SameMint,
    #[msg("Amount must be more than zero")]
    ZeroAmount,
    #[msg("Result is below your minimum: price moved or the trade is too big")]
    SlippageExceeded,
    #[msg("The pool has no liquidity")]
    EmptyPool,
    #[msg("Arithmetic overflow")]
    Overflow,
}

#[cfg(test)]
mod math_tests {
    use super::*;

    #[test]
    fn deck_swap_numbers() {
        // 100/100 pool in 6-decimal units: 10 in, no fee -> 9.090909; 0.3% fee -> 9.066108
        let u = 1_000_000u64;
        assert_eq!(swap_out(100 * u, 100 * u, 10 * u, 0).unwrap(), 9_090_909);
        assert_eq!(swap_out(100 * u, 100 * u, 10 * u, 30).unwrap(), 9_066_108);
    }

    #[test]
    fn isqrt_is_exact_for_squares() {
        assert_eq!(isqrt(10_000), 100);
        assert_eq!(isqrt(10_001), 100);
        assert_eq!(isqrt(0), 0);
    }
}

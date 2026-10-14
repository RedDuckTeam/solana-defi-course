//! Week 5: Wormhole and Cashio in miniature.
//!
//! A SOL vault per user. `withdraw_unsafe` trusts the accounts it is handed: it never checks
//! that the person asking is the vault's owner, or that they signed. Anyone can drain anyone.
//! `withdraw` is the same instruction with the checks: a `Signer` and `has_one = owner`.
//!
//! The tests in `tests/exploit.rs` prove the attack works on the unsafe path and fails on the fixed one.
//! Teaching code. Never deploy `withdraw_unsafe` anywhere real.

use anchor_lang::prelude::*;

declare_id!("68e93666TsUH56DovSQF6YiiJuncwBUMWvJwnYkCwTRB");

pub const VAULT_SEED: &[u8] = b"vault";

#[program]
pub mod vault_bug {
    use super::*;

    /// Create your vault (a PDA from your address) and record you as its owner.
    pub fn open(ctx: Context<Open>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.bump = ctx.bumps.vault;
        Ok(())
    }

    /// Move SOL from your wallet into your vault.
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);
        let cpi = anchor_lang::system_program::Transfer {
            from: ctx.accounts.owner.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
        };
        anchor_lang::system_program::transfer(
            CpiContext::new(anchor_lang::system_program::ID, cpi),
            amount,
        )
    }

    /// BUG ON PURPOSE. `authority` is not a signer and is never compared to `vault.owner`.
    pub fn withdraw_unsafe(ctx: Context<WithdrawUnsafe>, amount: u64) -> Result<()> {
        move_lamports(
            &ctx.accounts.vault.to_account_info(),
            &ctx.accounts.recipient.to_account_info(),
            amount,
        )
    }

    /// The fix: the owner must sign, and the vault must belong to that signer.
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        move_lamports(
            &ctx.accounts.vault.to_account_info(),
            &ctx.accounts.owner.to_account_info(),
            amount,
        )
    }
}

/// Lamports out of a program-owned account, leaving it rent-exempt.
fn move_lamports(from: &AccountInfo, to: &AccountInfo, amount: u64) -> Result<()> {
    require!(amount > 0, VaultError::ZeroAmount);
    let rent_floor = Rent::get()?.minimum_balance(from.data_len());
    let available = from
        .lamports()
        .checked_sub(rent_floor)
        .ok_or(VaultError::InsufficientFunds)?;
    require!(amount <= available, VaultError::InsufficientFunds);

    let new_from = from
        .lamports()
        .checked_sub(amount)
        .ok_or(VaultError::InsufficientFunds)?;
    let new_to = to
        .lamports()
        .checked_add(amount)
        .ok_or(VaultError::Overflow)?;
    **from.try_borrow_mut_lamports()? = new_from;
    **to.try_borrow_mut_lamports()? = new_to;
    Ok(())
}

#[derive(Accounts)]
pub struct Open<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 + Vault::INIT_SPACE,
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawUnsafe<'info> {
    /// Any vault at all. The program checks it is a Vault account, but not whose.
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    /// CHECK: THE BUG. Not a signer, never compared to vault.owner.
    pub authority: UncheckedAccount<'info>,
    /// CHECK: Wherever the caller says the money should go.
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [VAULT_SEED, owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner
    )]
    pub vault: Account<'info, Vault>,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub bump: u8,
}

#[error_code]
pub enum VaultError {
    #[msg("Amount must be more than zero")]
    ZeroAmount,
    #[msg("Not enough SOL in the vault")]
    InsufficientFunds,
    #[msg("Arithmetic overflow")]
    Overflow,
}

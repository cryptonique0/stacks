# Stacks Whitelist Dapp

A full-stack Stacks (Bitcoin L2) dapp with a Clarity whitelist contract, a Next.js frontend, and read-only API routes.

## Prerequisites
- Node 18+
- npm
- Stacks CLI + Clarinet (install via `cargo install clarinet-cli` or use the Stacks sandbox)

## Quickstart
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables and edit as needed:
   ```bash
   cp .env.example .env.local
   # update contract address/name and network (testnet or mainnet)
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 and connect a Stacks wallet (Leather or Xverse). Use the admin wallet that deployed the contract for whitelist mutations.

## Clarity contract
- File: `contracts/whitelist.clar`
- Functions:
  - `is-whitelisted(principal)` (read-only)
  - `add-to-whitelist(principal)` (admin-only)
  - `remove-from-whitelist(principal)` (admin-only)
  - `transfer-ownership(principal)` (admin-only)

### Local/devnet with Clarinet
```bash
clarinet check
clarinet console
```
Use `settings/Devnet.toml` to point at your devnet addresses and deploy the contract, then update `.env.local` with that contract address and name.

## API
- `GET /api/whitelist/status?address=ST...` → `{ whitelisted, contractAddress, contractName, network }`

## Scripts
- `npm run dev` – start Next.js in dev mode
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – lint

## Environment
- `NEXT_PUBLIC_STACKS_NETWORK` – `testnet` or `mainnet`
- `NEXT_PUBLIC_CONTRACT_ADDRESS` – contract deployer address
- `NEXT_PUBLIC_CONTRACT_NAME` – contract name (default `whitelist`)

## Notes
- The whitelist update buttons open a contract call in the connected Stacks wallet; make sure the wallet has admin rights on the contract.
- Read-only checks work for any principal and do not require a connected wallet.

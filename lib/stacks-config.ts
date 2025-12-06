import type { StacksNetwork } from '@stacks/network';

export const STACKS_NETWORK = process.env.NEXT_PUBLIC_STACKS_NETWORK ?? 'testnet';
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N6AF3VZH';
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME ?? 'whitelist';

export const networkKey = STACKS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

export const getNetwork = (): StacksNetwork => ({
  version: STACKS_NETWORK === 'mainnet' ? 0x01 : 0x80,
  chainId: STACKS_NETWORK === 'mainnet' ? 0x00000001 : 0x80000000,
  coreApiUrl: STACKS_NETWORK === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so',
  bnsLookupUrl: STACKS_NETWORK === 'mainnet' ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so',
});

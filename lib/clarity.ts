import { callReadOnlyFunction, cvToJSON, standardPrincipalCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, STACKS_NETWORK, getNetwork } from './stacks-config';

export const checkWhitelistStatus = async (principal: string): Promise<boolean> => {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: 'is-whitelisted',
    functionArgs: [standardPrincipalCV(principal)],
    network: getNetwork(),
    senderAddress: principal,
  });

  const parsed = cvToJSON(result);
  return parsed?.value === true;
};

export const whitelistMeta = {
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  network: STACKS_NETWORK,
};

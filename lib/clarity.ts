import { cvToJSON, standardPrincipalCV, cvToValue } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, getNetwork } from './stacks-config';
import fetch from 'cross-fetch';

export const checkWhitelistStatus = async (principal: string): Promise<boolean> => {
  const network = getNetwork();
  const url = `${network.coreApiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/is-whitelisted`;
  
  const cv = standardPrincipalCV(principal);
  const hexArg = `0x${Buffer.from(cv.serialize()).toString('hex')}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: principal,
      arguments: [hexArg],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to check whitelist: ${response.statusText}`);
  }

  const data = await response.json();
  return data.okay && data.result && cvToJSON(cvToValue(data.result, true))?.value === true;
};

export const whitelistMeta = {
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
};

export const whitelistMeta = {
  contractAddress: CONTRACT_ADDRESS,
  contractName: CONTRACT_NAME,
  network: STACKS_NETWORK,
};

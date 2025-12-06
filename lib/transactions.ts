import { openContractCall } from '@stacks/connect';
import { standardPrincipalCV } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, getNetwork } from './stacks-config';
import { userSession } from './wallet';

export type WhitelistAction = 'add' | 'remove';

export const openWhitelistTx = async (
  action: WhitelistAction,
  principal: string,
  onFinish?: (txId: string) => void
) => {
  const functionName = action === 'add' ? 'add-to-whitelist' : 'remove-from-whitelist';

  await openContractCall({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs: [standardPrincipalCV(principal)],
    userSession: userSession as any,
    network: getNetwork(),
    onFinish: data => onFinish?.(data.txId),
  });
};

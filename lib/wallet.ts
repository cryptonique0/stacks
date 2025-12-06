import { AppConfig, UserSession } from '@stacks/auth';
import { networkKey } from './stacks-config';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export const getUserAddress = (): string => {
  if (!userSession.isUserSignedIn()) return '';
  const data = userSession.loadUserData() as any;
  return data?.profile?.stxAddress?.[networkKey] ?? '';
};

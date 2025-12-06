'use client';

import { useEffect, useMemo, useState } from 'react';
import { showConnect } from '@stacks/connect';
import { ArrowRightIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { checkWhitelistStatus, whitelistMeta } from '@/lib/clarity';
import { STACKS_NETWORK, getNetwork, networkKey } from '@/lib/stacks-config';
import { openWhitelistTx, type WhitelistAction } from '@/lib/transactions';
import { getUserAddress, userSession } from '@/lib/wallet';

const HomePage = () => {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [statusAddress, setStatusAddress] = useState('');
  const [statusResult, setStatusResult] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [actionAddress, setActionAddress] = useState('');
  const [actionType, setActionType] = useState<WhitelistAction>('add');
  const [banner, setBanner] = useState<string | null>(null);

  const defaultAddress = useMemo(() => statusAddress || connectedAddress, [statusAddress, connectedAddress]);

  useEffect(() => {
    const bootstrapSession = async () => {
      if (userSession.isSignInPending()) {
        await userSession.handlePendingSignIn();
      }
      if (userSession.isUserSignedIn()) {
        setConnectedAddress(getUserAddress());
      }
    };

    void bootstrapSession();
  }, []);

  const handleConnect = () => {
    showConnect({
      userSession,
      network: getNetwork(),
      appDetails: {
        name: 'Stacks Whitelist Dapp',
        icon: '',
      },
      onFinish: () => {
        setConnectedAddress(getUserAddress());
        setBanner('Wallet connected');
      },
    });
  };

  const handleDisconnect = () => {
    userSession.signUserOut();
    setConnectedAddress('');
    setStatusResult(null);
    setBanner('Wallet disconnected');
  };

  const handleStatusCheck = async () => {
    const principal = defaultAddress;
    if (!principal) {
      setBanner('Enter a Stacks principal to check');
      return;
    }

    setChecking(true);
    setBanner(null);
    try {
      const isAllowed = await checkWhitelistStatus(principal);
      setStatusResult(isAllowed ? 'Whitelisted' : 'Not whitelisted');
    } catch (error) {
      setBanner((error as Error).message);
    } finally {
      setChecking(false);
    }
  };

  const handleWhitelistAction = async () => {
    const principal = actionAddress || connectedAddress;
    if (!principal) {
      setBanner('Provide a principal address');
      return;
    }
    if (!userSession.isUserSignedIn()) {
      setBanner('Connect your wallet first');
      return;
    }

    setBanner('Review the transaction in your Stacks wallet...');
    try {
      await openWhitelistTx(actionType, principal, txId =>
        setBanner(`Submitted. Tx ID: ${txId}`)
      );
    } catch (error) {
      setBanner((error as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <header className="glass rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/70">Stacks L2</p>
            <h1 className="text-3xl sm:text-4xl font-bold">Whitelist management dapp</h1>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Connect your Stacks wallet, check whitelist eligibility, and submit admin whitelist updates on the Stacks L2.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {connectedAddress ? (
              <button onClick={handleDisconnect} className="btn-secondary px-4 py-2 rounded-full text-sm font-semibold">
                Disconnect
              </button>
            ) : (
              <button onClick={handleConnect} className="btn-primary px-4 py-2 rounded-full text-sm font-semibold">
                Connect wallet
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-300">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Network: {STACKS_NETWORK}</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Contract: {whitelistMeta.contractAddress}.{whitelistMeta.contractName}</span>
          {connectedAddress && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/30">
              Connected: {connectedAddress}
            </span>
          )}
        </div>
      </header>

      {banner && (
        <div className="glass border-l-4 border-cyan-400 rounded-xl p-4 text-sm flex items-start gap-3">
          <ArrowRightIcon className="h-5 w-5 text-cyan-300" />
          <p>{banner}</p>
        </div>
      )}

      <section className="glass rounded-2xl p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Check whitelist status</h2>
          <p className="text-slate-300 text-sm">Enter any Stacks principal or use your connected address.</p>
          <div className="space-y-3">
            <input
              value={statusAddress}
              onChange={e => setStatusAddress(e.target.value)}
              placeholder={connectedAddress ? 'Press check to use connected address' : 'SP... or ST...'}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleStatusCheck}
              className="btn-primary w-full px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
              disabled={checking}
            >
              {checking ? 'Checking...' : 'Check status'}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
          {statusResult && (
            <div className="flex items-center gap-3 text-sm">
              {statusResult === 'Whitelisted' ? (
                <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-300" />
              )}
              <p className="text-slate-200 font-medium">{statusResult}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Submit whitelist update</h2>
          <p className="text-slate-300 text-sm">Admin-only action. Transaction opens in your Stacks wallet.</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                  actionType === 'add' ? 'btn-primary border-cyan-400' : 'btn-secondary'
                }`}
                onClick={() => setActionType('add')}
              >
                Add
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                  actionType === 'remove' ? 'btn-primary border-cyan-400' : 'btn-secondary'
                }`}
                onClick={() => setActionType('remove')}
              >
                Remove
              </button>
            </div>
            <input
              value={actionAddress}
              onChange={e => setActionAddress(e.target.value)}
              placeholder={connectedAddress ? 'Defaults to your connected address' : 'Principal to modify'}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleWhitelistAction}
              className="btn-primary w-full px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              {actionType === 'add' ? 'Add to whitelist' : 'Remove from whitelist'}
            </button>
            <p className="text-xs text-slate-400">
              Make sure your connected wallet is the contract admin; otherwise the transaction will fail.
            </p>
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-6 grid md:grid-cols-3 gap-4 text-sm text-slate-300">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Contract</p>
          <p className="font-semibold text-slate-100">{whitelistMeta.contractAddress}</p>
          <p>{whitelistMeta.contractName}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Network</p>
          <p className="font-semibold text-slate-100">{STACKS_NETWORK}</p>
          <p className="text-xs">Using {networkKey} addresses</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Read-only API</p>
          <p className="font-semibold text-slate-100">GET /api/whitelist/status?address=...</p>
          <p>Returns JSON: {`{ whitelisted, contract, network }`}</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

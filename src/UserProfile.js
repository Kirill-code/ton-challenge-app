// UserProfile.js
import React from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { User } from 'lucide-react';

const UserProfile = () => {
  const wallet = useTonWallet();
  const isConnected = !!wallet;

  return (
    <div className="profile-container">
      {isConnected ? (
        <>
          <div className="profile-header">
            <div className="wallet-icon">
              <User size={48} />
            </div>
            <p className="profile-wallet">Connected Wallet</p>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <p className="detail-label">Network</p>
              <p className="detail-value">{wallet.chain}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Wallet Name</p>
              <p className="detail-value">{wallet.device.appName}</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">Platform</p>
              <p className="detail-value">{wallet.device.platform}</p>
            </div>
            <div className="wallet-connect-profile">
              <TonConnectButton />
            </div>
          </div>
        </>
      ) : (
        <div className="profile-not-connected">
          <h2>Connect Wallet</h2>
          <p>Please connect your wallet to view profile</p>
          <div className="wallet-connect-profile">
            <TonConnectButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

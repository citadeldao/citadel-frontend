import { createStore } from 'vuex';
import app from './modules/app';
import i18n from './modules/i18n';
import modal from './modules/modal';
import crypto from './modules/crypto';
import networks from './modules/networks';
import auth from './modules/auth';
import profile from './modules/profile';
import balance from './modules/balance';
import extensions from './modules/extensions';
import wallets from './modules/wallets';
import rewards from './modules/rewards';
import transactions from './modules/transactions';
import staking from './modules/staking';
import toasts from './modules/toasts';
import charts from './modules/charts';
import subtokens from './modules/subtokens';
import dao from './modules/dao';
import investors from './modules/investors';
import ktAddresses from './modules/ktAddresses';
import newWallets from './modules/newWallets';
import metamask from './modules/metamask';
import keplr from './modules/keplr';
import salary from './modules/salary';
import ledger from './modules/ledger';

import subscriptions from './modules/subscriptions';

export default createStore({
  modules: {
    app,
    modal,
    i18n,
    crypto,
    networks,
    auth,
    profile,
    balance,
    wallets,
    rewards,
    transactions,
    staking,
    toasts,
    charts,
    subtokens,
    extensions,
    dao,
    investors,
    ktAddresses,
    metamask,
    keplr,
    subscriptions,
    newWallets,
    salary,
    ledger,
  },
});

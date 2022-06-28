import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export default {
  // new
  Received: {
    icon: 'income',
    title: t('receive'),
  },
  Claim: {
    icon: 'reward',
    title: 'Rewards',
  },
  Sent: {
    icon: 'outcome',
    title: t('send'),
  },
  Vote: {
    icon: 'vote',
    title: 'Vote',
  },
  'IBC send': {
    icon: 'IBC',
    title: 'IBC',
  },
  'Custom - Update Client': {
    icon: 'IBC',
    title: 'Custom',
  },
  // old
  income: {
    icon: 'income',
    title: t('receive'),
  },
  outcome: {
    icon: 'outcome',
    title: t('send'),
  },
  swap: {
    icon: 'swap',
    title: t('swap'),
  },
  stake: {
    icon: 'stake',
    title: t('Stake'),
  },
  unstake: {
    icon: 'unstake',
    title: t('unstake'),
  },
  selfSend: {
    icon: 'self-send',
    title: 'Self-send',
  },
  delegation: {
    icon: 'delegate',
    title: 'Delegate',
  },
  reward: {
    icon: 'reward',
    title: 'Rewards',
  },
  vote: {
    icon: 'vote',
    title: 'Vote',
  },
  fee: {
    icon: 'fee',
    title: 'Validator fee',
  },
  unknown: {
    icon: 'unknown',
    title: 'Unknown',
  },
  undefined: {
    icon: 'placeholder',
    title: '???',
  },
  IBCTransfer: {
    icon: 'IBC',
    title: 'IBC',
  },
};

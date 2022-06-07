import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export const steps = [
  {
    id: 1,
    stepDesc: t('selectHardwareWallet'),
    icon: 'key',
    headerTitle: t('importExistingAddressExp'),
    headerInfo: t('chooseSuitableMethod'),
    status: 'inactive',
  },
  {
    id: 2,
    stepDesc: t('steps.importTrezor.step2stepDesc'),
    icon: 'hardware',
    headerTitle: t('steps.importTrezor.step2stepDesc'),
    headerInfo: t('steps.importTrezor.step2headerInfo'),
    status: 'active',
  },
  {
    id: 3,
    stepDesc: t('steps.connectYourDevice'),
    icon: 'squares',
    headerTitle: t('steps.connectYourDevice'),
    headerInfo: t('steps.importTrezor.step3headerInfo'),
    status: 'inactive',
  },
  {
    id: 4,
    stepDesc: t('steps.derivationPath'),
    icon: 'choose',
    headerTitle: t('steps.chooseDerivationPath'),
    headerInfo: t('steps.derivationPathInfo'),
    status: 'inactive',
  },
];
import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export const steps = [
  {
    id: 1,
    stepDesc: t('steps.addNewAddress'),
    icon: 'key',
    headerTitle: t('importExistingAddressExp'),
    headerInfo: t('chooseSuitableMethod'),
    status: 'inactive',
  },
  {
    id: 2,
    stepDesc: t('steps.createPaymentPassword'),
    icon: 'key',
    headerTitle: t('steps.createPaymentPassword'),
    headerInfo: t('steps.setPasswordForAllIn'),
    status: 'active',
  },
  {
    id: 3,
    stepDesc: t('steps.addAddressSpecifications'),
    icon: 'squares',
    headerTitle: t('steps.addAddressSpecifications'),
    headerInfo: t('steps.importSeedPhrase.step3HeaderInfo'),
    status: 'inactive',
  },
  {
    id: 4,
    stepDesc: t('steps.chooseDerivationPath'),
    icon: 'segment-path',
    headerTitle: t('steps.chooseDerivationPath'),
    headerInfo: t('steps.derivationPathInfo'),
    status: 'inactive',
  },
];
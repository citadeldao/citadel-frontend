import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export const steps = [
  {
    id: 1,
    stepDesc: t('steps.chooseImportOption'),
    icon: 'key',
    headerTitle: t('importExistingAddressExp'),
    headerInfo: t('chooseSuitableMethod'),
    status: 'inactive',
  },
  {
    id: 2,
    stepDesc: t('steps.createPassword'),
    icon: 'key',
    headerTitle: t('steps.createPassword'),
    headerInfo: t('steps.setPasswordForAllIn'),
    status: 'active',
  },
  {
    id: 3,
    stepDesc: t('steps.restoreOneSeed.step3StepDesc'),
    icon: 'text-done',
    headerTitle: t('steps.restoreOneSeed.step3HeaderTitle'),
    headerInfo: t('steps.restoreOneSeed.step3HeaderInfo'),
    status: 'inactive',
  },
  {
    id: 4,
    stepDesc: t('steps.selectNetworks'),
    icon: 'squares',
    headerTitle: t('steps.selectNetworks'),
    headerInfo: t('steps.restoreOneSeed.step4HeaderInfo'),
    status: 'inactive',
  },
];
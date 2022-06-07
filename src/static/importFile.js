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
    stepDesc: t('steps.importFile.step2StepDesc'),
    icon: 'import-file',
    headerTitle: t('steps.importFileExp'),
    headerInfo: t('steps.importFile.step2HeaderInfo'),
    status: 'active',
  },
  {
    id: 3,
    stepDesc: t('steps.importFile.step3StepDesc'),
    icon: 'key',
    headerTitle: t('steps.importFile.step3HeaderTitle'),
    headerInfo: t('steps.importFile.step3HeaderInfo'),
    status: 'inactive',
  },
];
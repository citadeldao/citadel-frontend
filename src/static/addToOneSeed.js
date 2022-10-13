import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export const steps = [
  {
    id: 1,
    stepDesc: t('steps.enterPassword'),
    icon: 'key',
    headerTitle: t('steps.enterPassword'),
    headerInfo: t('steps.addToOneSeed.step1HeaderInfo1'),
    status: 'active',
  },
  {
    id: 2,
    stepDesc: t('steps.selectNetworks'),
    icon: 'squares',
    headerTitle: t('steps.selectNetworks'),
    headerInfo: t('steps.addToOneSeed.step1HeaderInfo1'),
    status: 'inactive',
  },
];

export const steps1 = [
  {
    id: 1,
    stepDesc: t('steps.createPassword'),
    icon: 'key',
    headerTitle: t('steps.createPassword'),
    headerInfo: t('steps.setPasswordForAllIn'),
    status: 'active',
  },
  {
    id: 2,
    stepDesc: t('steps.addToOneSeed.createOneSeed'),
    icon: 'text',
    headerTitle: t('steps.addToOneSeed.createOneSeedWallet'),
    headerInfo: t('steps.addToOneSeed.step2HeaderInfo'),
    status: 'inactive',
  },
  {
    id: 3,
    stepDesc: t('steps.addToOneSeed.step3StepDesc'),
    icon: 'text-done',
    headerTitle: t('steps.addToOneSeed.step3StepDesc'),
    headerInfo: t('steps.addToOneSeed.step2HeaderInfo'),
    status: 'inactive',
  },
  // {
  //   id: 4,
  //   status: 'inactive',
  // },
  {
    id: 4,
    stepDesc: t('steps.selectNetworks'),
    icon: 'squares',
    headerTitle: t('steps.selectNetworks'),
    headerInfo: t('steps.addToOneSeed.step4headerInfo'),
    status: 'inactive',
  },
];

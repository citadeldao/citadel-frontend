<template>
  <div class="choose-importing-method">
    <SelectCard
      v-for="method in currentMethods"
      :key="method.title"
      :method="method"
      type="simple"
      :data-qa="`add-address__existing__${method.name}`"
      @click="clickHandler(method.routeName)"
    />
  </div>
</template>

<script>
import SelectCard from '@/components/SelectCard';
import { useRouter } from 'vue-router';
import { i18n } from '@/plugins/i18n';
import useCreateWallets from '@/compositions/useCreateWallets';

const { t } = i18n.global;
const methods = [
  {
    name: 'import-file',
    title: t('importExistingAddress.card4Title'),
    info: t('importExistingAddress.card4Info'),
    icon: 'file',
    hoveredIcon: 'file-hovered',
    routeName: 'ImportFile',
  },
  {
    name: 'seed-phrase',
    title: t('importExistingAddress.card1Title'),
    info: t('importExistingAddress.card1Info'),
    icon: 'seed-phrase',
    hoveredIcon: 'seed-phrase-hovered',
    routeName: 'ImportSeedPhrase',
  },
  {
    name: 'private-key',
    title: t('importExistingAddress.card2Title'),
    info: t('importExistingAddress.card2Info'),
    icon: 'key',
    hoveredIcon: 'key-hovered',
    routeName: 'ImportPrivateKey',
  },
  {
    name: 'Metamask & Keplr',
    title: 'Metamask & Keplr',
    info: t('importExistingAddress.card3Info'),
    icon: 'metamask&keplr',
    hoveredIcon: 'metamask&keplr_hover',
    routeName: 'MetamaskKeplr',
  },
];
let methods1 = [
  {
    name: 'import-file',
    title: t('importExistingAddress.card4Title'),
    info: t('importExistingAddress.card4Info'),
    icon: 'file',
    hoveredIcon: 'file-hovered',
    routeName: 'ImportFile',
  },
  {
    name: 'seed-phrase',
    title: t('importExistingAddress.card1Title'),
    info: t('importExistingAddress.card1Info'),
    icon: 'seed-phrase',
    hoveredIcon: 'seed-phrase-hovered',
    routeName: 'ImportSeedPhrase',
  },
  {
    name: 'private-key',
    title: t('importExistingAddress.card2Title'),
    info: t('importExistingAddress.card2Info'),
    icon: 'key',
    hoveredIcon: 'key-hovered',
    routeName: 'ImportPrivateKey',
  },
  {
    name: 'restore-one-seed',
    title: t('importExistingAddress.card5Title'),
    info: t('importExistingAddress.card5Info'),
    icon: 'restore-one-seed',
    hoveredIcon: 'restore-one-seed-hovered',
    routeName: 'RestoreOneSeed',
  },
  {
    name: 'Metamask & Keplr',
    title: 'Metamask & Keplr',
    info: t('importExistingAddress.card3Info'),
    icon: 'metamask&keplr',
    hoveredIcon: 'metamask&keplr_hover',
    routeName: 'MetamaskKeplr',
  },
];
export default {
  name: 'ChooseImportingMethod',
  components: { SelectCard },
  setup() {
    const router = useRouter();
    const clickHandler = (name) => {
      router.push({ name: `${name}` });
    };

    const { isUserMnemonic, isPasswordHash } = useCreateWallets();

    if (isPasswordHash.value) {
      // hide import while when has passwordhash
      methods1 = methods1.filter((m) => m.routeName !== 'ImportFile');
    }

    const currentMethods = isUserMnemonic.value ? methods : methods1;

    return { currentMethods, clickHandler };
  },
};
</script>

<style lang="scss" scoped>
.choose-importing-method {
  display: flex;
  width: 100%;
  padding-top: 82px;
  justify-content: center;
  @include lg {
    padding-top: 31px;
  }
  @include md {
    padding-top: 24px;
  }
}
</style>

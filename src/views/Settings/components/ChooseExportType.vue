<template>
  <div class="choose-export-type">
    <SelectCard
      v-if="showExportSeed"
      :method="methods[0]"
      type="simple"
      :data-qa="`settings__export--${methods[0].type}`"
      @click="$emit('chooseMethod', methods[0].methodType)"
    />
    <SelectCard
      v-if="currentExportWallet.privateKeyEncoded"
      :method="methods[1]"
      type="simple"
      :data-qa="`settings__export--${methods[1].type}`"
      @click="$emit('chooseMethod', methods[1].methodType)"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import { i18n } from '@/plugins/i18n';
import SelectCard from '@/components/SelectCard';
import { WALLET_TYPES } from '@/config/walletType';
const { t } = i18n.global;
const methods = [
  {
    type: 'one-seed',
    title: t('importExistingAddress.card1Title'),
    info: t('exportWallet.card1Info'),
    icon: 'seed-phrase',
    hoveredIcon: 'seed-phrase-hovered',
    methodType: WALLET_TYPES.ONE_SEED,
  },
  {
    type: 'private-key',
    title: t('importExistingAddress.card2Title'),
    info: t('exportWallet.card2Info'),
    icon: 'key',
    hoveredIcon: 'key-hovered',
    methodType: WALLET_TYPES.PRIVATE_KEY,
  },
];
export default {
  name: 'ChooseExportType',
  components: { SelectCard },
  props: {
    currentExportWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['chooseMethod'],
  setup(props) {
    const showExportSeed = computed(() => {
      if (props.currentExportWallet.type === WALLET_TYPES.PUBLIC_KEY) {
        return false;
      }

      // if type private key, it maybe import from oneSeed
      if (props.currentExportWallet.type === WALLET_TYPES.PRIVATE_KEY) {
        return props.currentExportWallet.importedFromSeed ? true : false;
      }

      return true;
    });

    return { methods, WALLET_TYPES, showExportSeed };
  },
};
</script>

<style lang="scss" scoped>
.choose-export-type {
  display: flex;
  margin-top: 22px;
}
</style>

<template>
  <div class="choose-importing-hardware">
    <div class="choose-importing__info-banner">
      <InfoBanner
        icon="chrome"
        :content="$t('importHardwareWallet.note')"
        color="#00A3FF"
        background="#E8F7FF"
        guide
      />
    </div>
    <div class="choose-importing-hardware__card-wrapper">
      <SelectCard
        v-for="method in methods"
        :key="method.title"
        class="select-card"
        :method="method"
        type="special"
        :data-qa="`add-address__hardware--${method.name}`"
        @click="clickHandler(method.routeName)"
      />
    </div>
  </div>
</template>

<script>
import InfoBanner from '@/components/InfoBanner';
import SelectCard from '@/components/SelectCard';
import { useRouter } from 'vue-router';
import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;
const methods = [
  {
    name: 'ledger',
    title: 'Ledger',
    info: t('importHardwareWallet.card1Info'),
    icon: 'hardware',
    hoveredIcon: 'hardware-hovered',
    routeName: 'ImportLedgerType',
  },
  {
    name: 'trezor',
    title: 'Trezor',
    info: t('importHardwareWallet.card2Info'),
    icon: 'lock',
    hoveredIcon: 'lock-hovered',
    routeName: 'ImportTrezor',
  },
];
export default {
  name: 'ChooseImportingHardware',
  components: { SelectCard, InfoBanner },
  setup() {
    const router = useRouter();
    const clickHandler = (name) => {
      router.push({ name: `${name}` });
    };

    return { methods, clickHandler };
  },
};
</script>

<style lang="scss" scoped>
.select-card {
  width: 275px;
  max-width: 275px;
  @include md {
    max-width: 137px;
    width: 137px;
  }
}
.choose-importing-hardware {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 48px;
  align-items: center;
  @include lg {
    padding-top: 31px;
  }
  @include md {
    padding-top: 24px;
  }
  &__info-banner {
    width: 570px;
    font-family: 'Panton_SemiBold';
    @include md {
      width: 483px;
    }
  }
  &__card-wrapper {
    display: flex;
    margin-top: 30px;
    @include lg {
      margin-top: 16px;
    }
  }
}
</style>

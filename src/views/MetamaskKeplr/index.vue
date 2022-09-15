<template>
  <div class="metamask-keplr">
    <Header
      :title="$t('importExistingAddressExp')"
      :info="$t('chooseSuitableMethod')"
    />
    <div class="metamask-keplr__section">
      <div class="metamask-keplr__choose-method">
        <SelectCard
          v-for="method in methods"
          :key="method.title"
          :method="method"
          type="simple"
          @click="clickHandler(method.routeName)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SelectCard from '@/components/SelectCard';
import Header from '../AddAddress/components/Header';
import { useRouter } from 'vue-router';
import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;
const methods = [
  {
    title: 'Metamask',
    info: t('metamaskKeplr.card1Info'),
    icon: 'metamask',
    hoveredIcon: 'metamask-hovered',
    routeName: 'Metamask',
  },
  {
    title: 'Keplr',
    info: t('metamaskKeplr.card2Info'),
    icon: 'keplr',
    hoveredIcon: 'keplr-hovered',
    routeName: 'Keplr',
  },
];

export default {
  name: 'MetamaskKeplr',
  components: { SelectCard, Header },
  setup() {
    const router = useRouter();
    const clickHandler = (name) => {
      router.push({ name: `${name}` });
    };

    return { clickHandler, methods };
  },
};
</script>

<style lang="scss" scoped>
.metamask-keplr {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 44px 40px;
  flex-grow: 1;
  height: 100%;
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
  }
  &__section {
    display: flex;
    flex-grow: 1;
  }
  &__choose-method {
    display: flex;
    width: 100%;
    padding-top: 82px;
    justify-content: center;
    @include lg {
      padding-top: 31px 40px;
    }
    @include md {
      padding-top: 24px 40px;
    }
  }
}
</style>

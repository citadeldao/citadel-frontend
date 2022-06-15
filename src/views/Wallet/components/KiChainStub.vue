<template>
  <div class="wrapper">
    <kiChainIcon></kiChainIcon>
    <h2>{{ $t('wallet.stubs.chain') }}</h2>
    <div class="stub_description">
      <p>
        {{ $t('wallet.stubs.description') }}
      </p>
      <p>
        {{ $t('wallet.stubs.subdescription') }}
      </p>
    </div>
  </div>
</template>
<script>
import kiChainIcon from '@/assets/icons/ki-chain.svg';
import { useI18n } from 'vue-i18n';
export default {
  name: 'KiChainStub',
  components: {
    kiChainIcon,
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  font-size: 15px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  padding: 104px 0 143px;
  @include lg {
    font-size: 12px;
  }
}
h2 {
  margin: 33px auto 11px auto;
  font-weight: 700;
  font-size: 2em;
}
.stub_description {
  line-height: 2em;
  display: flex;
  flex-direction: column;
  display: flex;
  color: #6a4bff;
  p {
    font-size: 1.2em;
    margin: 0 auto;
  }
  p:first-child {
    color: #6b93c0;
  }
}
</style>

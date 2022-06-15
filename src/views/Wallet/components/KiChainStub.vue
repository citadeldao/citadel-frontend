<template>
  <div class="wrapper">
    <kiChainIcon></kiChainIcon>
    <h2>{{ $t('wallet.stubs.chain') }}</h2>
    <div class="stub_description">
      <p>
        We’ll be back shortly! Please take into account that your funds are
        safe!
      </p>
      <p>
        Note: you will be still receiving XCT rewards if you assigned your
        address.
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
    // eslint-disable-next-line no-unused-vars
    const { t } = useI18n();
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
  @media (max-width: 1280px) {
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

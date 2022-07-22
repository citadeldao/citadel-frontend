<template>
  <div class="search-placeholder">
    <searchError />
    <span>{{ $t('searchErrorText') }}</span>
  </div>
</template>

<script>
import searchError from '@/assets/icons/search-error.svg';
export default {
  name: 'SearchPlaceholder',
  components: { searchError },
  setup() {},
};
</script>

<style lang="scss" scoped>
.search-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
  & svg {
    width: 47.5px;
    height: 48px;
    margin-bottom: 16px;
  }
  & span {
    font-size: 18px;
    line-height: 24px;
    color: $too-ligth-blue;
    text-align: center;
    width: 221px;
    @include md {
      width: 169px;
    }
  }
}
</style>

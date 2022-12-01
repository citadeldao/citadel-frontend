<template>
  <div class="not-found-placeholder">
    <NotFoundIcon />
    <p>{{ $t('notFoundPlaceholderText') }}</p>
  </div>
</template>
<script>
import NotFoundIcon from '@/assets/icons/others/not-found.svg';

export default {
  name: 'NotFoundPlaceholder',
  components: {
    NotFoundIcon,
  },
};
</script>
<style lang="scss" scoped>
.not-found-placeholder {
  width: 520px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  p {
    color: $mid-blue;
    font-family: 'Panton_SemiBold';
    font-size: $h6-size;
    @include laptop {
      font-size: $default-size;
    }
  }
}
</style>

<template>
  <div class="expand__placeholder">
    <Placeholder />
    <p class="title-text">{{ $t('netInfoGeneral.placeholderTitle') }}</p>
    <p class="description-text color-mid-blue">
      {{ $t('netInfoGeneral.placeholderDescription') }}
    </p>
  </div>
</template>

<script>
import Placeholder from '@/assets/icons/network-info/expand-placeholder.svg';
export default {
  name: 'ExpandInfoPlaceholder',
  components: {
    Placeholder,
  },
};
</script>

<style lang="scss" scoped>
.expand__placeholder {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .title-text,
  .description-text {
    margin: 0;
  }

  .title-text {
    margin: 30px 0 15px;
  }
  .description-text {
    max-width: 350px;
    text-align: center;
  }
}
</style>

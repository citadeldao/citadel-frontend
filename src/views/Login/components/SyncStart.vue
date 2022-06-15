<template>
  <div class="sync-start">
    <div class="sync-start__title">
      {{ $t('syncExtensions.syncMainTitle') }}
    </div>
    <div class="sync-start__description">
      {{ $t('syncExtensions.syncMainDescription') }}
    </div>
    <div class="sync-start__icon">
      <SyncIcon />
    </div>
    <PrimaryButton @click="redirectToStake">
      {{ $t('syncExtensions.syncMainSync') }}
    </PrimaryButton>
  </div>
</template>
<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import SyncIcon from '@/assets/icons/sync.svg';

export default {
  components: {
    PrimaryButton,
    SyncIcon,
  },
  emits: ['sync'],
  setup(_, { emit }) {
    const redirectToStake = () => {
      emit('sync');
    };

    return {
      redirectToStake,
    };
  },
};
</script>
<style lang="scss" scoped>
.sync-start {
  padding: 70px 50px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  background: $white;
  box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  border-radius: 25px;

  &__title {
    font-size: 35px;
    font-family: 'Panton_SemiBold';
    color: $black;
    text-align: center;
  }

  &__description {
    font-size: 16px;
    font-family: 'Panton_Regular';
    color: #6b93c0;
    text-align: center;
    line-height: 27px;
  }
}
</style>

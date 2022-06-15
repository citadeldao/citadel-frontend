<template>
  <div class="address-assigning-info">
    <div class="address-assigning-info__section">
      <div class="address-assigning-info__section-block">
        <div class="address-assigning-info__section-block-icon">
          <selectFromList />
        </div>
        <span class="address-assigning-info__section-block-info">
          {{ $t('xct.addressAssigningInfoModalBlock1Info') }}
        </span>
      </div>
      <div class="address-assigning-info__section-block">
        <div class="address-assigning-info__section-block-icon">
          <whiteHardware />
        </div>
        <span class="address-assigning-info__section-block-info">
          {{ $t('xct.addressAssigningInfoModalBlock2Info') }}
        </span>
      </div>
    </div>
    <span class="address-assigning-info__note">
      {{ $t('note') }}:
      <span class="address-assigning-info__note-content">
        {{ $t('xct.addressAssigningInfoModalNote') }}
      </span>
    </span>
  </div>
</template>

<script>
import selectFromList from '@/assets/icons/select-from-list.svg';
import whiteHardware from '@/assets/icons/white-hardware.svg';
export default {
  name: 'AddressAssigningInfo',
  components: { whiteHardware, selectFromList },
  setup() {},
};
</script>

<style lang="scss" scoped>
.address-assigning-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 25px 0 0 0;
  &__section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  &__section-block {
    width: 257px;
    height: 211px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 33px 0 0 0;
    border-radius: 16px;
    background: $info-block-bg-with-op;
  }
  &__section-block-icon {
    width: 72px;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $dark-blue;
    border-radius: $round;
    margin-bottom: 21px;
  }
  &__section-block-info {
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    color: $mid-blue;
    font-family: 'Panton_SemiBold';
    width: 223px;
  }
  &__note {
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    font-family: 'Panton_SemiBold';
  }
  &__note-content {
    color: $blue;
    font-family: 'Panton_SemiBold';
  }
}
</style>

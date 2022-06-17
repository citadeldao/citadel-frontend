<template>
  <div
    class="qr-address-item"
    :class="{ checked: checked }"
    @click="toggleChecked"
  >
    <div class="qr-address-item__icon">
      <done v-if="checked" class="qr-address-item__done" />
      <keep-alive v-else>
        <component :is="icon" />
      </keep-alive>
    </div>
    <div class="qr-address-item__info">
      <span class="qr-address-item__title">
        {{ address?.title ? address.title : address.address }}
      </span>
      <div class="qr-address-item__address">
        <span class="qr-address-item__address-address">
          {{ address.address }}
        </span>
        <div class="qr-address-item__address-balance">
          <span v-pretty-number="address.balance.calculatedBalance" />
          <span class="qr-address-item__address-currency">{{
            address.code
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import done from '@/assets/icons/step/done.svg';
import { ref, markRaw } from 'vue';

export default {
  name: 'QrAddressItem',
  components: { done },
  props: {
    address: {
      type: Object,
      default: () => {},
    },
    checked: {
      type: Boolean,
    },
  },
  emits: ['uncheck', 'check'],
  setup(props, { emit }) {
    const icon = ref();
    import(`@/assets/icons/token/${props.address.net}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const toggleChecked = () => {
      const action = props.checked ? 'uncheck' : 'check';
      const { address, net } = props.address;

      emit(action, { address, net });
    };

    return { icon, toggleChecked };
  },
};
</script>

<style lang="scss" scoped>
.qr-address-item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid $too-ligth-blue;
  }

  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $round;
    background: $darkgray;
    margin-right: 8px;
    pointer-events: none;

    & svg {
      fill: $white;
    }
  }

  &__done {
    width: 20px;
    height: 15px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__title {
    font-size: 16px;
    line-height: 19px;
    color: $mid-blue;
    font-family: 'Panton_Bold';
    margin-bottom: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 400px;
  }

  &__address {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__address-address {
    font-size: 12px;
    line-height: 14px;
    color: $mid-gray;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
  }

  &__address-balance {
    font-size: 14px;
    line-height: 17px;
    font-family: 'Panton_Bold';
    color: $mid-blue;
  }

  &__address-currency {
    color: $mid-gray;
    font-family: 'Panton_Regular';
  }
}

.checked {
  .qr-address-item__icon {
    background: $dark-blue;
  }

  .qr-address-item__title {
    color: $black;
  }

  .qr-address-item__address-address,
  .qr-address-item__address-balance {
    color: $dark-blue;
  }
}
</style>

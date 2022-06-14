<template>
  <div
    class="address-item"
    :class="{ checked, lastChild }"
    data-qa="address-custom"
    @click="toggleChecked"
  >
    <div class="address-item__icon">
      <done v-if="checked" class="address-item__done" />
      <keep-alive v-else>
        <component :is="icon" />
      </keep-alive>
    </div>
    <div class="address-item__info">
      <span class="address-item__title">
        {{ walletName }}
      </span>
      <div class="address-item__address">
        <span class="address-item__address-address">
          {{ address.address }}
        </span>
        <div class="address-item__address-balance">
          <span
            v-pretty-number="{
              value: address.balance.calculatedBalance,
              currency: address.code,
            }"
            class="address-item__address-balance-balance"
          />
          <span class="address-item__address-balance-currency">
            {{ address.code }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import done from '@/assets/icons/step/done.svg';
import { ref, markRaw, computed } from 'vue';

export default {
  name: 'AddressItem',
  components: { done },
  props: {
    address: {
      type: Object,
      default: () => ({}),
    },
    lastChild: {
      type: Boolean,
      default: false,
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
    const walletName = computed(
      () => props.address.title || props.address.address
    );
    const toggleChecked = () => {
      if (props.checked) {
        emit('uncheck', props.address);
      } else {
        emit('check', props.address);
      }
    };

    return { icon, toggleChecked, walletName };
  },
};
</script>

<style lang="scss" scoped>
.address-item {
  width: 100%;
  display: flex;
  align-items: center;
  height: 72px;
  border-bottom: 1px solid $too-ligth-blue;

  &.lastChild {
    border-bottom: 1px solid transparent;
  }

  cursor: pointer;
  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $round;
    background: $darkgray;
    margin-right: 8px;
    & svg {
      pointer-events: none;
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
    display: flex;
    align-items: baseline;
  }
  &__address-balance-balance {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_Bold' !important;
    color: $mid-blue;
    margin-right: 3px;
  }
  &__address-balance-currency {
    font-size: 14px;
    line-height: 16px;
    color: $mid-gray;
    font-family: 'Panton_Regular';
  }
}
.checked {
  .address-item__icon {
    background: $dark-blue;
  }
  .address-item__title {
    color: $black;
  }
  .address-item__address-address,
  .address-item__address-balance-balance {
    color: $dark-blue;
  }
}
</style>

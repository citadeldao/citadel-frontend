<template>
  <div
    class="assign-address-item"
    :class="[{ checked }, type, {}]"
    @click="toggleChecked"
  >
    <div class="assign-address-item__icon">
      <done v-if="checked" class="assign-address-item__done" />
      <keep-alive v-else>
        <component :is="icon" />
      </keep-alive>
    </div>
    <div class="assign-address-item__info">
      <div class="assign-address-item__info-line">
        <span class="assign-address-item__title" :style="{ maxWidth }">
          {{ walletName }}
        </span>
        <div
          v-if="address.assignedTo && type !== 'newAssigned'"
          class="assign-address-item__assigned-mark"
        >
          <span class="assign-address-item__assigned-mark-text">
            {{ $t('assigned') }}
          </span>
          <Tooltip>
            <template #content>
              <div class="assign-address-item__tooltip-content">
                <span class="assign-address-item__tooltip-content-title">
                  {{ $t('xct.assignAddressTooltipTitle') }}
                </span>
                <span class="assign-address-item__tooltip-content-address">
                  {{ address.assignedTo }}
                </span>
              </div>
            </template>
            <template #default>
              <info />
            </template>
          </Tooltip>
        </div>
      </div>
      <div class="assign-address-item__address">
        <span class="assign-address-item__address-address">
          {{ getMiddleCutText(address.address) }}
        </span>
        <div
          v-if="type !== 'newAssigned'"
          class="assign-address-item__address-balance"
        >
          <span
            v-pretty-number="{
              value: address?.balance?.calculatedBalance,
              currency: address.code,
            }"
            class="assign-address-item__address-balance-balance"
          />
          <span class="assign-address-item__address-balance-currency">
            {{ address.code }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="type === 'hardware'" class="assign-address-item__assign-button">
      <EditButton
        v-if="!address.signStatus"
        class="custom-lists__list-item-edit-button"
        @click="$emit('signHardwareAddress', address)"
      >
        {{ $t('confirm') }}
      </EditButton>
      <success v-else-if="address.signStatus === 'success'" />
      <refresh
        v-else-if="address.signStatus === 'retry'"
        @click="$emit('signHardwareAddress', address)"
      />
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/UI/Tooltip';
import refresh from '@/assets/icons/refresh.svg';
import success from '@/assets/icons/success.svg';
import EditButton from '@/components/UI/EditButton';
import info from '@/assets/icons/info.svg';
import done from '@/assets/icons/step/done.svg';
import { ref, markRaw, computed } from 'vue';
import { getMiddleCutText } from '@/helpers';

export default {
  name: 'AssignAddressItem',
  components: { done, info, EditButton, success, refresh, Tooltip },
  props: {
    address: {
      type: Object,
      default: () => ({}),
    },
    checked: {
      type: Boolean,
    },
    type: {
      type: String,
      default: '',
    },
  },
  emits: ['uncheck', 'check', 'signHardwareAddress'],
  setup(props, { emit }) {
    const icon = ref();
    import(`@/assets/icons/networks/${props.address.net}.svg`).then((val) => {
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

    const maxWidth = computed(() =>
      props.type === 'newAssigned'
        ? '460px'
        : props.address.assignedTo && props.type === 'hardware'
        ? '284px'
        : props.address.assignedTo
        ? '360px'
        : '380px'
    );

    return {
      icon,
      toggleChecked,
      walletName,
      maxWidth,
      getMiddleCutText,
    };
  },
};
</script>

<style lang="scss" scoped>
.assign-address-item {
  width: 100%;
  display: flex;
  align-items: center;
  height: 72px;
  border-bottom: 1px solid $too-ligth-blue;
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
    flex-shrink: 0;
    & svg {
      pointer-events: none;
      fill: $white;
      max-width: 18px;
      max-height: 20px;
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
  &__info-line {
    display: flex;
    justify-content: space-between;
    max-width: 462px;
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
  }
  &__assigned-mark {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    & svg {
      & :hover {
        fill: $too-dark-blue;
      }
    }
  }
  &__assigned-mark-text {
    font-size: 14px;
    line-height: 17px;
    color: $orange;
    font-family: 'Panton_SemiBold';
    margin-right: 8px;
  }
  &__tooltip-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__tooltip-content-title,
  &__tooltip-content-address {
    font-size: 12px;
    line-height: 16px;
    color: $too-dark-blue;
  }
  &__tooltip-content-address {
    color: $mid-blue;
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
  &__assign-button {
    margin-left: 17px;
    cursor: pointer;
    & svg {
      width: 24px;
      height: 24px;
    }
  }
}
.checked,
.newAssigned,
.assigned {
  .assign-address-item__icon {
    background: $dark-blue;
  }
  .assign-address-item__title {
    color: $black;
  }
  .assign-address-item__address-address,
  .assign-address-item__address-balance-balance {
    color: $dark-blue;
  }
}
.hardware {
  cursor: default;
}
.assigned,
.newAssigned {
  &:hover {
    cursor: initial;
  }
}

body.dark {
  .assign-address-item {
    &__title {
      color: $white;
    }

    &__tooltip-content-title {
      color: $white;
    }
  }
}
</style>

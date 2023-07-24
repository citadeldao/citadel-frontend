<template>
  <div class="ledger-protocol">
    <div class="ledger-protocol__type">Select connection type</div>
    <div class="ledger-protocol__wrap">
      <div
        :class="{ selected: connectionType === 'bluetooth' }"
        class="ledger-protocol__item"
        @click="setConnectionType('bluetooth')"
      >
        <bluetoothIcon class="scaled" />
      </div>
      <div
        :class="{ selected: connectionType === 'usb' }"
        class="ledger-protocol__item"
        @click="setConnectionType('usb')"
      >
        <usbIcon class="scaled" />
      </div>
    </div>
  </div>
</template>
<script>
import bluetoothIcon from '@/assets/icons/ledger/bluetooth.svg';
import usbIcon from '@/assets/icons/ledger/usb.svg';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  name: 'LedgerProtocol',
  components: {
    bluetoothIcon,
    usbIcon,
  },
  setup() {
    const store = useStore();

    const connectionType = computed(
      () => store.getters['ledger/connectionType']
    );

    const setConnectionType = (type) => {
      store.dispatch('ledger/setConnectionType', type);
    };

    return {
      connectionType,
      setConnectionType,
    };
  },
};
</script>
<style lang="scss" scoped>
.ledger-protocol {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__type {
    font-size: 14px;
    font-family: 'Panton_SemiBold';
    color: #9e9e9e;
  }

  &__wrap {
    display: flex;
    align-items: center;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px dashed #c3ceeb;
    width: 60px;
    height: 38px;
    margin: 0 5px 10px;

    &.selected {
      background: #c3ceeb;
    }

    .scaled {
      transform: scale(0.6);
    }

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      cursor: pointer;
      background: #f5f6fd;
    }
  }
}
</style>

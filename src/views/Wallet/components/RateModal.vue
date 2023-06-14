<template>
  <ModalContent
    :title="$t('rateModal.title')"
    :desc="$t('rateModal.description')"
    type="action"
    :submit-button="false"
    @close="$emit('close')"
  >
    <div class="rate-modal">
      <div
        v-for="(item, ndx) in filterItems"
        :key="ndx"
        :class="{ selected: ndx === activeNdx }"
        class="rate-item"
        @click="select(ndx)"
      >
        <div class="value">
          <component :is="item.component" />
        </div>
        <div>{{ item.title }} <span v-if="item.default">(default)</span></div>
        <CheckedIcon v-if="ndx === activeNdx" class="icon" />
      </div>
      <PrimaryButton @click="save" class="btn">
        {{ $t('save') }}
      </PrimaryButton>
    </div>
  </ModalContent>
</template>

<script>
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';

import CheckedIcon from '@/assets/icons/checked.svg';
import btcIcon from '@/assets/icons/rates/btc.svg';
import usdIcon from '@/assets/icons/rates/usd.svg';
import eurIcon from '@/assets/icons/rates/eur.svg';
import rubIcon from '@/assets/icons/rates/rub.svg';

import { ref, onMounted } from 'vue';

export default {
  name: 'RateModal',
  components: {
    ModalContent,
    PrimaryButton,
    CheckedIcon,
    btcIcon,
    usdIcon,
    eurIcon,
    rubIcon,
  },
  props: {
    currentWallet: {
      required: true,
    },
    walletCurrentRate: {
      required: true,
    },
  },
  emits: ['close', 'changeCurrentRate'],
  setup(props, { emit }) {
    const activeNdx = ref(0);
    const filterItems = ref(
      [
        { title: 'USD', component: 'usdIcon', default: true },
        { title: 'BTC', component: 'btcIcon', net: 'btc' },
        { title: 'EUR', component: 'eurIcon' },
        { title: 'RUB', component: 'rubIcon' },
      ].filter((w) => w.net !== props.currentWallet?.net)
    );
    const currentTitle = ref(filterItems.value[activeNdx.value].title);

    const select = (ndx) => {
      activeNdx.value = ndx;
      currentTitle.value = filterItems.value[activeNdx.value].title;
    };

    const save = () => {
      emit('changeCurrentRate', currentTitle.value);
      emit('close');
    };

    onMounted(() => {
      select(
        filterItems.value.findIndex(
          (item) => item.title === props.walletCurrentRate
        )
      );
    });

    return {
      activeNdx,
      filterItems,
      select,
      save,
    };
  },
};
</script>

<style lang="scss" scoped>
.rate-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10px;
  width: 100%;

  .btn {
    margin: 24px auto 0;
  }

  .rate-item {
    position: relative;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    background: #f0f3fd;
    transition: all 0.3s ease-in-out;
    margin-top: 8px;
    padding: 0 7px;
    box-sizing: border-box;
    color: #313354;
    display: flex;
    align-items: center;

    .icon {
      right: 16px;
      position: absolute;
    }

    span {
      color: #c3ceeb;
    }

    .value {
      background: #6b93c0;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;

      svg {
        fill: #fff;
      }
    }

    &:hover {
      cursor: pointer;
      background: #0a2778;
      color: #fff;

      span {
        color: #fbfcff70;
      }

      .value {
        background: #fff;

        svg {
          fill: #000;
        }
      }
    }

    &.selected {
      background: #6a4bff;
      color: #fff;

      .value {
        background: #fff;

        svg {
          fill: #000;
        }
      }
    }
  }
}
</style>

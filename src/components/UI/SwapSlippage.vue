<template>
  <div class="swap-slippage">
    <div class="swap-slippage__head">
      <div class="title">Slippage Settings</div>
      <closeIcon width="13" height="20" @click="$emit('close')" />
    </div>
    <div class="swap-slippage__selector">
      <div
        v-for="(item, ndx) in slippageItems"
        :key="ndx"
        :class="{
          active:
            slippage === item ||
            (slippageItems.length - 1 === ndx &&
              !slippageItems.some((item) => item == slippage)),
        }"
        class="swap-slippage__selector-item"
        @click="setSlippage(item)"
      >
        {{ item }}{{ slippageItems.length - 1 === ndx ? '' : '%' }}
      </div>
    </div>
    <div class="swap-slippage__field">
      <Input
        v-model="slippage"
        type="currency"
        @input="onInput"
        label="Slippage"
      />
    </div>
  </div>
</template>
<script>
import closeIcon from '@/assets/icons/close-icon.svg';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Input from './Input';

export default {
  components: {
    closeIcon,
    Input,
  },
  props: {
    storeName: {
      type: String,
      default: 'jupiter',
    },
  },
  setup(props) {
    const store = useStore();
    const slippage = ref('');
    const slippageItems = ref([0.1, 0.3, 0.5, 1, 2, 3, 'custom']);

    const setSlippage = (opt) => {
      if (opt === 'custom') {
        slippage.value = 5;
      } else {
        slippage.value = opt;
      }
      store.dispatch(`${props.storeName}/setSlippage`, opt);
    };

    const onInput = () => {
      if (slippage.value) {
        store.dispatch(`${props.storeName}/setSlippage`, slippage.value);
      }
    };

    onMounted(() => {
      slippage.value = store.getters[`${props.storeName}/slippage`];
    });

    return {
      slippage,
      slippageItems,
      setSlippage,
      onInput,
    };
  },
};
</script>
<style lang="scss" scoped>
.swap-slippage {
  width: 100%;
  height: 179px;
  display: flex;
  background-color: #fff;
  flex-direction: column;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
    }

    svg {
      cursor: pointer;
      fill: rgba(107, 147, 192, 1);

      &:hover {
        opacity: 0.8;
      }
    }
  }

  &__selector {
    border-radius: 100px;
    width: 100%;
    height: 49px;
    background-color: rgba(240, 243, 253, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 15px;
  }

  &__selector-item {
    margin-right: 5px;
    color: rgba(117, 106, 168, 1);
    font-size: 14px;
    width: 100%;
    height: 33px;
    background-color: #fff;
    text-align: center;
    border-radius: 117px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &.active {
      background-color: $dark-blue;
      color: #fff;
    }

    &:first-child {
      margin-left: 5px;
    }
  }

  &__field {
    width: 100%;

    input {
      width: 100%;
      height: 40px;
      padding: 0 15px;
      border: 1px solid rgba(195, 206, 235, 1);
      border-radius: 8px;
      color: rgba(107, 147, 192, 1);
    }
  }
}

body.dark {
  .swap-slippage {
    background-color: rgba(27, 28, 49, 1);

    &__head {
      color: #fff;
    }

    &__selector {
      background-color: rgba(16, 17, 32, 1);
    }

    &__selector-item {
      background-color: rgba(75, 76, 99, 1);
      color: rgba(175, 188, 203, 1);

      &.active {
        background-color: $dark-blue;
        color: #fff;
      }
    }

    &__field {
      input {
        border-color: rgba(57, 59, 83, 1);
        background-color: transparent;
      }
    }
  }
}
</style>

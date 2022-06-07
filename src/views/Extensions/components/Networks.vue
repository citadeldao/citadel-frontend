<template>
  <div class="networks">
    <div
      v-for="(item, ndx) in coins"
      :key="ndx"
      class="item"
    >
      <img
        width="16"
        height="16"
        :src="getTokenIcon(store.getters['networks/configByNet'](item.toLowerCase()).code.toLowerCase())"
      >
      {{ store.getters['networks/configByNet'](item.toLowerCase()).name }}
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { getTokenIcon } from '@/helpers';

export default {
  name: 'ActualNetworks',
  props: {
    coins: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    return {
      getTokenIcon,
      store,
    };
  },
};
</script>
<style lang="scss" scoped>
  .networks {
    display: flex;

    .item {
      display: flex;
      color: #6B93C0;
      font-size: 14px;
      font-family: 'Panton_Regular';
      margin: 0 15px 15px;

      &:first-child {
        margin-left: 0;
      }

      img {
        margin-right: 5px;
      }

      .icon {
        display: flex;
        justify-content: center;
        min-width: 30px;
      }
    }
  }
</style>

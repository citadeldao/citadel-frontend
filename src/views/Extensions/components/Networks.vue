<template>
  <div class="networks">
    <div v-for="(item, ndx) in coins?.slice(0, 6)" :key="ndx" class="item">
      <NetworkItem :icon="item" />
      <div>
        {{ store.getters['networks/configByNet'](item?.toLowerCase())?.name }}
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { getTokenIcon } from '@/helpers';
import NetworkItem from './NetworkItem.vue';

export default {
  name: 'ActualNetworks',
  components: { NetworkItem },
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
  width: 600px;
  flex-wrap: wrap;

  .item {
    width: 180px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #6b93c0;
    font-size: 14px;
    font-family: 'Panton_Regular';
    margin-bottom: 20px;

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

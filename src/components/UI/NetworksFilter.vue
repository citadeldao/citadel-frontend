<template>
  <div class="networks-filter">
    <TabsGroup
      v-model:currentValue="currentTab"
      class="chart__tabs"
      :tabs="networksFilterItems"
      expand
      @update:currentValue="currentTabChangeHandler"
    />
  </div>
</template>
<script>
import { networksFilterItems } from '@/config/availableNets';
import { ref } from 'vue';
import TabsGroup from '@/components/UI/TabsGroup';

export default {
  name: 'NetworksFilter',
  components: {
    TabsGroup,
  },
  setup(_, { emit }) {
    const currentTab = ref('all');

    const currentTabChangeHandler = (val) => {
      emit('changeCategory', val);
    };

    return {
      currentTab,
      networksFilterItems,
      currentTabChangeHandler,
    };
  },
};
</script>
<style lang="scss" scoped>
.networks-filter {
  min-width: 440px;
}
</style>

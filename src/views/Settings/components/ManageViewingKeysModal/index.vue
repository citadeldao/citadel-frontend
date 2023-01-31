<template>
  <ModalContent
    v-bind="props"
    v-click-away="() => $emit('close')"
    class="manage-vk-modal"
    @close="() => $emit('close')"
  >
    <div class="manage-vk__input-wrapper">
      <Input
        id="manageVkSearch"
        v-model="search"
        :label="$t('viewingKey.searchViewingKeys')"
        :placeholder="$t('viewingKey.tokenName')"
        icon="loop"
        type="text"
      />
    </div>
    <div class="manage-vk__vk-list">
      <VkItem v-for="(vk, index) in vkList" :key="index" :vk="vk" />
    </div>
  </ModalContent>
</template>
<script>
import Input from '@/components/UI/Input';
import VkItem from './components/VkItem';
import ModalContent from '@/components/ModalContent';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ManageViewingKeysModal',
  components: {
    Input,
    VkItem,
    ModalContent,
  },
  props: {
    wallet: {
      type: [Object, null],
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const search = ref('');

    const vkList = computed(() =>
      store.getters['subtokens/formatedSubtokens'](true, props.wallet).filter(
        (c) => {
          if (search.value) {
            return (
              c.name?.toLowerCase().includes(search.value?.toLowerCase()) &&
              c.config.standard === 'snip20'
            );
          }

          return c.config.standard === 'snip20';
        }
      )
    );

    return {
      vkList,
      search,
      props,
    };
  },
};
</script>
<style lang="scss" scoped>
.manage-vk {
  &__input-wrapper {
    max-width: 770px;
    width: 100%;
    height: 68px;
    margin-top: 25px;
  }

  &__vk-list {
    margin-top: 10px;
    display: flex;
    max-width: 770px;
    width: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    min-height: 400px;
    max-height: 625px;
    padding-bottom: 32px;
  }
  &-modal {
    max-width: 850px;
    width: 100% !important;
  }
}
</style>

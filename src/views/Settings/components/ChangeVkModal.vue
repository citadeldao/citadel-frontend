<template>
  <ModalContent
    v-bind="props"
    v-click-away="() => $emit('close')"
    @close="() => $emit('close')"
  >
    <div class="change-vk">
      <div class="change-vk__top">
        <div class="change-vk__icon-wrapper">
          <div
            v-if="showIconPlaceholder"
            class="change-vk__logo-icon-placeholder"
          >
            <span>{{ iconPlaceholder[0] }}</span>
            <span>{{ iconPlaceholder[1] }}</span>
          </div>
          <img
            v-else
            :src="getTokenIcon(vk.code.toLowerCase())"
            alt=""
            @error="showIconPlaceholder = true"
          />
        </div>
        <div class="change-vk__name">
          {{ vk.name }}
        </div>
        <div class="change-vk__vk">
          {{ vk.savedViewingKey.viewingKey }}
        </div>
      </div>
      <div class="change-vk__bottom">
        <PrimaryButton @click="createNewVk">
          {{ $t('viewingKey.createNew') }}
        </PrimaryButton>
        <div class="change-vk__delete-btn" @click="deleteVk">
          <trashCan />
          &nbsp;
          <span>{{ $t('viewingKey.deleteKey') }}</span>
        </div>
      </div>
    </div>
  </ModalContent>
</template>
<script>
import PrimaryButton from '@/components/UI/PrimaryButton.vue';
import trashCan from '@/assets/icons/trash-can.svg';
import notify from '@/plugins/notify';
import { getTokenIcon, tokenIconPlaceholder } from '@/helpers';
import { computed, ref, inject } from 'vue';
import ModalContent from '@/components/ModalContent';

export default {
  name: 'ChangeVkModal',
  components: {
    PrimaryButton,
    trashCan,
    ModalContent,
  },
  props: {
    vk: {
      type: [Object, null],
      default: null,
    },
    wallet: {
      type: [Object, null],
      default: null,
    },
  },
  setup(props) {
    const citadel = inject('citadel');
    // const store = useStore();
    const changeVk = inject('changeVk');
    const openCreateVkModal = inject('openCreateVkModal');
    const createNewVk = async () => {
      openCreateVkModal({ wallet: props.wallet, vk: props.vk });
    };
    const deleteVk = async () => {
      await citadel.deleteViewingKey(props.vk.id, props.vk.net);
      // await store.dispatch('wallets/getNewWallets','lazy');

      changeVk.value = null;
      notify({
        type: 'success',
        text: 'Deleted a key',
      });
    };

    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() => tokenIconPlaceholder(props.vk.name));

    return {
      createNewVk,
      getTokenIcon,
      showIconPlaceholder,
      iconPlaceholder,
      deleteVk,
      props,
    };
  },
};
</script>
<style lang="scss" scoped>
.change-vk {
  margin-top: 24px;
  &__top {
    display: flex;
    align-items: center;
  }
  &__icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: $darkgray;
    margin-right: 8px;
    flex-grow: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    & img {
      max-width: 25px;
      max-height: 25px;
      filter: brightness(0) invert(1);
    }
  }
  &__logo-icon-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    & span {
      font-size: 14px;
      line-height: 17px;
      color: $white;
      font-family: 'Panton_Bold';
      position: absolute;
      top: 7px;
      left: 6px;
      &:last-child {
        top: 13px;
        left: 19px;
        right: 7px;
      }
    }
  }
  &__name {
    font-weight: bold;
    font-size: 16px;
    color: $mid-blue;
    width: 100px;
    flex-grow: 0;
  }
  &__vk {
    flex-grow: 1;
    max-width: 347px;
    word-break: break-all;
    font-weight: 600;
    font-size: 14px;
    color: $royalblue1;
  }
  &__bottom {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__delete-btn {
    margin-top: 24px;
    cursor: pointer;
    color: $red;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    span {
      border-bottom: 1px solid $red;
    }
  }
}
</style>

<template>
  <CustomListsItems
    :list-data="customLists"
    :active-list="activeList"
    @edit-list="editList"
    @create-list="createList"
    @set-active-list="setActiveList"
  />

  <teleport to="body">
    <Modal v-if="showModal">
      <ModalContent
        v-if="showWarningModal"
        title="Warning"
        icon="warningIcon"
        :desc="$t('customLists.warningModalDesc')"
        button-text="ok"
        type="warning"
        @close="warningModalClickHandler"
        @buttonClick="warningModalClickHandler"
      />
      <ModalContent
        v-else
        :title="chooseWalletsData.title"
        :desc="chooseWalletsData.desc"
        button-text="save"
        type="action"
        :has-slot="mode === 'edit'"
        data-qa="create-list"
        :disabled="isLoading"
        @close="modalCloseHandler"
        @buttonClick="saveList"
      >
        <template #default>
          <CustomListModalContent
            :wallets="wallets"
            :current-custom-list="currentCustomList"
            :input-error="inputError"
            :show-warning-banner="showWarningBanner"
            :mode="mode"
          />
        </template>
        <template #cancelButton>
          <div
            v-if="mode === 'edit'"
            class="create-list__delete"
            data-qa="Delete-list"
            @click="toDeleteList"
          >
            <removeIcon />
            <span>{{ $t('customLists.deleteList') }}</span>
          </div>
        </template>
      </ModalContent>
    </Modal>
    <Modal v-if="showDeleteModal">
      <ModalContent
        v-click-away="deleteModalCloseHandler"
        button-text="save"
        type="warning"
        :submit-button="false"
        @close="deleteModalCloseHandler"
      >
        <DeleteListModalContent
          :is-loading="isLoading"
          @deleteClick="deleteList"
          @cancelClick="deleteModalCloseHandler"
        />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import { computed, provide, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import useCustomLists from '@/compositions/useCustomLists';
import useWallets from '@/compositions/useWallets';
import { i18n } from '@/plugins/i18n';

import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import CustomListsItems from './components/CustomListsItems.vue';
import CustomListModalContent from './components/CustomListModalContent';
import DeleteListModalContent from './components/DeleteListModalContent';
import removeIcon from '@/assets/icons/settings/remove.svg';

const CUSTOM_LIST_MODAL = 'custom-list-modal';

export default {
  name: 'CustomLists',
  components: {
    Modal,
    ModalContent,
    CustomListsItems,
    CustomListModalContent,
    DeleteListModalContent,
    removeIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = i18n.global;
    const { wallets } = useWallets();
    const { existInList } = useCustomLists();

    const currentCustomList = ref([]);
    const checkedWallets = ref([]);
    const mode = ref('create');
    const isLoading = ref(false);
    const showWarningModal = ref(false);
    const showWarningBanner = ref(false);
    const inputError = ref();
    const listName = ref('');

    const customLists = computed(
      () => store.getters['wallets/customWalletsList']
    );
    const activeList = computed(() => store.getters['wallets/activeList']);
    const showModal = computed(() =>
      store.getters['modal/isModalShown'](CUSTOM_LIST_MODAL)
    );

    const createList = () => {
      mode.value = 'create';
      showCustomListModal();
    };
    const editList = (list) => {
      mode.value = 'edit';
      showCustomListModal();
      currentCustomList.value = list;
      listName.value = list.name;
      checkedWallets.value = [...currentCustomList.value.wallets];
    };
    const showCustomListModal = () => {
      store.dispatch('modal/showModal', CUSTOM_LIST_MODAL);
    };
    const hideCustomListModal = () => {
      store.dispatch('modal/hideModal', CUSTOM_LIST_MODAL);
    };

    const setActiveList = (list) => {
      store.commit('wallets/SET_ACTIVE_LIST', list);
      router.push({ name: 'Overall' });
    };

    const modalCloseHandler = () => {
      hideCustomListModal();
      mode.value = 'create';
      isLoading.value = false;
      showDeleteModal.value = false;
      currentCustomList.value = [];
      showWarningModal.value = false;
      checkedWallets.value = [];
      inputError.value = '';
      showWarningBanner.value = false;
      updateListName('');
    };

    const chooseWalletsData = computed(() => {
      if (mode.value === 'create') {
        return {
          title: t('createList'),
          desc: t('customLists.createListModalDesc'),
        };
      } else if (mode.value === 'edit') {
        return {
          title: t('customLists.editList'),
          desc: t('customLists.editListModalDesc'),
        };
      }

      return {};
    });

    const showDeleteModal = ref(false);
    const toDeleteList = () => {
      showDeleteModal.value = true;
    };

    const deleteModalCloseHandler = () => {
      showDeleteModal.value = false;
    };
    const deleteList = async () => {
      isLoading.value = true;

      await store.dispatch('wallets/deleteCustomWalletsList', {
        listId: currentCustomList.value.id,
      });
      modalCloseHandler();
    };

    const updateListName = (value) => {
      listName.value = value.trim();
    };

    watch(
      () => listName.value,
      (newVal) => {
        if (newVal) {
          inputError.value = '';
        }
      }
    );

    const saveList = async () => {
      let ok;

      if (!validateBeforeSave()) {
        return;
      }

      isLoading.value = true;

      switch (mode.value) {
        case 'create':
          if (existInList(customLists.value, listName.value)) {
            inputError.value = t('customLists.duplicateName');
            showWarningModal.value = false;

            return;
          }

          ok = await store.dispatch('wallets/createCustomWalletsList', {
            name: listName.value,
            wallets: checkedWallets.value,
          });

          if (ok) {
            modalCloseHandler();
            await router.push({ name: 'Overall' });
          } else {
            isLoading.value = false;

            return;
          }

          break;

        case 'edit':
          if (
            existInList(
              customLists.value.filter(
                (item) => item.id !== currentCustomList.value.id
              ),
              listName.value
            )
          ) {
            showWarningModal.value = true;

            return;
          }

          ok = await store.dispatch('wallets/editCustomWalletsList', {
            listId: currentCustomList.value.id,
            name: listName.value,
            wallets: checkedWallets.value,
          });

          if (ok) {
            modalCloseHandler();
            await router.push({ name: 'Overall' });
          } else {
            isLoading.value = true;

            return;
          }

          break;
        default:
          break;
      }
    };

    const updateCheckedWallets = (value) => {
      checkedWallets.value = value;
    };

    watch(
      () => listName.value,
      () => {
        if (isLoading.value) isLoading.value = false;
      }
    );
    watch(
      () => checkedWallets.value,
      () => {
        showWarningBanner.value = false;
        if (isLoading.value) isLoading.value = false;
      },
      { deep: true }
    );

    const validateBeforeSave = () => {
      if (!listName.value) {
        inputError.value = t('customLists.eneterListName');

        return false;
      }

      if (!checkedWallets.value.length) {
        showWarningBanner.value = true;

        return false;
      }

      return true;
    };

    const warningModalClickHandler = () => {
      showWarningModal.value = false;
    };

    provide('listName', listName);
    provide('checkedWallets', checkedWallets);
    provide('updateListName', updateListName);
    provide('updateCheckedWallets', updateCheckedWallets);

    return {
      isLoading,
      showCustomListModal,
      hideCustomListModal,
      showModal,
      activeList,
      modalCloseHandler,
      chooseWalletsData,
      wallets,
      mode,
      toDeleteList,
      showDeleteModal,
      deleteModalCloseHandler,
      createList,
      deleteList,
      editList,
      saveList,
      currentCustomList,
      inputError,
      showWarningModal,
      customLists,
      showWarningBanner,
      listName,
      warningModalClickHandler,
      setActiveList,
    };
  },
};
</script>

<style lang="scss" scoped>
.create-list__delete {
  display: flex;
  align-items: center;
  margin-top: 24px;
  cursor: pointer;
  @include lg {
    align-self: center;
  }
  @include md {
    align-self: flex-end;
  }

  &:hover {
    & svg {
      fill: $black;
    }

    & span {
      color: $black;
    }
  }

  & svg {
    width: 18px;
    height: 22px;
    fill: $red;
    margin-right: 5px;
    transition: none;
  }

  & span {
    font-size: 18px;
    line-height: 27px;
    font-family: 'Panton_Bold';
    text-decoration-line: underline;
    color: $red;
  }
}
</style>

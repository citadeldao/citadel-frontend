<template>
  <Info
    v-if="
      currentWallet.type === WALLET_TYPES.PUBLIC_KEY &&
      currentWalletType !== WALLET_TYPES.METAMASK
    "
    title="xct.publicKeyPlaceholderTitle"
  />
  <div v-else>
    <div v-if="isDataLoading" class="wallet-rewards wallet-rewards--loading">
      <Loading />
    </div>
    <div v-else class="wallet-rewards">
      <div class="wallet-rewards__content">
        <InfoBlocks
          :unassigned-addresses="unassignedAddresses"
          :assigned-addresses="holderInfo.wallets"
          @block1ButtonClick="toAddAddresses"
          @assignedButtonClick="showAssignedAddresses"
          @unassignedButtonClick="startAddressAssigning"
        />
        <div v-if="showRewardesBlock" class="wallet-rewards__rewards-block">
          <RewardsBlock
            :holder-info="holderInfo"
            :xct-market-cap="xctMarketCap"
            :current-wallet="currentWallet"
            :total-claimed-rewards-x-c-t="totalClaimedRewardsXCT"
          />
        </div>
        <sadMad v-else class="wallet-rewards__sad-man" />
      </div>
    </div>
  </div>
  <WalletButtonsPanel
    :current-token="currentToken"
    :current-wallet="currentWallet"
    type="rewards"
    button2="manage"
    @prepareClaim="$emit('prepareClaim')"
    @button2click="startAddressAssigning"
    @prepareXctClaim="$emit('prepareXctClaim')"
  />
  <teleport v-if="isLoading" to="body">
    <Modal>
      <img src="@/assets/gif/loader.gif" alt="" />
    </Modal>
  </teleport>
  <teleport v-if="showModal" to="body">
    <Modal>
      <ModalContent
        v-if="showAssignedAddressesModal"
        v-click-away="modalCloseHandler"
        :submit-button="false"
        :title="$t('xct.assignedAddressesModalTitle')"
        :desc="$t('xct.assignedAddressesModalDesc')"
        type="action"
        @close="modalCloseHandler"
      >
        <AssignedAddressesModalContent :list="assignedAddresses" />
      </ModalContent>
      <ModalContent
        v-if="showAddressAssigningInfo"
        v-click-away="modalCloseHandler"
        :title="$t('xct.addressAssigningInfoModalTitle')"
        :desc="$t('xct.addressAssigningInfoModalDesc')"
        type="action"
        button-text="next"
        @close="modalCloseHandler"
        @buttonClick="toUnassignedAddresses"
      >
        <AddressAssigningInfo />
      </ModalContent>
      <ModalContent
        v-if="showUnassignedAddressesModal"
        v-click-away="modalCloseHandler"
        :title="$t('xct.unassignedAddressesModalTitle')"
        :desc="$t('xct.unassignedAddressesModalDesc')"
        type="action"
        button-text="next"
        :disabled="!checkedAddresses.length"
        @close="modalCloseHandler"
        @buttonClick="toApproveAssign"
      >
        <UnassignedAddressesModalContenet :list="unassignedAddresses" />
      </ModalContent>
      <ModalContent
        v-if="showApproveAsignWithPasswordModal"
        v-click-away="modalCloseHandler"
        :title="$t('enterPaymentPassword')"
        :desc="$t('xct.approveAssignWithPasswordModalDesc')"
        type="action"
        button-text="finish"
        :disabled="!!inputError"
        :has-slot="true"
        @close="modalCloseHandler"
        @buttonClick="approveAssign"
      >
        <template #default>
          <ApproveAssignWithPassword
            v-if="showPasswordForAssign"
            @approveAssign="approveAssign"
          />
        </template>

        <template #cancelButton>
          <span
            class="wallet-rewards__modal-back-button"
            @click="backToUnassignedList"
            >{{ $t('backBtn') }}</span
          >
        </template>
      </ModalContent>
      <ModalContent
        v-if="showNewAssignedAddressesModal"
        v-click-away="successClickHandler"
        :title="$t('xct.newAssignedAddressesModalTitle')"
        :desc="$t('xct.unassignedAddressesModalDesc')"
        type="action"
        button-text="ok"
        @close="successClickHandler"
        @buttonClick="successClickHandler"
      >
        <NewAssignedAddressesModal
          :list="newAssignedAddresses"
          :current-wallet="currentWallet"
        />
      </ModalContent>
      <ModalContent
        v-if="showHardwareAddressesModal"
        v-click-away="successClickHandler"
        :title="$t('hardwareWallet')"
        :desc="$t('xct.hardwareAddressesModalDesc')"
        type="action"
        button-text="finish"
        @close="successClickHandler"
        @buttonClick="hardwareAdressesModalClick"
      >
        <HardwareAddressesModal
          :list="hardwareAddresses"
          @signHardwareAddress="signHardwareAddress"
        />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import RewardsBlock from './components/RewardsBlock';
import HardwareAddressesModal from './components/HardwareAddressesModal.vue';
import NewAssignedAddressesModal from './components/NewAssignedAddressesModal.vue';
import ApproveAssignWithPassword from './components/ApproveAssignWithPassword';
import UnassignedAddressesModalContenet from './components/UnassignedAddressesModalContenet';
import AddressAssigningInfo from './components/AddressAssigningInfo';
import AssignedAddressesModalContent from './components/AssignedAddressesModalContent';
import ModalContent from '@/components/ModalContent';
import Modal from '@/components/Modal';
import InfoBlocks from './components/InfoBlocks.vue';
import { WALLET_TYPES } from '@/config/walletType';
import sadMad from '@/assets/icons/sad-man.svg';
import Loading from '@/components/Loading';
import WalletButtonsPanel from '@/components/WalletButtonsPanel';
import { ref } from '@vue/reactivity';
import { useStore } from 'vuex';
import { computed, provide } from '@vue/runtime-core';
import Info from '@/components/Info';
import useCheckPassword from '@/compositions/useCheckPassword';
import { sortByAlphabet } from '@/helpers';
import useWallets from '@/compositions/useWallets';
import notify from '@/plugins/notify';
import { useRouter } from 'vue-router';

export default {
  name: 'WalletRewards',
  components: {
    WalletButtonsPanel,
    Loading,
    sadMad,
    Info,
    InfoBlocks,
    ModalContent,
    Modal,
    AssignedAddressesModalContent,
    AddressAssigningInfo,
    UnassignedAddressesModalContenet,
    ApproveAssignWithPassword,
    NewAssignedAddressesModal,
    HardwareAddressesModal,
    RewardsBlock,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    tokenList: {
      type: Array,
      default: () => [],
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    subtokensIsLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['prepareClaim', 'prepareXctClaim'],
  setup(props) {
    const router = useRouter();
    const isLoading = ref(false);
    const isDataLoading = ref(false);
    const store = useStore();
    const xctMarketCap = ref({});

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = props.currentWallet;

      if (
        address.toLowerCase() === metamaskAddress &&
        net.includes(metamaskNet) &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return props.currentWallet.type;
    });

    const loadData = async () => {
      if (props.currentWallet.hasXCT) {
        isDataLoading.value = true;
        await store.dispatch('dao/getActivity');
        await store.dispatch('dao/getHolderInfo', props.currentWallet.id);
        await store.dispatch('dao/getRewardsXCT', props.currentWallet.id);
        await store.dispatch(
          'dao/getUnassignedAddresses',
          props.currentWallet.id
        );
        await store.dispatch(
          'dao/getTotalClaimedRewardsXCT',
          props.currentWallet.id
        );
        const { data } = await props.currentWallet.getMarketcap();
        xctMarketCap.value = data;
        isDataLoading.value = false;
      }
    };

    loadData();

    const holderInfo = computed(() => store.getters['dao/holderInfo']);
    const unassignedAddresses = computed(
      () => store.getters['dao/unassignedAddresses']
    );
    const assignedAddresses = computed(
      () => store.getters['dao/assignedAddresses']
    );
    const totalClaimedRewardsXCT = computed(
      () => store.getters['dao/totalClaimedRewardsXCT']
    );
    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
    );

    const showPasswordForAssign = computed(
      () =>
        !!unassignedAddresses.value.find((w) =>
          [WALLET_TYPES.PRIVATE_KEY, WALLET_TYPES.ONE_SEED].includes(w.type)
        )
    );

    const showModal = ref(false);
    const showAssignedAddressesModal = ref(false);
    const showAddressAssigningInfo = ref(false);
    const showUnassignedAddressesModal = ref(false);
    const showApproveAsignWithPasswordModal = ref(false);
    const showHardwareAddressesModal = ref(false);
    const showNewAssignedAddressesModal = ref(false);

    const checkedAddresses = ref([]);
    const updateCheckedAddresses = (value) => {
      checkedAddresses.value = value;
    };
    provide('updateCheckedAddresses', updateCheckedAddresses);
    provide('checkedAddresses', checkedAddresses);

    const { password, passwordError, inputError } = useCheckPassword();
    const { isHardwareWallet } = useWallets();
    const updatePassword = (value) => {
      password.value = value;
    };
    provide('password', password);
    provide('updatePassword', updatePassword);
    provide('inputError', inputError);

    const modalCloseHandler = () => {
      isLoading.value = false;
      showModal.value = false;
      showAssignedAddressesModal.value = false;
      showAddressAssigningInfo.value = false;
      showUnassignedAddressesModal.value = false;
      showApproveAsignWithPasswordModal.value = false;
      showHardwareAddressesModal.value = false;
      showNewAssignedAddressesModal.value = false;

      for (const item of checkedAddresses.value) {
        item.signStatus = '';
      }

      updateCheckedAddresses([]);
      newAssignedAddresses.value = [];
      password.value = '';
    };

    const showAssignedAddresses = async () => {
      showModal.value = true;
      isLoading.value = true;
      await store.dispatch('dao/getAssignedAddresses', props.currentWallet.id);
      isLoading.value = false;
      showAssignedAddressesModal.value = true;
    };
    const startAddressAssigning = () => {
      showModal.value = true;

      if (holderInfo.value.wallets.length) {
        showUnassignedAddressesModal.value = true;
      } else {
        showAddressAssigningInfo.value = true;
      }
    };
    const toUnassignedAddresses = () => {
      showAddressAssigningInfo.value = false;
      showUnassignedAddressesModal.value = true;
    };

    const seedAddresses = computed(() =>
      sortByAlphabet(
        checkedAddresses.value.filter(
          ({ type }) =>
            !(type === WALLET_TYPES.TREZOR) && !(type === WALLET_TYPES.LEDGER)
        ),
        'net'
      )
    );
    const hardwareAddresses = computed(() =>
      sortByAlphabet(
        checkedAddresses.value.filter(
          ({ type }) =>
            type === WALLET_TYPES.TREZOR || type === WALLET_TYPES.LEDGER
        ),
        'net'
      )
    );
    const toApproveAssign = () => {
      showUnassignedAddressesModal.value = false;

      if (seedAddresses.value.length) {
        if (!showPasswordForAssign.value) {
          try {
            approveAssign();
          } catch (err) {
            notify({
              type: 'warning',
              text: `Error signing assigned address ${err}`,
            });
          }
        } else {
          showApproveAsignWithPasswordModal.value = true;
        }
      } else {
        showHardwareAddressesModal.value = true;
      }
    };

    const backToUnassignedList = () => {
      updatePassword('');
      showApproveAsignWithPasswordModal.value = false;
      showUnassignedAddressesModal.value = true;
    };

    const newAssignedAddresses = ref([]);
    const approveAssign = async () => {
      if (passwordError.value && showPasswordForAssign.value) {
        inputError.value = passwordError.value;

        return;
      }

      showApproveAsignWithPasswordModal.value = false;
      isLoading.value = true;
      // ассайним вансидовые адреса
      let putStatus = false;

      for (const item of seedAddresses.value) {
        let resError;

        if (item.type === WALLET_TYPES.KEPLR) {
          const { data } = await item.prepareAssignToDaoMessage(item.id);
          const { id } = data;
          const keplrResult = await keplrConnector.value.sendKeplrTransaction(
            data.message.originalCosmosMsg || data.message,
            item.address,
            {
              preferNoSetFee: true,
              preferNoSetMemo: true,
            }
          );
          const { error } = await item.sendAssignToDaoMessage(
            props.currentWallet.address,
            id,
            keplrResult.signature
          );
          resError = error;
        } else {
          const { error } = await item.assignToDao({
            walletId: item.id,
            holderAddress: props.currentWallet.address,
            privateKey: item.getPrivateKeyDecoded(password.value),
          });
          resError = error;
        }

        putStatus = !resError;
        !resError && newAssignedAddresses.value.push(item);
        newAssignedAddresses.value = sortByAlphabet(
          newAssignedAddresses.value,
          'net'
        );
      }

      if (hardwareAddresses.value.length) {
        showApproveAsignWithPasswordModal.value = false;
        showHardwareAddressesModal.value = true;
        isLoading.value = false;
      } else if (putStatus) {
        showNewAssignedAddressesModal.value = true;
        showApproveAsignWithPasswordModal.value = false;
        isLoading.value = false;
      } else {
        modalCloseHandler();
        isLoading.value = false;
        showNewAssignedAddressesModal.value = false;
      }
    };

    const successClickHandler = async () => {
      modalCloseHandler();
      await loadData();
    };

    const signHardwareAddress = async (item) => {
      try {
        const { error } = await item.assignToDao({
          walletId: item.id,
          holderAddress: props.currentWallet.address,
          derivationPath: item.derivationPath,
        });

        if (!error) {
          const index = checkedAddresses.value.findIndex(
            (wlt) => wlt.net === item.net && wlt.address === item.address
          );
          checkedAddresses.value[index].signStatus = 'success';
          newAssignedAddresses.value.push(checkedAddresses.value[index]);
          newAssignedAddresses.value = sortByAlphabet(
            newAssignedAddresses.value,
            'net'
          );
        } else {
          throw error;
        }
      } catch (err) {
        console.error('Error signing assigned address', err);
        const index = checkedAddresses.value.findIndex(
          (wlt) => wlt.net === item.net && wlt.address === item.address
        );
        checkedAddresses.value[index].signStatus = 'retry';
      }
    };

    const hardwareAdressesModalClick = () => {
      if (newAssignedAddresses.value.length) {
        showHardwareAddressesModal.value = false;
        showNewAssignedAddressesModal.value = true;
      } else {
        modalCloseHandler();
      }
    };

    const toAddAddresses = () => {
      router.push({ name: 'AddAddress' });
    };

    const showRewardesBlock =
      computed(
        () =>
          +holderInfo.value.holder.totalUsdt ||
          +props.currentWallet.tokenBalance.stake ||
          +holderInfo.value.holder.claimed ||
          +totalClaimedRewardsXCT.value
      ) || +props.currentWallet.tokenBalance.rewards;

    return {
      isHardwareWallet,
      toAddAddresses,
      isLoading,
      isDataLoading,
      unassignedAddresses,
      WALLET_TYPES,
      assignedAddresses,
      showModal,
      showAssignedAddressesModal,
      modalCloseHandler,
      showAssignedAddresses,
      showAddressAssigningInfo,
      toUnassignedAddresses,
      startAddressAssigning,
      showUnassignedAddressesModal,
      toApproveAssign,
      showApproveAsignWithPasswordModal,
      approveAssign,
      inputError,
      checkedAddresses,
      backToUnassignedList,
      showNewAssignedAddressesModal,
      newAssignedAddresses,
      successClickHandler,
      showHardwareAddressesModal,
      hardwareAddresses,
      signHardwareAddress,
      holderInfo,
      xctMarketCap,
      totalClaimedRewardsXCT,
      showRewardesBlock,
      hardwareAdressesModalClick,
      currentWalletType,
      showPasswordForAssign,
    };
  },
};
</script>

<style lang="scss" scoped>
.wallet-rewards {
  width: 100%;
  min-height: 311px;
  padding: 50px 0 145px 0;
  display: flex;
  justify-content: center;

  &--loading {
    align-items: center;
    justify-content: center;
  }

  @include lg {
    padding: 25px 0 80px 0;
  }
  @include md {
    padding: 23px 0 78px 0;
  }

  &__content {
    width: 1100px;
    display: flex;
    justify-content: space-between;
    @include lg {
      align-items: center;
      justify-content: initial;
      flex-direction: column;
    }
    @include md {
      align-items: center;
      justify-content: initial;
      flex-direction: column;
    }
  }

  &__rewards-block {
    margin-top: 3px;
    @include lg {
      margin-top: 26px;
    }
    @include md {
      margin-top: 25px;
    }
  }

  &__sad-man {
    display: none;
    margin: 3px 155px 0 213px;
    @include xl {
      display: initial;
    }
  }

  &__modal-back-button {
    margin-top: 24px;
    cursor: pointer;
    font-size: 18px;
    line-height: 27px;
    text-decoration-line: underline;
    color: $too-dark-blue;
    font-family: 'Panton_Bold';

    &:hover {
      color: $blue;
    }

    @include lg {
      align-self: center;
    }
    @include md {
      align-self: flex-end;
    }
  }
}
</style>

<template>
  <div class="extensions">
    <!-- <img class="" :src="currentApp && currentApp.bg" /> -->
    <teleport to="body">
      <Modal v-if="showSuccessModal">
        <!-- SHOW SUCCESS MODAL -->
        <ModalContent
          v-click-away="closeSuccessModal"
          :title="$t('success')"
          :desc="$t('txWaitTitle')"
          button-text="ok"
          type="success"
          icon="success"
          @close="closeSuccessModal"
          @buttonClick="successClickHandler"
        >
          <SuccessModalContent
            v-model:txComment="txComment"
            :show-from="false"
            :wallet="signerWallet || metamaskSigner"
            :tx-hash="successTx"
            :fee="extensionTransactionForSign?.fee"
            :type="extensionTransactionForSign?.type"
          />
        </ModalContent>
      </Modal>
      <!-- CONFIRM RESTORE ONESEED -->
      <Modal v-if="showAppInfoModal">
        <ModalContent
          show-success-icon
          v-click-away="
            () => {
              showAppInfoModal ? (showAppInfoModal = false) : null;
            }
          "
          width="600px"
          :title="selectedApp.name"
          :desc="selectedApp.short_description"
          :internal-icon="selectedApp.logo"
          type="action"
          :submit-button="false"
          @close="showAppInfoModal = false"
        >
          <AppInfo :app="selectedApp" @launchApp="onLaunchApp" />
        </ModalContent>
      </Modal>
    </teleport>
    <Head
      :is-full-screen="showFullScreen"
      :app-logo="currentApp?.logo"
      :show-filter="!currentApp && !loading"
      :filter-items="filterItems"
      :app="selectedApp"
      @close="closeApp()"
      @search="onSearchHandler"
      @selectTags="onSelectTags"
    />
    <div
      :class="{ empty: !appsFiltered.length && searchStr.length }"
      v-if="!currentApp && !loading"
      class="extensions__apps"
    >
      <EmptyList
        v-if="!appsFiltered.length && searchStr.length"
        :title="$t('extensions.emptyList')"
      />
      <AppBlock
        v-for="(app, ndx) in appsFiltered"
        :key="ndx"
        :title="app.name"
        :logo="app.logo"
        :color="app.background_color"
        :category="app.short_description"
        :description="app.card_description"
        class="app"
        @openAppInfo="onOpenAppInfo(app.id)"
        @openApp="onOpenApp(app)"
      />
    </div>
    <div v-if="loading" class="extensions__loading">
      <Loading />
    </div>
    <FrameApp
      v-if="currentApp"
      :current-app="currentApp"
      :show-full-screen="showFullScreen"
      @close="closeApp()"
    />
    <Modal v-if="showLedgerConnect">
      <ConfirmLedgerModal
        v-if="showLedgerConnect"
        v-click-away="connectLedgerCloseHandler"
        @close="connectLedgerCloseHandler"
      />
    </Modal>
    <Modal v-if="showExtensionTransactionModal">
      <ModalContent
        :title="selectedApp.name"
        :desc="selectedApp.short_description"
        button-text="confirm"
        type="action"
        :internal-icon="selectedApp.logo"
        :disabled="confirmModalDisabled"
        :loading="signLoading"
        class="modal-content"
        @close="confirmModalCloseHandlerWithRequest"
        @buttonClick="confirmClickHandler"
      >
        <div v-if="showConfirmModalLoading" class="loader">
          <Loading />
        </div>
        <TransactionInfo
          v-else
          :extension-transaction-for-sign="extensionTransactionForSign"
          :metamask-signer="metamaskSigner"
          :signer-wallet="signerWallet"
          :incorrect-password="incorrectPassword"
          :confirm-password="confirmPassword"
          @confirmInput="confirmClickHandler"
          @changePassword="
            (pass) => {
              password = pass;
            }
          "
        />
      </ModalContent>
    </Modal>
    <!-- CREATE VK MODAL FOR SECRET APP-->
    <teleport v-if="showCreateVkModal" to="body">
      <CreateVkModal
        :address="signerWallet.address"
        :token="snip20Token"
        :token-fee="snip20TokenFee"
        :current-wallet="signerWallet"
        :app-name="selectedApp.name"
        :app-icon="selectedApp.logo"
        :redirect="false"
        @close="closeCreateVkModal({ success: false })"
        @success="closeCreateVkModal({ success: true })"
      />
    </teleport>
    <Modal v-if="messageForSign && !showLedgerConnect">
      <ModalContent
        :title="selectedApp.name"
        :desc="selectedApp.short_description"
        :internal-icon="selectedApp.logo"
        :disabled="false"
        :button-text="$t('extensions.signMessage')"
        :button-text2="$t('cancel')"
        type="action"
        class="modal-content"
        @close="closeSignMessageModal"
        @buttonClick2="closeSignMessageModal"
        @buttonClick="signMessage"
      >
        <MessageInfo
          :msg-success-signature="msgSuccessSignature"
          :signer-wallet="signerWallet"
          :message-for-sign="messageForSign"
          :incorrect-password="incorrectPassword"
          :confirm-password="confirmPassword"
          @changePassword="
            (pass) => {
              password = pass;
            }
          "
        />
      </ModalContent>
    </Modal>
  </div>
</template>
<script>
import {
  hideArtefactsForFullScreen,
  showArtefactsForNormalScreen,
} from '@/helpers/fullScreen';
import Loading from '@/components/Loading';
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import Modal from '@/components/Modal';
import CreateVkModal from '@/views/Wallet/components/CreateVkModal.vue';
import ModalContent from '@/components/ModalContent';
import { useStore } from 'vuex';
import Head from './components/Head';
import AppBlock from './components/AppBlock';
import AppInfo from './components/AppInfo';
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent.vue';
import { WALLET_TYPES, PRIVATE_PASSWORD_TYPES } from '@/config/walletType';
import { sha3_256 } from 'js-sha3';
import { useRouter, useRoute } from 'vue-router';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import notify from '@/plugins/notify';
import useWallets from '@/compositions/useWallets';
import extensionsSocketTypes from '@/config/extensionsSocketTypes';

import useApi from '@/api/useApi';
// import { keplrNetworksProtobufFormat } from '@/config/availableNets';
import citadel from '@citadeldao/lib-citadel';
import TransactionInfo from './components/TransactionInfo';
import MessageInfo from './components/MessageInfo';
import FrameApp from './components/FrameApp.vue';
import { parseTagsList, filteredApps } from './components/helpers';
import EmptyList from '@/components/EmptyList';

export default {
  name: 'Extensions',
  components: {
    ConfirmLedgerModal,
    CreateVkModal,
    Head,
    AppBlock,
    AppInfo,
    SuccessModalContent,
    Loading,
    Modal,
    ModalContent,
    TransactionInfo,
    MessageInfo,
    FrameApp,
    EmptyList,
  },
  setup() {
    const signLoading = ref(false);
    const showFullScreen = ref(false);
    const assetsDomain = ref('https://extensions-admin-test.3ahtim54r.ru/api/');
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const password = ref('');
    const currentApp = ref(null);
    const loading = ref(false);
    const confirmModalDisabled = ref(false);
    const showSuccessModal = ref(false);
    const searchStr = ref('');
    const showAppInfoModal = ref(false);
    const selectedApp = ref(null);
    const successTx = ref('');
    const confirmPassword = ref(false);
    const signerWallet = ref(null);
    const metamaskSigner = ref(null);
    const txComment = ref('');
    const showLedgerConnect = ref(false);
    const ledgerError = ref('');
    const msgSuccessSignature = ref('');
    const snip20TokenFee = ref(null);
    const snip20Token = ref({});
    const showCreateVkModal = ref(false);
    const showConfirmModalLoading = ref(false);
    const selectedTags = ref([]);
    const localAppMode = ref(false);

    let keplrTimer = null;
    const firstAddressChecked = ref(false);

    const scrtAddress = ref('');

    onBeforeUnmount(() => {
      clearInterval(keplrTimer);
    });

    const { wallets: walletsList } = useWallets();

    const connectLedgerCloseHandler = () => {
      showLedgerConnect.value = false;
    };

    const connectLedgerClickHandler = () => {
      ledgerError.value = '';
      confirmClickHandler();
    };

    const extensionsList = computed(
      () => store.getters['extensions/extensionsList']
    );

    const filterItems = computed(() => parseTagsList(extensionsList.value));

    if (!extensionsList.value.length) {
      store.dispatch('extensions/fetchExtensionsList');
    }

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    const clearStates = () => {
      confirmPassword.value = false;
      showSuccessModal.value = false;
      successTx.value = '';
      password.value = '';
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: currentApp.value.networks[0],
          hash: successTx.value[0],
          text: txComment.value,
        }));
      txComment.value = '';

      clearStates();
    };

    const currentAppInfo = computed(
      () => store.getters['extensions/currentAppInfo']
    );

    const sendMSG = (message, type) => {
      store.dispatch('extensions/sendCustomMsg', {
        token: currentAppInfo.value.token,
        message,
        type,
      });
    };

    const closeSuccessModal = () => {
      clearStates();
      sendMSG(
        extensionsSocketTypes.messages.success,
        extensionsSocketTypes.types.transaction
      );
    };

    const onSearchHandler = (str) => {
      searchStr.value = str;
    };

    const onSelectTags = (tags) => {
      selectedTags.value = tags;
    };

    const launchApp = () => {};
    const closeApp = (stopRedirect) => {
      clearInterval(keplrTimer);
      currentApp.value = null;
      selectedApp.value = null;

      const apps = store.getters['extensions/extensionsList'].filter(
        (app) => !app.devCenterApp
      );
      store.commit('extensions/SET_EXTENSIONS_LIST', apps);

      if (!stopRedirect) {
        showFullScreen.value = false;
        showArtefactsForNormalScreen();
        router.push({ name: 'Extensions' });
      }
    };

    const messageForSign = computed(
      () => store.getters['extensions/extensionMessageForSign']
    );

    const extensionTransactionForSign = computed(
      () => store.getters['extensions/extensionTransactionForSign']
    );

    const showExtensionTransactionModal = computed(
      () =>
        !showLedgerConnect.value &&
        extensionTransactionForSign.value &&
        !extensionTransactionForSign.value?.error_type &&
        extensionTransactionForSign.value?.type !==
          extensionsSocketTypes.types.generateVK
    );

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
    );

    const selectApp = async () => {
      showAppInfoModal.value = false;
      currentApp.value = null;
      showFullScreen.value = true;
      hideArtefactsForFullScreen();

      if (!selectedApp.value.citadelApp) {
        await store.dispatch('extensions/fetchExtensionInfo', {
          appId: selectedApp.value.id,
        });
      }

      const nets = selectedApp.value.networks.map((net) => {
        return net.toLowerCase();
      });

      let mergeWallet = null; // metamask

      if (nets.includes(metamaskConnector.value.network)) {
        const metamaskNet = metamaskConnector.value.network;
        const metamaskAddress =
          metamaskConnector.value.accounts[0] &&
          metamaskConnector.value.accounts[0].toLowerCase();

        mergeWallet = walletsList.value.find(
          (w) =>
            w.type === WALLET_TYPES.PUBLIC_KEY &&
            metamaskNet === w.net &&
            metamaskAddress === w.address.toLowerCase()
        );
      }

      if (currentAppInfo?.value?.token || selectedApp.value.citadelApp) {
        const nets = selectedApp.value.networks.map((net) => {
          return net.toLowerCase();
        });
        const wallets = await Promise.all(
          walletsList.value
            .filter(
              (w) =>
                nets.includes(w.net.toLowerCase()) &&
                w.type !== WALLET_TYPES.PUBLIC_KEY
            )
            .map(async (w) => ({
              address: w.address,
              net: w.net,
              type: w.type,
              publicKey:
                (w.getPublicKeyDecoded && (await w.getPublicKeyDecoded())) ||
                null,
            }))
        );

        if (mergeWallet) {
          wallets.push({
            address: mergeWallet.address,
            net: mergeWallet.net,
            from: 'metamask',
          });
        }

        selectedApp.value.url += `?token=${
          currentAppInfo.value?.token
        }&wallets=${JSON.stringify(wallets)}`;
        currentApp.value = selectedApp.value;
      }
    };

    const startKeplrSecretChecker = async () => {
      // shade
      if ([17, 22, 26].includes(+selectedApp.value?.id)) {
        keplrTimer = setInterval(async () => {
          if (firstAddressChecked.value && !scrtAddress.value) {
            return;
          }

          await store.dispatch('keplr/connectToKeplr', { chainId: 'secret-4' });
          const secretAddress = keplrConnector.value.accounts[0];
          scrtAddress.value = secretAddress;
          firstAddressChecked.value = true;
        }, 5000);
      }
    };

    if (route.params.name) {
      selectedApp.value = Object.assign(
        {},
        extensionsList.value.find(
          (a) => a.slug.toLowerCase() === route.params.name.toLowerCase()
        )
      );
      startKeplrSecretChecker();

      if (!selectedApp.value.id) {
        router.push({ name: 'Extensions' });
      } else {
        selectApp();
      }
    } else {
      closeApp(true);
    }

    const onOpenApp = (app) => {
      if (app.citadelApp) {
        router.push({ name: 'multisender' });
        localAppMode.value = true;
        return;
      }
      localAppMode.value = false;
      selectedApp.value = Object.assign(
        {},
        extensionsList.value.find((a) => +a.id === +app.id)
      );
      router.push({
        name: 'Extensions',
        params: { name: selectedApp.value.slug },
      });
    };

    const onOpenAppInfo = (app) => {
      selectedApp.value = Object.assign(
        {},
        extensionsList.value.find((a) => +a.id === +app)
      );
      showAppInfoModal.value = true;
    };

    const appsFiltered = computed(() => {
      return filteredApps(
        extensionsList.value,
        selectedTags.value,
        filterItems.value,
        searchStr.value
      );
    });

    watch(
      () => messageForSign.value,
      async () => {
        if (messageForSign.value) {
          const currentAddress = messageForSign.value.address;
          const nets = currentApp.value.networks.map((net) => {
            return net.toLowerCase();
          });
          signerWallet.value = walletsList.value.find(
            (w) =>
              w.address.toLowerCase() === currentAddress.toLowerCase() &&
              nets.includes(w.net.toLowerCase())
          );
        }
      }
    );

    watch(
      () => scrtAddress.value,
      (newV) => {
        if (newV?.address) {
          const win = window.frames.target;
          win &&
            win.postMessage(
              {
                from: 'keplr',
                address: newV.address,
                net: 'secret',
              },
              selectedApp.value.url
            );
        }
      }
    );

    watch(
      () => metamaskConnector.value.accounts,
      (newV) => {
        if (
          newV &&
          newV[0] &&
          selectedApp.value &&
          [6, 7].includes(+selectedApp.value.id)
        ) {
          const metamaskNet =
            metamaskConnector.value.chainId === 56
              ? 'bsc'
              : metamaskConnector.value.chainId === 1
              ? 'eth'
              : 'polygon';
          const metamaskAddress = newV[0] && newV[0].toLowerCase();

          const findWallet = walletsList.value.find(
            (w) =>
              w.type === WALLET_TYPES.PUBLIC_KEY &&
              metamaskNet === w.net &&
              metamaskAddress === w.address.toLowerCase()
          );

          const win = window.frames.target;
          win &&
            win.postMessage(
              {
                from: 'metamask',
                address: findWallet ? findWallet.address : null,
                net: findWallet ? findWallet.net : null,
              },
              selectedApp.value.url
            );
        }
      }
    );

    watch(extensionTransactionForSign, async () => {
      if (extensionTransactionForSign?.value?.transaction) {
        const currentAddress = extensionTransactionForSign.value.address;
        const currentNet = extensionTransactionForSign.value.net;

        // const nets = currentApp.value.networks.map((net) => {
        //   return net.toLowerCase();
        // });

        signerWallet.value = walletsList.value.find(
          (w) =>
            w.address.toLowerCase() === currentAddress.toLowerCase() &&
            w.net === currentNet &&
            w.type !== WALLET_TYPES.PUBLIC_KEY
        );

        // signerWallet.value = privateWallets.value.find(w => w.address.toLowerCase() === currentAddress.toLowerCase() && nets.includes(w.net.toLowerCase()));

        if (!signerWallet.value) {
          // metamask with public type
          const metamaskNet = metamaskConnector.value.network;
          const metamaskAddress =
            metamaskConnector.value.accounts[0] &&
            metamaskConnector.value.accounts[0].toLowerCase();
          metamaskSigner.value = walletsList.value.find(
            (w) =>
              w.type === WALLET_TYPES.PUBLIC_KEY &&
              metamaskNet === w.net &&
              metamaskAddress === w.address.toLowerCase()
          );
        } else {
          metamaskSigner.value = null;
        }

        // FOR SECRET DEV: set viewingKey
        if (
          extensionTransactionForSign?.value?.type ===
          extensionsSocketTypes.types.generateVK
        ) {
          // set token
          const { data: tokens } = citadel.getTokensById(signerWallet.value.id);
          // get config
          const tokenConfig = Object.values(tokens).find(
            ({ address }) =>
              address === extensionTransactionForSign.value.messageScrt.contract
          );
          snip20Token.value = {
            ...tokenConfig,
            // for txURL
            id: signerWallet.value.id,
            getTxUrl: signerWallet.value.getTxUrl,
          };

          // get fee
          snip20TokenFee.value = (
            await signerWallet.value.getFees(
              signerWallet.value.id,
              snip20Token.value.net
            )
          )?.data?.medium?.fee;
          showCreateVkModal.value = true;
        }
      }
    });

    watch(route, (route) => {
      if (localAppMode.value) {
        router.push({ name: 'multisender' });
        return;
      }
      if (!route.params.name) {
        closeApp(true);
        showFullScreen.value = false;
        showArtefactsForNormalScreen();
      } else {
        selectedApp.value = Object.assign(
          {},
          extensionsList.value.find((a) => a.slug === route.params.name)
        );

        if (selectedApp.value.id) {
          selectApp();
        }
        startKeplrSecretChecker();
      }
    });

    const confirmModalCloseHandlerWithRequest = () => {
      password.value = '';
      signLoading.value = false;
      confirmPassword.value = false;
      store.commit('extensions/SET_TRANSACTION_FOR_SIGN', null, { root: true });

      sendMSG(
        extensionsSocketTypes.messages.canceled,
        extensionsSocketTypes.types.transaction
      );
    };

    const closeSignMessageModal = () => {
      password.value = '';
      confirmPassword.value = false;

      if (!msgSuccessSignature.value) {
        sendMSG(
          extensionsSocketTypes.messages.canceled,
          extensionsSocketTypes.types.message
        );
      }

      msgSuccessSignature.value = '';
      showLedgerConnect.value = false;
      store.commit('extensions/SET_MESSAGE_FOR_SIGN', null, { root: true });
    };

    // for secret dev
    const closeCreateVkModal = async ({ success } = {}) => {
      if (!extensionTransactionForSign.value) {
        return;
      }
      try {
        // close modals
        showCreateVkModal.value = false;
        // set default values

        // send success or cancel message
        sendMSG(
          success
            ? extensionsSocketTypes.messages.success
            : extensionsSocketTypes.messages.canceled,
          extensionsSocketTypes.types.message
        );

        // if success, send new balance (move to app)
        const { data } = await citadel.getBalanceById(
          signerWallet.value.id,
          snip20Token.value.net
        );

        data &&
          store.dispatch('extensions/sendCustomMsg', {
            token: currentAppInfo.value.token,
            message: {
              address: signerWallet.value.address,
              balance: data.calculatedBalance,
              tokenContract: snip20Token.value.address,
            },
            type: extensionsSocketTypes.types.balance,
          });

        snip20TokenFee.value = null;
        snip20Token.value = null;
      } catch (error) {
        sendMSG(
          extensionsSocketTypes.messages.failed,
          extensionsSocketTypes.types.transaction
        );
      } finally {
        store.commit('extensions/SET_TRANSACTION_FOR_SIGN', null, {
          root: true,
        });
      }
    };

    const signMessage = async () => {
      if (signerWallet.value.type === WALLET_TYPES.KEPLR) {
        const keplrResult = await keplrConnector.value.sendKeplrTransaction(
          messageForSign.value.message,
          signerWallet.value.address,
          {
            preferNoSetFee: true,
            preferNoSetMemo: true,
          }
        );

        if (keplrResult.signature) {
          msgSuccessSignature.value = keplrResult.signature;
          sendMSG(keplrResult.signature, extensionsSocketTypes.types.message);
        }
        return;
      }

      if (signerWallet.value.type === WALLET_TYPES.LEDGER) {
        showLedgerConnect.value = true;
      }

      confirmPassword.value = true;

      if (
        PRIVATE_PASSWORD_TYPES.includes(signerWallet.value.type) &&
        incorrectPassword.value
      ) {
        return;
      }

      try {
        // const signResult = await signerWallet.value.signAndSendTransfer({
        //   walletId: signerWallet.value.id,
        //   rawTransaction: messageForSign.value.message,
        //   privateKey:
        //     password.value &&
        //     (await signerWallet.value.getPrivateKeyDecoded(password.value)),
        //   derivationPath: signerWallet.value.derivationPath,
        //   proxy: false,
        // });
        // const signResult = await signerWallet.value.signMessage(
        //   messageForSign.value.message,
        //   password.value,
        //   signerWallet.value.derivationPath
        // );
        // showLedgerConnect.value = false;
        // msgSuccessSignature.value = signResult;
        // sendMSG(msgSuccessSignature.value, extensionsSocketTypes.types.message);
      } catch (err) {
        showLedgerConnect.value = false;
        notify({
          type: 'warning',
          text: JSON.stringify(err),
        });
        sendMSG(
          extensionsSocketTypes.messages.failed,
          extensionsSocketTypes.types.message
        );
      }
    };

    const confirmModalCloseHandler = () => {
      password.value = '';
      store.commit('extensions/SET_TRANSACTION_FOR_SIGN', null, { root: true });
    };

    const confirmClickHandler = async () => {
      signLoading.value = true;

      if (
        signerWallet.value &&
        signerWallet.value.type === WALLET_TYPES.KEPLR &&
        !extensionTransactionForSign.value.messageScrt
      ) {
        let keplrResult;

        // const signType = keplrConnector.value.getSignType(
        //   extensionTransactionForSign.value
        // );

        try {
          keplrResult = await keplrConnector.value.sendKeplrTransaction(
            extensionTransactionForSign.value,
            signerWallet.value.address,
            { preferNoSetFee: true }
          );
          signLoading.value = false;
        } catch (err) {
          notify({
            type: 'warning',
            text: JSON.stringify(err),
          });
          confirmPassword.value = false;
          password.value = '';
          signLoading.value = false;
          return;
        }

        if (keplrResult.error) {
          notify({
            type: 'warning',
            text: keplrResult.error,
          });

          return;
        }

        const hash = await keplrConnector.value.getOutputHash(
          signerWallet.value,
          extensionTransactionForSign.value,
          keplrResult
        );

        const data = await useApi('wallet').sendSignedTransaction({
          hash,
          deviceType: WALLET_TYPES.KEPLR,
          proxy: false,
          network: signerWallet.value.net,
          from: signerWallet.value.address,
          mem_tx_id: extensionTransactionForSign.value.mem_tx_id || null,
        });

        if (data.ok) {
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          successTx.value = [data.data.txhash];
          confirmModalDisabled.value = false;
          confirmModalCloseHandler();
          showSuccessModal.value = true;
          signLoading.value = false;
          sendMSG();
        } else {
          signLoading.value = false;
          confirmPassword.value = false;
          password.value = '';
          signLoading.value = false;
          notify({
            type: 'warning',
            text: data.error,
          });

          return;
        }

        return;
      }

      // metamask, ...
      if (metamaskSigner.value) {
        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            extensionTransactionForSign.value.transaction,
            extensionTransactionForSign.value.mem_tx_id
          );

        if (metamaskResult.error) {
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
          sendMSG(
            extensionsSocketTypes.messages.failed,
            extensionsSocketTypes.types.transaction
          );
          signLoading.value = false;
        } else {
          signLoading.value = false;
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          successTx.value = [metamaskResult.txHash];

          confirmModalDisabled.value = false;
          confirmModalCloseHandler();
          showSuccessModal.value = true;
          sendMSG(
            extensionsSocketTypes.messages.success,
            extensionsSocketTypes.types.transaction
          );
        }

        return;
      }

      confirmPassword.value = true;

      if (
        PRIVATE_PASSWORD_TYPES.includes(signerWallet.value.type) &&
        incorrectPassword.value
      ) {
        signLoading.value = false;
        return;
      }

      if (signerWallet.value.type === WALLET_TYPES.LEDGER) {
        showLedgerConnect.value = true;
      }

      let result;

      try {
        // FOR SECRET DEV: EXECUTE CONTRACT
        if (
          extensionTransactionForSign.value.messageScrt &&
          extensionTransactionForSign.value.type ===
            extensionsSocketTypes.types.execute
        ) {
          if (signerWallet.value.type !== WALLET_TYPES.LEDGER) {
            showConfirmModalLoading.value = true;
          } else {
            showConfirmModalLoading.value = false;

            // for ledger catch sign finish and start event and then show loader until sign is completed
            citadel.addEventListener('ledgerSigningFinished', () => {
              showLedgerConnect.value = false;
              showConfirmModalLoading.value = true;
            });

            citadel.addEventListener('ledgerSigningStarted', () => {
              showConfirmModalLoading.value = false;
              showLedgerConnect.value = true;
            });
          }

          let response = null;
          if (Array.isArray(extensionTransactionForSign.value.messageScrt)) {
            response = await citadel.executeMessageCollection(
              signerWallet.value.id,
              extensionTransactionForSign.value.messageScrt,
              {
                privateKey:
                  password.value &&
                  (await signerWallet.value.getPrivateKeyDecoded(
                    password.value
                  )),
                derivationPath: signerWallet.value.derivationPath,
              }
            );

            // execute message collections
          } else {
            // execute contract
            response = await citadel.executeContract(signerWallet.value.id, {
              privateKey:
                password.value &&
                (await signerWallet.value.getPrivateKeyDecoded(password.value)),
              proxy: false,
              derivationPath: signerWallet.value.derivationPath,
              ...extensionTransactionForSign.value.messageScrt,
            });
            // remove listener
            citadel.addEventListener('ledgerSigningFinished', () => {});
          }
          // remove listeners
          citadel.addEventListener('ledgerSigningFinished', () => {});
          citadel.addEventListener('ledgerSigningStarted', () => {});
          // send success message to app
          if (response?.data) {
            signLoading.value = false;
            showLedgerConnect.value = false;
            successTx.value = response.data;
            confirmModalDisabled.value = false;
            confirmModalCloseHandler();
            showConfirmModalLoading.value = false;
            showSuccessModal.value = true;
            sendMSG(
              extensionsSocketTypes.messages.success,
              extensionsSocketTypes.types.execute
            );
          } else {
            sendMSG(
              extensionsSocketTypes.messages.failed,
              extensionsSocketTypes.types.execute
            );
            showLedgerConnect.value = false;
            confirmModalDisabled.value = false;
            showConfirmModalLoading.value = false;
            signLoading.value = false;
            password.value = '';
            confirmPassword.value = false;
            confirmModalCloseHandler();
            notify({
              type: 'warning',
              text: response?.error,
            });
          }
          return;
        }

        result = await signerWallet.value.signAndSendTransfer({
          walletId: signerWallet.value.id,
          rawTransaction: extensionTransactionForSign.value,
          privateKey:
            password.value &&
            (await signerWallet.value.getPrivateKeyDecoded(password.value)),
          derivationPath: signerWallet.value.derivationPath,
          proxy: false,
        });

        if (
          typeof result.data[0] === 'string' &&
          [64, 66].includes(result.data[0].length)
        ) {
          signLoading.value = false;
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          successTx.value = result.data;
          confirmModalCloseHandler();
          showSuccessModal.value = true;
          sendMSG();
        } else {
          signLoading.value = false;
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          confirmModalCloseHandler();
          notify({
            type: 'warning',
            text: JSON.stringify(result),
          });
        }
      } catch (e) {
        signLoading.value = false;
        sendMSG(
          extensionsSocketTypes.messages.failed,
          extensionsSocketTypes.types.transaction
        );
        ledgerError.value = e;
        showLedgerConnect.value = false;
      }
    };

    const onLaunchApp = () => {
      if (selectedApp.value.citadelApp) {
        router.push({ name: 'multisender' });
        localAppMode.value = true;
        return;
      }

      router.push({
        name: 'Extensions',
        params: { name: selectedApp.value.name },
      });
    };

    /* eslint-disable */
    return {
      onLaunchApp,
      showFullScreen,
      router,
      assetsDomain,
      WALLET_TYPES,
      txComment,
      extensionsList,
      confirmPassword,
      signerWallet,
      metamaskSigner,
      incorrectPassword,
      successTx,
      closeSuccessModal,
      successClickHandler,
      showSuccessModal,
      showAppInfoModal,
      selectedApp,
      onOpenAppInfo,
      onOpenApp,
      launchApp,
      closeApp,
      appsFiltered,
      onSearchHandler,
      onSelectTags,
      password,
      currentApp,
      extensionTransactionForSign,
      messageForSign,
      loading,
      selectApp,
      confirmModalDisabled,
      confirmModalCloseHandler,
      confirmModalCloseHandlerWithRequest,
      confirmClickHandler,
      filterItems,
      signLoading,
      searchStr,

      //ledgers
      showLedgerConnect,
      connectLedgerCloseHandler,
      connectLedgerClickHandler,
      ledgerError,

      // message
      msgSuccessSignature,
      closeSignMessageModal,
      signMessage,
      snip20TokenFee,
      snip20Token,
      closeCreateVkModal,
      showCreateVkModal,
      showExtensionTransactionModal,
      showConfirmModalLoading,
    };
  },
};
</script>
<style lang="scss" scoped>
.extensions {
  width: 100%;
  margin: 0 auto;
  max-width: 1628px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;

  &__apps {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding: 25px;
    box-sizing: border-box;
    z-index: 0;
    float: left;
    background: $white;
    border-radius: 0 0 16px 16px;

    &.empty {
      height: calc(100vh - 215px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 15px;
    width: 100%;
    height: 100vh;
    // margin-top: 150px;
    z-index: 10;
  }

  &__app {
    width: 140px;
    height: 45px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    margin: 0 10px;
    z-index: 10;

    &:hover {
      cursor: pointer;
      background: #6a4bff;
      color: #fff;
    }
  }

  .loader {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: white;
    z-index: 10;
  }
}
</style>

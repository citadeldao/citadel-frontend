<template>
  <div :style="{ backgroundImage: `url(${appBackground})` }" class="extensions">
    <!-- <img class="" :src="currentApp && currentApp.bg" /> -->
    <teleport to="body">
      <Modal v-if="showSuccessModal">
        <!-- SHOW SUCCESS MODAL -->
        <ModalContent
          v-click-away="closeSuccessModal"
          title="Success"
          desc="It may take some time for the transaction to complete"
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
      <!-- CONFIRM RESOTRE ONESEED -->
      <Modal v-if="showAppInfoModal">
        <ModalContent
          v-click-away="
            () => {
              showAppInfoModal ? (showAppInfoModal = false) : null;
            }
          "
          width="900px"
          :title="selectedApp.name"
          :desc="selectedApp.short_description"
          :internal-icon="selectedApp.logo"
          type="action"
          :submit-button="false"
          @close="showAppInfoModal = false"
        >
          <AppInfo
            :app="selectedApp"
            @launchApp="
              router.push({
                name: 'Extensions',
                params: { name: selectedApp.name },
              })
            "
          />
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
    <div v-if="!currentApp && !loading" class="extensions__apps">
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
        @openApp="onOpenApp(app.id)"
      />
    </div>
    <div v-if="loading" class="extensions__loading">
      <Loading />
    </div>
    <div
      v-if="currentApp"
      :class="{ fullScreen: showFullScreen }"
      class="extensions__app-wrap"
    >
      <keep-alive v-if="!showFullScreen">
        <component :is="closeIcon" class="close-icon" @click="closeApp()" />
      </keep-alive>
      <iframe
        :src="currentApp.url"
        frameBorder="0"
        :width="showFullScreen ? '100%' : 550"
        height="710"
        align="left"
        name="target"
        class="extensions__frame"
      />
    </div>
    <!--Confirm Ledger Modals-->
    <!-- <Modal v-if="showLedgerConnect">
      <ConnectLedgerModal
        v-click-away="connectLedgerCloseHandler"
        :error="ledgerError"
        @close="connectLedgerCloseHandler"
        @buttonClick="connectLedgerClickHandler"
      />
    </Modal> -->
    <Modal v-if="showLedgerConnect">
      <ConfirmLedgerModal
        v-if="showLedgerConnect"
        v-click-away="connectLedgerCloseHandler"
        @close="connectLedgerCloseHandler"
      />
    </Modal>
    <Modal
      v-if="
        !showLedgerConnect &&
        extensionTransactionForSign &&
        !extensionTransactionForSign.error_type
      "
    >
      <ModalContent
        :title="selectedApp.name"
        :desc="selectedApp.short_description"
        button-text="confirm"
        type="action"
        :internal-icon="selectedApp.logo"
        :disabled="confirmModalDisabled"
        class="modal-content"
        @close="confirmModalCloseHandlerWithRequest"
        @buttonClick="confirmClickHandler"
      >
        <div class="item mt30">
          <div class="label">{{ $t('extensions.typeOperation') }}</div>
          <span class="red">{{ extensionTransactionForSign?.type }}</span>
        </div>
        <div
          v-for="(meta, ndx) in extensionTransactionForSign.meta_info"
          :key="ndx"
          class="item"
        >
          <template v-if="typeof meta.value === 'string'">
            <div class="label">
              {{ meta.title }}
            </div>
            <span>{{ meta.value }}</span>
          </template>
          <!-- object link + text -->
          <template v-if="typeof meta.value === 'object'">
            <div class="label">
              {{ meta.title }}
            </div>
            <a target="_blank" :href="meta.value.url"
              >{{ meta.value.text }}
              <linkIcon class="link-icon" /><linkIconHovered
                class="link-icon hovered"
            /></a>
          </template>
        </div>
        <div v-if="extensionTransactionForSign.fee" class="item">
          <div class="label">
            {{ $t('extensions.transactionFee') }}
          </div>
          <div>
            <span
              v-pretty-number="{
                value: extensionTransactionForSign.fee,
                currency: (signerWallet || metamaskSigner)?.code,
              }"
            />{{ (signerWallet || metamaskSigner)?.code }}
          </div>
        </div>
        <div class="item">
          <div class="label">
            {{ $t('extensions.transactionData') }}
          </div>
          <div class="show" @click="showTx = !showTx">
            {{ $t('extensions.showLabel') }}
            <keep-alive>
              <component
                :is="arrowDownIcon"
                :class="{ open: showTx }"
                class="arrow-icon"
              />
            </keep-alive>
          </div>
        </div>
        <pre
          v-if="showTx && extensionTransactionForSign?.transaction"
          class="item-tx"
        >
          <highlightjs
            language="javascript"
            :code="JSON.stringify(extensionTransactionForSign.transaction).replaceAll(',', ', \n').replaceAll('{', '{ \n').replaceAll('}', '\n}')"
          />
        </pre>
        <div
          v-if="
            signerWallet &&
            [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
              signerWallet.type
            )
          "
          class="password-wrap"
        >
          <Input
            id="password"
            v-model="password"
            :show-error-text="!!incorrectPassword && confirmPassword"
            :error="
              incorrectPassword && confirmPassword ? 'Incorrect password' : ''
            "
            :label="$t('enterPassword')"
            :placeholder="$t('password')"
            type="password"
            icon="key"
          />
        </div>
      </ModalContent>
    </Modal>
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
        <div class="label description">
          {{ $t('extensions.signMessage') }}
        </div>
        <div class="item mt30">
          <div class="item-tx">
            <highlightjs
              language="javascript"
              :code="
                JSON.stringify(messageForSign.message)
                  .replaceAll(',', ', \n')
                  .replaceAll('{', '{ \n')
                  .replaceAll('}', '\n}')
              "
            />
          </div>
        </div>
        <div v-if="msgSuccessSignature" class="item">
          <div class="label signature">
            {{ msgSuccessSignature }}
          </div>
        </div>
        <div
          v-if="
            !msgSuccessSignature &&
            signerWallet &&
            [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
              signerWallet.type
            )
          "
          class="password-wrap"
        >
          <Input
            id="password-msg"
            v-model="password"
            :show-error-text="!!incorrectPassword && confirmPassword"
            :error="
              incorrectPassword && confirmPassword ? 'Incorrect password' : ''
            "
            :label="$t('enterPassword')"
            :placeholder="$t('password')"
            type="password"
            icon="key"
          />
        </div>
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
import { ref, markRaw, computed, watch } from 'vue';
import Modal from '@/components/Modal';
import linkIcon from '@/assets/icons/link.svg';
import linkIconHovered from '@/assets/icons/link_hovered.svg';
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';
import { useStore } from 'vuex';
import Head from './components/Head';
import AppBlock from './components/AppBlock';
import AppInfo from './components/AppInfo';
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent.vue';
import { WALLET_TYPES } from '../../config/walletType';
import { sha3_256 } from 'js-sha3';
import { useRouter, useRoute } from 'vue-router';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import notify from '@/plugins/notify';
import useWallets from '@/compositions/useWallets';
import extensionsSocketTypes from '@/config/extensionsSocketTypes';

import useApi from '@/api/useApi';
import { keplrNetworksProtobufFormat } from '@/config/availableNets';

export default {
  name: 'Extensions',
  components: {
    ConnectLedgerModal,
    ConfirmLedgerModal,
    Head,
    AppBlock,
    linkIcon,
    linkIconHovered,
    AppInfo,
    SuccessModalContent,
    Loading,
    Modal,
    ModalContent,
    Input,
  },
  setup() {
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
    const closeIcon = ref();
    const arrowDownIcon = ref();
    const successTx = ref('');
    const confirmPassword = ref(false);
    const signerWallet = ref(null);
    const metamaskSigner = ref(null);
    const txComment = ref('');
    const showTx = ref(false);
    const showLedgerConnect = ref(false);
    const ledgerError = ref('');
    const msgSuccessSignature = ref('');
    const selectedTags = ref([]);
    const fullScreenAppIds = ref([
      6, 7, 9, 10, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23,
    ]);

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

    const filterItems = computed(() => {
      return extensionsList.value
        .map((app) => {
          return app.tags.map((tag) => tag.name);
        })
        .filter((tags) => tags.length)
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, [])
        .filter((item, pos, arr) => {
          return arr.indexOf(item) == pos;
        });
    });

    if (!extensionsList.value.length) {
      store.dispatch('extensions/fetchExtensionsList');
    }

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: currentApp.value.networks[0],
          hash: successTx.value[0],
          text: txComment.value,
        }));
      txComment.value = '';

      confirmPassword.value = false;
      showSuccessModal.value = false;
      successTx.value = '';
      password.value = '';
    };

    const closeSuccessModal = () => {
      showSuccessModal.value = false;
      confirmPassword.value = false;
      successTx.value = '';
      password.value = '';

      store.dispatch('extensions/sendCustomMsg', {
        token: currentAppInfo.value.token,
        message: extensionsSocketTypes.messages.success,
        type: extensionsSocketTypes.types.transaction,
      });
    };

    import(`@/assets/icons/extensions/close.svg`).then((val) => {
      closeIcon.value = markRaw(val.default);
    });
    import(`@/assets/icons/extensions/arrow_down.svg`).then((val) => {
      arrowDownIcon.value = markRaw(val.default);
    });

    const onSearchHandler = (str) => {
      searchStr.value = str;
    };

    const onSelectTags = (tags) => {
      selectedTags.value = tags;
    };

    const launchApp = () => {};
    const closeApp = (stopRedirect) => {
      currentApp.value = null;
      selectedApp.value = null;

      if (!stopRedirect) {
        showFullScreen.value = false;
        showArtefactsForNormalScreen();
        router.push({ name: 'Extensions' });
      }
    };

    const appBackground = computed(() =>
      currentApp.value && !fullScreenAppIds.value.includes(selectedApp.value.id)
        ? currentApp.value.background
        : null
    );
    const currentAppInfo = computed(
      () => store.getters['extensions/currentAppInfo']
    );

    // const privateWallets = computed(() => store.getters['wallets/wallets'].filter(w => w.type !== WALLET_TYPES.PUBLIC_KEY));
    const messageForSign = false; // computed(() => store.getters['extensions/extensionMessageForSign']);

    // const walletsList = computed(() => store.getters['wallets/wallets']);

    const extensionTransactionForSign = computed(
      () => store.getters['extensions/extensionTransactionForSign']
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

      if (fullScreenAppIds.value.includes(selectedApp.value.id)) {
        showFullScreen.value = true;
        hideArtefactsForFullScreen();
      }

      await store.dispatch('extensions/fetchExtensionInfo', {
        appId: selectedApp.value.id,
      });

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

      if (currentAppInfo?.value?.token) {
        const nets = selectedApp.value.networks.map((net) => {
          return net.toLowerCase();
        });
        const wallets = walletsList.value

          .filter(
            (w) =>
              nets.includes(w.net.toLowerCase()) &&
              w.type !== WALLET_TYPES.PUBLIC_KEY
          )
          .map((w) => ({
            address: w.address,
            net: w.net,
            publicKey:
              (w.getPublicKeyDecoded && w.getPublicKeyDecoded()) || null,
          }));

        if (mergeWallet) {
          wallets.push({
            address: mergeWallet.address,
            net: mergeWallet.net,
            from: 'metamask',
          });
        }

        selectedApp.value.url += `?token=${
          currentAppInfo.value.token
        }&wallets=${JSON.stringify(wallets)}`;
        currentApp.value = selectedApp.value;
      }
    };

    if (route.params.name) {
      selectedApp.value = Object.assign(
        {},
        extensionsList.value.find(
          (a) => a.name.toLowerCase() === route.params.name.toLowerCase()
        )
      );

      if (!selectedApp.value.id) {
        router.push({ name: 'Extensions' });
      } else {
        selectApp();
      }
    } else {
      closeApp(true);
    }

    const onOpenApp = (app) => {
      selectedApp.value = Object.assign(
        {},
        extensionsList.value.find((a) => +a.id === +app)
      );
      router.push({
        name: 'Extensions',
        params: { name: selectedApp.value.name },
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
      if (!searchStr.value.length) {
        if (!selectedTags.value.length) return extensionsList.value;

        return extensionsList.value.filter((app) => {
          let findTag;
          app.tags.forEach((tag) => {
            if (selectedTags.value.includes(tag.name)) {
              findTag = true;
            }
          });
          return findTag;
        });
      }

      if (!selectedTags.value.length) {
        return extensionsList.value.filter((app) =>
          app.name.toLowerCase().includes(searchStr.value)
        );
      }

      return extensionsList.value.filter((app) => {
        let findTag;
        app.tags.forEach((tag) => {
          if (
            selectedTags.value.includes(tag.name) &&
            app.name.toLowerCase().includes(searchStr.value)
          ) {
            findTag = true;
          }
        });
        return findTag;
      });
    });

    /* watch(() => messageForSign.value, async () => {
      if (messageForSign.value) {
        const currentAddress = messageForSign.value.address;
        const nets = currentApp.value.networks.map(net => { return net.toLowerCase(); });
        signerWallet.value = privateWallets.value.find(w => w.address.toLowerCase() === currentAddress.toLowerCase() && nets.includes(w.net.toLowerCase()));
      }
    }); */

    watch(
      () => metamaskConnector.value.accounts,
      (newV) => {
        if (
          newV &&
          newV[0] &&
          selectedApp.value &&
          [6, 7].includes(selectedApp.value.id)
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

    watch(extensionTransactionForSign, () => {
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
      }
    });

    watch(route, (route) => {
      if (!route.params.name) {
        closeApp(true);
        showFullScreen.value = false;
        showArtefactsForNormalScreen();
      } else {
        selectedApp.value = Object.assign(
          {},
          extensionsList.value.find((a) => a.name === route.params.name)
        );

        if (selectedApp.value.id) {
          selectApp();
        }
      }
    });

    const sendSuccessMSG = () => {
      store.dispatch('extensions/sendCustomMsg', {
        token: currentAppInfo.value.token,
        message: extensionsSocketTypes.messages.success,
        type: extensionsSocketTypes.types.transaction,
      });
    };

    const confirmModalCloseHandlerWithRequest = () => {
      password.value = '';
      store.commit('extensions/SET_TRANSACTION_FOR_SIGN', null, { root: true });

      store.dispatch('extensions/sendCustomMsg', {
        token: currentAppInfo.value.token,
        message: extensionsSocketTypes.messages.canceled,
        type: extensionsSocketTypes.types.transaction,
      });
    };

    const closeSignMessageModal = () => {
      password.value = '';
      confirmPassword.value = false;

      if (!msgSuccessSignature.value) {
        store.dispatch('extensions/sendCustomMsg', {
          token: currentAppInfo.value.token,
          message: extensionsSocketTypes.messages.canceled,
          type: extensionsSocketTypes.types.message,
        });
      }

      msgSuccessSignature.value = '';
      showLedgerConnect.value = false;
      store.commit('extensions/SET_MESSAGE_FOR_SIGN', null, { root: true });
    };

    const signMessage = async () => {
      confirmPassword.value = true;

      if (
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
          signerWallet.value.type
        ) &&
        incorrectPassword.value
      ) {
        return;
      }

      if (signerWallet.value.type === WALLET_TYPES.LEDGER) {
        showLedgerConnect.value = true;
      }

      try {
        const signResult = await signerWallet.value.signMessage(
          messageForSign.value.message,
          password.value,
          signerWallet.value.derivationPath
        );

        showLedgerConnect.value = false;
        msgSuccessSignature.value = signResult;

        store.dispatch('extensions/sendCustomMsg', {
          token: currentAppInfo.value.token,
          message: msgSuccessSignature.value,
          type: extensionsSocketTypes.types.message,
        });
      } catch (err) {
        showLedgerConnect.value = false;
        notify({
          type: 'warning',
          text: JSON.stringify(err),
        });
        store.dispatch('extensions/sendCustomMsg', {
          token: currentAppInfo.value.token,
          message: extensionsSocketTypes.messages.failed,
          type: extensionsSocketTypes.types.message,
        });
      }
    };

    const confirmModalCloseHandler = () => {
      password.value = '';
      store.commit('extensions/SET_TRANSACTION_FOR_SIGN', null, { root: true });
    };

    const confirmClickHandler = async () => {
      if (
        signerWallet.value &&
        signerWallet.value.type === WALLET_TYPES.KEPLR
      ) {
        let keplrResult;
        const signType =
          extensionTransactionForSign.value.transaction.direct &&
          extensionTransactionForSign.value.transaction.json.memo
            .toLowerCase()
            .includes('permission')
            ? 'direct'
            : 'json';

        try {
          keplrResult = await keplrConnector.value.sendKeplrTransaction(
            extensionTransactionForSign.value,
            signerWallet.value.address,
            { preferNoSetFee: true }
          );
        } catch (err) {
          notify({
            type: 'warning',
            text: JSON.stringify(err),
          });

          return;
        }

        if (keplrResult.error) {
          notify({
            type: 'warning',
            text: keplrResult.error,
          });

          return;
        }

        const defaultTx = {
          ...keplrResult.signedTx,
          signType,
          publicKey: signerWallet.value.getPublicKeyDecoded(),
          signature: keplrResult.signature,
        };
        const defaultSendTx = extensionTransactionForSign.value.transaction;
        const protobufTx = {
          signType,
          mode: 'sync',
          tx: {
            memo: defaultSendTx.json.memo || '',
            fee: keplrResult.signedTx.fee,
            msg: defaultSendTx.json.msgs,
            signatures: [
              {
                account_number: keplrResult.fullResponse.signed.account_number,
                pub_key: keplrResult.fullResponse.signature.pub_key,
                sequence: keplrResult.fullResponse.signed.sequence,
                signature: keplrResult.fullResponse.signature.signature,
              },
            ],
          },
        };

        // https://core-fix-cosmos-grant.3ahtim54r.ru/api

        const data = await useApi('wallet').sendSignedTransaction({
          hash: keplrNetworksProtobufFormat.includes(signerWallet.value.net)
            ? protobufTx
            : defaultTx,
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
          sendSuccessMSG();
        } else {
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
            extensionTransactionForSign.value.transaction
          );

        if (metamaskResult.error) {
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
          store.dispatch('extensions/sendCustomMsg', {
            token: currentAppInfo.value.token,
            message: extensionsSocketTypes.messages.failed,
            type: extensionsSocketTypes.types.transaction,
          });
        } else {
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          successTx.value = [metamaskResult.txHash];
          store.dispatch('extensions/putMempoolChangeStatus', {
            hash: metamaskResult.txHash,
            mempool_id: extensionTransactionForSign.value.mem_tx_id,
          });
          confirmModalDisabled.value = false;
          confirmModalCloseHandler();
          showSuccessModal.value = true;
          sendSuccessMSG();
        }

        return;
      }

      confirmPassword.value = true;

      if (
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
          signerWallet.value.type
        ) &&
        incorrectPassword.value
      ) {
        return;
      }

      if (signerWallet.value.type === WALLET_TYPES.LEDGER) {
        showLedgerConnect.value = true;
      }

      let result;

      try {
        result = await signerWallet.value.signAndSendTransfer({
          walletId: signerWallet.value.id,
          rawTransaction: extensionTransactionForSign.value,
          privateKey:
            password.value &&
            signerWallet.value.getPrivateKeyDecoded(password.value),
          derivationPath: signerWallet.value.derivationPath,
          proxy: false,
        });

        if (
          typeof result.data[0] === 'string' &&
          [64, 66].includes(result.data[0].length)
        ) {
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          successTx.value = result.data;
          confirmModalDisabled.value = false;
          confirmModalCloseHandler();
          showSuccessModal.value = true;
          sendSuccessMSG();
        } else {
          confirmModalDisabled.value = false;
          showLedgerConnect.value = false;
          confirmModalDisabled.value = false;
          confirmModalCloseHandler();
          notify({
            type: 'warning',
            text: JSON.stringify(result),
          });
        }
      } catch (e) {
        store.dispatch('extensions/sendCustomMsg', {
          token: currentAppInfo.value.token,
          message: extensionsSocketTypes.messages.failed,
          type: extensionsSocketTypes.types.transaction,
        });
        ledgerError.value = e;
        showLedgerConnect.value = false;
      }
    };
/* eslint-disable */
    return {
      showFullScreen,
      showTx,
      router,
      assetsDomain,
      arrowDownIcon,
      appBackground,
      WALLET_TYPES,
      txComment,
      extensionsList,
      closeIcon,
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

      //ledgers
      showLedgerConnect,
      connectLedgerCloseHandler,
      connectLedgerClickHandler,
      ledgerError,

      // message
      msgSuccessSignature,
      closeSignMessageModal,
      signMessage,
    };
  },
};
</script>
<style lang="scss" scoped>
  .extensions {
    max-width: 1628px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 16px;

    &__app-wrap {
      margin-top: 35px;
      position: relative;
      border-radius: 20px;

      &.fullScreen {
        width: 100%;
        box-sizing: border-box;
        // padding: 0 35px;
      }

      .close-icon {
        position: absolute;
        top: 0px;
        right: -40px;

        &:hover {
          cursor: pointer;
          opacity: .7;
        }
      }
    }

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
    }

    .label.description {
      margin: 25px 0 0 0;
      width: 100%;
      text-align: left;
      font-weight: 700;
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
        background: #6A4BFF;
        color: #fff;
      }
    }

    &__frame {
      border-radius: 20px;
      border: none;
      outline: none;
      z-index: 1;
    }

    .modal-content {
      .password-wrap {
        border-top: 1px solid #BCC2D8;
        width: 100%;
        height: 90px;
        margin-top: 20px;
        padding-top: 20px;
      }

      div.code {
        white-space: pre;
      }

      .item-tx {
        overflow: auto;
        width: 100%;
        margin-top: 0; // -35px;
        max-height: 260px;
      }

      .item {
        margin: 10px 0;
        width: 100%;
        display: flex;

        .signature {
          word-break: break-word;
        }

        span {
          text-align: right;
        }

        align-items: center;
        justify-content: space-between;

        a {
          text-decoration: none;
          text-decoration: underline;
          color: #437FEC;

          .link-icon {
            width: 18px;
            height: 16px;
            margin-left: 5px;

            &.hovered {
              display: none;
            }
          }

          &:hover {
            color: pointer;
            color: #756AA8;

            .link-icon {
              display: none;

              &.hovered {
                display: initial;
              }
            }
          }
        }

        .arrow-icon {
          &.open {
            transform: rotate(180deg);
          }
        }

        .show {
          z-index: 0;
          color: #6B93C0;
          border-bottom: 1px dotted #6B93C0;
          text-transform: lowercase;
          cursor: pointer;
          display: flex;
          align-items: center;

          svg {
            margin-top: 2px;
            margin-left: 4px;
          }
        }

        .red {
          color: $red;
        }

        &.mt30 {
          margin-top: 30px;
        }
      }
    }
  }

</style>

<template>
  <transition v-if="isLoading" name="fade">
    <Modal>
      <img src="@/assets/gif/loader.gif" alt="" />
    </Modal>
  </transition>
  <div v-else class="login">
    <div class="left">
      <header :class="{ confirmedAddress }" class="login__header">
        <div class="login__logo">
          <citadelLogo />
        </div>
        <div class="langs" v-if="confirmedAddress" />
        <LoginCarousel v-if="!syncMode && !confirmedAddress" />
        <SyncCarousel v-if="syncMode && !confirmedAddress" />
      </header>
    </div>
    <div class="right">
      <main class="login__content">
        <div class="login__form">
          <SyncStart v-if="showSyncBlock" @sync="sync" />
          <template v-else>
            <template v-if="!walletMenuType">
              <LoginForm
                v-if="currentStep === 1 && !showSyncBlock"
                :disabled="formDisabled"
                @formSubmit="formSubmit"
                @socialClick="socialClick"
              >
                <div
                  v-if="currentStep === 1 && !showSyncBlock"
                  class="login__question-info"
                  @click="showEmailModal = true"
                >
                  <div>
                    {{ $t('login.questionText1') }}
                    <span class="bold">{{ $t('Citadel.one') }}</span>
                    {{ $t('login.questionText2') }}
                  </div>
                </div>
              </LoginForm>
              <LoginMenu
                v-if="!userName"
                @loginSocial="onLoginSocial"
                @loginWeb3="onLoginWeb3"
              />
            </template>
            <LoginMenuWeb3
              v-if="!loginWith && walletMenuType === WALLET_MENU_TYPE.web3"
              @loginWith="onLoginWith"
              @cancel="walletMenuType = ''"
            />
            <LoginMenuSocial
              v-if="!loginWith && walletMenuType === WALLET_MENU_TYPE.social"
              @loginWith="onLoginWith"
              @cancel="walletMenuType = ''"
            />
            <DisclaimerContinueWithEmail
              v-if="!connectedToWeb3 && loginWith"
              @useEmail="onUseEmail"
              @continue="continueLogin"
            />
            <DisclaimerApproveWeb3
              :is-metamask="loginWith === 'metamask'"
              @cancel="onApproveCancel"
              v-if="
                !keplrConnector?.accounts[0] &&
                !metamaskConnector?.accounts[0] &&
                connectedToWeb3 &&
                ['metamask', 'keplr'].includes(loginWith)
              "
            />

            <ConfirmWeb3Address
              v-if="!confirmedAddress && keplrConnector?.accounts[0]"
              :is-keplr="!!keplrConnector.accounts[0].address"
              :name="keplrNetworks[0].label"
              :network="keplrNetworks[0].net"
              :address="keplrConnector.accounts[0].address"
              @cancel="onWeb3AddressCancel"
              @confirm="onWeb3AddressConfirm"
              @refreshKeplr="onRefreshWeb3Keplr"
            />

            <ConfirmWeb3Address
              v-if="!confirmedAddress && metamaskConnector?.accounts[0]"
              :name="
                metamaskConnector.network === 'bsc'
                  ? 'Binance Smart Chain'
                  : 'Ethereum'
              "
              :network="metamaskConnector.network"
              :address="metamaskConnector.accounts[0]"
              @cancel="onWeb3AddressCancel"
              @confirm="onWeb3AddressConfirm"
            />

            <SelectLanguage
              v-if="confirmedAddress"
              @accountCreate="onAccountCreate"
              @cancel="confirmedAddress = false"
            />

            <Verification
              v-if="currentStep === 2 && !showSyncBlock"
              :error="verificationError"
              @change="onChangeVerification"
              @verification="verification"
              @sendVerificationCode="sendVerificationCode"
              @cancelVerification="
                () => {
                  userName = '';
                }
              "
            />
          </template>
        </div>
        <WhyCitadel v-if="showEmailModal" @close="showEmailModal = false" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal';
import useCurrentStep from '@/compositions/useCurrentStep';
import useWallets from '@/compositions/useWallets';
import Verification from './components/Verification';
import LoginForm from './components/LoginForm';
import LoginCarousel from './components/LoginCarousel';
import SyncCarousel from './components/SyncCarousel';
import SyncStart from './components/SyncStart';
import LoginMenu from './components/LoginMenu';
import LoginMenuWeb3 from './components/LoginMenuWeb3';
import LoginMenuSocial from './components/LoginMenuSocial';
import DisclaimerContinueWithEmail from './components/DisclaimerContinueWithEmail';
import DisclaimerApproveWeb3 from './components/DisclaimerApproveWeb3';
import ConfirmWeb3Address from './components/ConfirmWeb3Address';
import SelectLanguage from './components/SelectLanguage';
import citadelLogo from '@/assets/icons/citadelLogoWhite.svg';
import initPersistedstate from '@/plugins/persistedstate';
// import { SocketManager } from '@/utils/socket';
import { socketEventHandler } from '@/utils/socketEventHandler';
import notify from '@/plugins/notify';
import WhyCitadel from './components/WhyCitadel';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { parseHash, findAddressWithNet } from '@/helpers';
import { WALLET_TYPES } from '@/config/walletType';
import { keplrNetworks } from '@/config/availableNets';
import useCreateWallets from '@/compositions/useCreateWallets';
import { useI18n } from 'vue-i18n';

const WALLET_MENU_TYPE = {
  social: 'sosical',
  web3: 'web3',
};

export default {
  name: 'Login',
  components: {
    citadelLogo,
    LoginForm,
    Verification,
    Modal,
    LoginCarousel,
    SyncCarousel,
    SyncStart,
    WhyCitadel,
    LoginMenu,
    LoginMenuWeb3,
    LoginMenuSocial,
    DisclaimerContinueWithEmail,
    DisclaimerApproveWeb3,
    ConfirmWeb3Address,
    SelectLanguage,
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    const formDisabled = ref(false);
    const showEmailModal = ref(false);
    const citadel = inject('citadel');

    const localHashInfo = localStorage.getItem('hashInfo');
    const syncMode = ref(!!localHashInfo);
    const showSyncBlock = ref(false);

    const hashInfo = ref('');

    const walletMenuType = ref('');
    const loginWith = ref('');
    const connectedToWeb3 = ref(false);
    const confirmedAddress = ref(false);
    const newAddress = ref('');
    const newAddressNet = ref('');

    const { setNets, setAddress, setPublicKey, createWallets } =
      useCreateWallets();

    const { wallets } = useWallets();

    const onAccountCreate = async () => {
      await redirectToWallet({
        wallet: { address: newAddress.value, net: newAddressNet.value },
        root: true,
      });
    };

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
    );

    if (syncMode.value) {
      hashInfo.value = parseHash(localHashInfo);
      window.localStorage.removeItem('hashInfo');
    }

    const { currentStep, nextStep, setCurrentStep } = useCurrentStep(1, null);

    const userName = ref('');
    const verificationError = ref('');
    const isAuthenticated = computed(
      () => store.getters['auth/isAuthenticated']
    );

    if (isAuthenticated.value) {
      router.push({ name: 'AddAddress' });
    }

    const onChangeVerification = () => {
      verificationError.value = '';
    };

    const formSubmit = async (username) => {
      formDisabled.value = true;
      userName.value = username;

      if (userName.value) {
        if (isAuthenticated.value) {
          await store.dispatch('auth/logout');
        }

        const { error, data } = await sendVerificationCode();

        if (error) {
          userName.value = '';
          setCurrentStep(1);
        }

        if (data) {
          nextStep();
        }

        formDisabled.value = false;
      }

      formDisabled.value = false;
    };

    const sendVerificationCode = async () => {
      const { error, data } = await store.dispatch('auth/login', {
        username: userName.value,
      });

      if (error === "You're authorised") {
        await store.dispatch('auth/logout');
        await store.dispatch('auth/login', {
          username: userName.value,
        });
      }

      return { error, data };
    };

    const socialClick = async (social) => {
      await store.dispatch('auth/loginSocial', { social });
    };

    const verification = async (code) => {
      isLoading.value = true;
      const { data, error } = await store.dispatch('auth/confirmCode', {
        code,
        username: userName.value,
      });

      if (data) {
        // from extension
        if (syncMode.value) {
          isLoading.value = false;
          showSyncBlock.value = true;

          return;
        }

        const { error } = await store.dispatch('profile/getInfo');

        if (!error) {
          await store.dispatch('networks/loadConfig');
          initPersistedstate(store);
          // SocketManager.connect();
          citadel.addEventListener('socketEvent', socketEventHandler);
          citadel.addEventListener('walletListUpdated', async () => {
            await store.dispatch('wallets/getNewWallets', 'lazy');
          });
          //citadel.addEventListener('walletListUpdated', async ()=> await store.dispatch('wallets/getNewWallets'));
          await store.dispatch('app/setWallets');
          // await store.dispatch('wallets/getNewWallets','lazy');
          // store.dispatch('wallets/getNewWallets','detail');
          store.dispatch('wallets/getCustomWalletsList');
          store.dispatch('rewards/getRewards');
          /* await */ store.dispatch('transactions/getMempool');

          await redirectToWallet({
            wallet: wallets?.value[0],
            root: true,
          });

          isLoading.value = false;
        } else {
          notify({
            type: 'warning',
            text: error,
          });
          setCurrentStep(1);
          isLoading.value = false;
        }

        isLoading.value = false;
      } else {
        verificationError.value = error[Object.keys(error)[0]];
        isLoading.value = false;
      }
    };

    const sync = async () => {
      isLoading.value = true;

      const { error } = await store.dispatch('profile/getInfo');

      if (!error) {
        await store.dispatch('networks/loadConfig');
        initPersistedstate(store);
        // SocketManager.connect();
        citadel.addEventListener('socketEvent', socketEventHandler);
        citadel.addEventListener('walletListUpdated', async () => {
          await store.dispatch('wallets/getNewWallets', 'lazy');
        });
        await store.dispatch('app/setWallets');
        await store.dispatch('wallets/getNewWallets', 'lazy');
        store.dispatch('wallets/getNewWallets', 'detail');
        store.dispatch('wallets/getCustomWalletsList');
        store.dispatch('rewards/getRewards');
        await store.dispatch('transactions/getMempool');
        const { wallets } = useWallets();

        const hashWallet = findAddressWithNet(wallets.value, {
          address: hashInfo.value.address,
          net: hashInfo.value.net,
        });

        if (hashWallet && hashWallet.type !== WALLET_TYPES.PUBLIC_KEY) {
          router.push({
            name: wallets?.value[0].hasStake ? 'WalletStake' : 'Wallet',
            params: {
              net: hashInfo.value.net,
              address: hashInfo.value.address,
            },
          });
        } else {
          localStorage.setItem('openSync', true);
          router.push({ name: 'Settings' });
        }

        isLoading.value = false;
        showSyncBlock.value = false;
      } else {
        notify({
          type: 'warning',
          text: error,
        });
        setCurrentStep(1);

        showSyncBlock.value = false;
        isLoading.value = false;
      }
    };

    const onLoginSocial = () => {
      walletMenuType.value = WALLET_MENU_TYPE.social;
    };

    const onLoginWeb3 = () => {
      walletMenuType.value = WALLET_MENU_TYPE.web3;
    };

    const onLoginWith = (type) => {
      loginWith.value = type;
    };

    const onUseEmail = () => {
      walletMenuType.value = '';
      loginWith.value = '';
    };

    const continueLogin = async () => {
      if (['apple', 'google', 'linkedin'].includes(loginWith.value)) {
        await store.dispatch('auth/loginSocial', { social: loginWith.value });
      } else {
        connectedToWeb3.value = true;

        if (loginWith.value === 'keplr') {
          await store.dispatch('keplr/connectToKeplr', keplrNetworks[0].key);
        }

        if (loginWith.value === 'metamask') {
          await store.dispatch('metamask/connectToMetamask');
        }
      }
    };

    const onApproveCancel = () => {
      walletMenuType.value = '';
      loginWith.value = '';
      connectedToWeb3.value = false;
    };

    const onWeb3AddressCancel = () => {
      connectedToWeb3.value = false;
      keplrConnector.value.disconnect();
      metamaskConnector.value.disconnect();

      onUseEmail();
    };

    const onWeb3AddressConfirm = async () => {
      let address = '';
      let net = '';
      if (loginWith.value === 'metamask') {
        address = metamaskConnector.value.accounts[0];
        net = metamaskConnector.value.network;

        if (!net || !['bsc', 'eth'].includes(net)) {
          notify({
            type: 'warning',
            text: t('metamask.changeNetwork'),
          });
          return;
        }
      }

      if (loginWith.value === 'keplr') {
        address = keplrConnector.value.accounts[0].address;
        net = keplrNetworks[0].net;
      }

      newAddress.value = address;
      newAddressNet.value = net;

      const { data, error, res } = await store.dispatch('auth/authWeb3', {
        address,
        net,
      });

      const initialize = async (walletType) => {
        const { error } = await store.dispatch('profile/getInfo');

        if (!error) {
          await store.dispatch('networks/loadConfig');
          initPersistedstate(store);

          citadel.addEventListener('socketEvent', socketEventHandler);
          citadel.addEventListener('walletListUpdated', async () => {
            await store.dispatch('wallets/getNewWallets', 'lazy');
          });
          await store.dispatch('app/setWallets');
          store.dispatch('wallets/getCustomWalletsList');
          store.dispatch('rewards/getRewards');
          store.dispatch('transactions/getMempool');
        }

        const searchLoginAddress = store.getters['wallets/wallets'].find(
          (w) => {
            return (
              w.address.toLowerCase() === address.toLowerCase() && w.net === net
            );
          }
        );

        if (!searchLoginAddress) {
          setAddress(address);
          setNets([net]);

          if (walletType === WALLET_TYPES.KEPLR) {
            setPublicKey(
              Buffer.from(keplrConnector.value.accounts[0].pubkey).toString(
                'hex'
              )
            );
          }
          createWallets(walletType, false);
          confirmedAddress.value = true;
        } else {
          await redirectToWallet({
            wallet: { address, net },
            root: true,
          });
        }
      };

      if (loginWith.value === 'metamask') {
        const metamaskResult = await metamaskConnector.value.signMessage(
          res.message,
          address
        );

        const { data, error } = await store.dispatch('auth/confirmWeb3', {
          address,
          net,
          sign: metamaskResult,
          pubKey: '',
        });

        if (data) {
          initialize(WALLET_TYPES.PUBLIC_KEY);
        } else {
          notify({
            type: 'warning',
            text: error,
          });
        }
      }

      if (loginWith.value === 'keplr') {
        if (data) {
          const keplrResult = await keplrConnector.value.sendKeplrTransaction(
            res.message,
            address,
            {
              preferNoSetFee: true,
              preferNoSetMemo: true,
            }
          );

          if (keplrResult.signature) {
            const { data, error } = await store.dispatch('auth/confirmWeb3', {
              address,
              net,
              sign: keplrResult.signature,
              pubKey: Buffer.from(
                keplrConnector.value.accounts[0].pubkey
              ).toString('hex'),
            });

            if (data) {
              initialize(WALLET_TYPES.KEPLR);
            } else {
              notify({
                type: 'warning',
                text: error,
              });
            }
          }
        } else {
          notify({
            type: 'warning',
            text: error,
          });
          return;
        }
      }
      // confirmedAddress.value = true;
    };

    const onRefreshWeb3Keplr = async () => {
      await store.dispatch('keplr/connectToKeplr', keplrNetworks[0].key);
    };

    return {
      WALLET_MENU_TYPE,
      onLoginSocial,
      onLoginWeb3,
      walletMenuType,
      onLoginWith,
      loginWith,
      continueLogin,
      onUseEmail,
      connectedToWeb3,
      onApproveCancel,
      metamaskConnector,
      keplrConnector,
      keplrNetworks,
      onWeb3AddressCancel,
      onWeb3AddressConfirm,
      onRefreshWeb3Keplr,
      confirmedAddress,
      userName,
      onAccountCreate,

      syncMode,
      showSyncBlock,
      sync,
      currentStep,
      formSubmit,
      verification,
      socialClick,
      sendVerificationCode,
      onChangeVerification,
      isLoading,
      formDisabled,
      verificationError,
      showEmailModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  min-height: 100vh;
  // padding: 100px;
  display: flex;
  align-items: center;

  &__header {
    &.confirmedAddress {
      width: 100%;
    }
  }

  .left {
    width: 100%;
    box-sizing: border-box;
    background-image: url('~@/assets/icons/login_bg.png');
    // background-color: #5030A0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .langs {
      height: calc(100vh - 50px);
      background-image: url('~@/assets/icons/newLogin/langs.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 0 20px;
    }
  }

  .right {
    width: 50%;
    box-sizing: border-box;
    background-color: #fff;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @include lg {
    // padding: 50px;
  }

  @include md {
    // padding: 40px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    background-image: $ligth-blue-gradient;
    opacity: 0.2;
  }

  &__content {
    display: flex;
    justify-content: center;
  }

  &__form {
    width: 600px;
    margin: 0 auto;

    @include lg {
      width: 500px;
    }

    @include md {
      width: 400px;
    }
  }

  &__logo {
    display: flex;
    position: absolute;
    top: 50px;
    left: 50px;
    transform: scale(0.9);

    @include lg {
      top: 20px;
      left: 20px;
    }

    // & span {
    //   font-size: 45px;
    //   line-height: 54px;
    //   font-family: "Panton_SemiBold";
    //   @include md {
    //     font-size: 35px;
    //     line-height: 42px;
    //   }
    // }

    & svg {
      width: 259px;
      height: 36px;
      @include md {
        width: 200px;
        height: 26px;
      }
    }
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 70px;
    line-height: 85px;
    color: $dark-blue;
    margin-bottom: 41px;
    @include lg {
      font-size: 50px;
      line-height: 65px;
      margin-bottom: 49px;
    }
    @include md {
      font-size: 40px;
      line-height: 50px;
      margin-bottom: 36px;
    }
  }

  &__info {
    font-size: 25px;
    line-height: 42px;
    @include md {
      font-size: 18px;
      line-height: 30px;
    }
  }

  &__question-info {
    margin-top: 5px;
    margin-bottom: 15px;
    cursor: pointer;
    display: inline-block;
    align-items: center;
    color: #1a53f0;
    border-bottom: 1px dashed #1a53f0;

    .bold {
      font-weight: bold;
    }
  }
}
</style>

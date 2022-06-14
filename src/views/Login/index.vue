<template>
  <transition
    v-if="isLoading"
    name="fade"
  >
    <Modal>
      <img
        src="@/assets/gif/loader.gif"
        alt=""
      >
    </Modal>
  </transition>
  <div
    v-else
    class="login"
  >
    <header class="login__header">
      <div class="login__logo">
        <citadelLogo />
      </div>
    </header>

    <main class="login__content">
      <LoginCarousel v-if="!syncMode" />
      <SyncCarousel v-else />

      <div class="login__form">
        <SyncStart
          v-if="showSyncBlock"
          @sync="sync"
        />
        <template v-else>
          <LoginForm
            v-if="currentStep === 1 && !showSyncBlock"
            :disabled="formDisabled"
            @formSubmit="formSubmit"
            @socialClick="socialClick"
          />
          <Verification
            v-if="currentStep === 2 && !showSyncBlock"
            :error="verificationError"
            @change="onChangeVerification"
            @verification="verification"
            @sendVerificationCode="sendVerificationCode"
          />
        </template>
        <div
          v-if="currentStep === 1 && !showSyncBlock"
          class="login__question"
          @click="showEmailModal = true"
        >
          <div class="login__question-info">
            <conversation />
            <span>{{ $t("login.questionText1") }} <b>{{ $t("Citadel.one") }}</b>
              {{ $t("login.questionText2") }}</span>
          </div>
          <RoundArrowButton />
        </div>
      </div>
      <WhyCitadel
        v-if="showEmailModal"
        @close="showEmailModal = false"
      />
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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
import citadelLogo from '@/assets/icons/citadelLogo.svg';
import initPersistedstate from '@/plugins/persistedstate';
import { SocketManager } from '@/utils/socket';
import notify from '@/plugins/notify';
import WhyCitadel from './components/WhyCitadel';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { parseHash, findAddressWithNet } from '@/helpers';
import { WALLET_TYPES } from '@/config/walletType';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import conversation from '@/assets/icons/conversation.svg';

export default {
  name: 'Login',
  components: {
    citadelLogo,
    RoundArrowButton,
    conversation,
    LoginForm,
    Verification,
    Modal,
    LoginCarousel,
    SyncCarousel,
    SyncStart,
    WhyCitadel,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    const formDisabled = ref(false);
    const showEmailModal = ref(false);
    const localHashInfo = localStorage.getItem('hashInfo');
    const syncMode = ref(!!localHashInfo);
    const showSyncBlock = ref(false);

    const hashInfo = ref('');

    if (syncMode.value) {
      hashInfo.value = parseHash(localHashInfo);
      window.localStorage.removeItem('hashInfo');
    }

    const { currentStep, nextStep, setCurrentStep } = useCurrentStep(1, null);

    const userName = ref('');
    const verificationError = ref('');
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

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

      if (error === 'You\'re authorised') {
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
          SocketManager.connect();
          await store.dispatch('app/setWallets');
          await store.dispatch('wallets/getNewWallets', 'lazy');
          store.dispatch('wallets/getNewWallets', 'detail');
          store.dispatch('wallets/getCustomWalletsList');
          store.dispatch('rewards/getRewards');
          await store.dispatch('transactions/getMempool');
          const { wallets } = useWallets();

          redirectToWallet({
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
        SocketManager.connect();
        await store.dispatch('app/setWallets');
        await store.dispatch('wallets/getNewWallets', 'lazy');
        store.dispatch('wallets/getNewWallets', 'detail');
        store.dispatch('wallets/getCustomWalletsList');
        store.dispatch('rewards/getRewards');
        await store.dispatch('transactions/getMempool');
        const { wallets } = useWallets();

        const hashWallet = findAddressWithNet(wallets.value, { address: hashInfo.value.address, net: hashInfo.value.net });

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

    return {
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
  padding: 100px;
  background-image: url('~@/assets/icons/login_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;

  @include lg {
    padding: 50px;
  }

  @include md {
    padding: 40px;
  }

  &::after {
    content: "";
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

    @include lg {
      width: 500px;
    }

    @include md {
      width: 400px;
    }
  }

  &__logo {
    display: flex;
    margin-bottom: 62px;

    @include lg {
      margin-bottom: 40px;
    }
    @include md {
      margin-bottom: 30px;
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
    font-family: "Panton_Bold";
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

  &__question {
    display: flex;
    height: 80px;
    border-radius: 16px;
    align-items: center;
    justify-content: space-between;
    background: $paleturquoise;
    padding: 0 24px 0 32px;
    cursor: pointer;

    &:hover {
      background: $white;
      box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
      0 10px 15px rgba(80, 100, 124, 0.16);
    }

    @include md {
      padding: 0 16px 0 32px;
    }
  }

  &__question-info {
    display: flex;
    align-items: center;

    & svg {
      margin-right: 15px;
    }
  }
}
</style>

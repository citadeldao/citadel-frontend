<template>
  <transition v-if="showLoader" name="fade">
    <Modal>
      <img src="@/assets/gif/loader.gif" alt="" />
    </Modal>
  </transition>
  <component :is="layout" v-else>
    <slot />
  </component>
</template>

<script>
import { ref, computed, watch, markRaw, onUnmounted, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Modal from '@/components/Modal';
import useWallets from '@/compositions/useWallets';
import { findAddressWithNet } from '@/helpers';
// import citadel from '@citadeldao/lib-citadel'
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { parseHash } from '@/helpers';
import { WALLET_TYPES } from '../config/walletType';

export default {
  name: 'AppLayout',
  components: { Modal },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const intervalId = ref();
    const showLoader = computed(
      () =>
        store.getters['app/showLoader'] || store.getters['app/showRouteLoader']
    );
    const { walletByAddress, wallets } = useWallets();

    if (process.env.VUE_APP_OFF) {
      router.push({ name: 'AppOff' });
    }

    const hashInfo = ref('');
    const startTimeout = ref(false);

    const setCurrentWallet = async ({ net, address } = {}) => {
      if (net && address) {
        await store.dispatch(
          'wallets/setCurrentWallet',
          walletByAddress({ net, address })
        );
      } else {
        await store.dispatch('wallets/setCurrentWallet', null);
      }
    };
    const setCurrentToken = async (address, net, token) => {
      if (token) {
        const currentToken = store.getters['subtokens/formatedSubtokens'](
          true
        ).find(({ net }) => net === token);

        if (currentToken) {
          await store.dispatch('subtokens/setCurrentToken', currentToken);
        } else {
          await store.dispatch('subtokens/setCurrentToken', null);
          redirectToWallet({
            wallet: { net, address },
            root: true,
          });
        }
      }
    };

    const layout = ref();
    const getLayout = async (lyt) => {
      const component = await import(`@/layouts/${lyt}`);

      return component.default;
    };

    watch(
      () => route.params,
      async (params, oldParams) => {
        if (
          params.net !== oldParams.net ||
          params.address?.toLowerCase() !== oldParams.address?.toLowerCase()
        ) {
          await setCurrentWallet(params);
        }

        if (!params.token) {
          await store.dispatch('subtokens/setCurrentToken', null);
        }

        setTimeout(async () => {
          const localHashInfo = localStorage.getItem('hashInfo');
          if (localHashInfo) {
            hashInfo.value = parseHash(localHashInfo);
          }

          if (hashInfo.value && !startTimeout.value) {
            startTimeout.value = true;

            window.localStorage.removeItem('hashInfo');
            const hashWallet = findAddressWithNet(wallets.value, {
              address: hashInfo.value.address,
              net: hashInfo.value.net,
            });

            if (hashWallet && hashWallet.type !== WALLET_TYPES.PUBLIC_KEY) {
              await router.push({
                name: 'WalletStake',
                params: {
                  net: hashInfo.value.net,
                  address: hashInfo.value.address,
                },
              });
              hashInfo.value = '';
            } else {
              localStorage.setItem('openSync', true);
              router.push({ name: 'Settings' });
            }
          }
        }, 1500);
      }
    );

    // matching layouts
    watch(
      () => route.meta,
      async (meta) => {
        try {
          layout.value = markRaw(await getLayout(meta.layout));
        } catch (e) {
          layout.value = markRaw(await getLayout('DefaultLayout'));
        }
      }
    );
    onMounted(() => {
      // load main data
      store
        .dispatch('app/initDefaultState')
        .then(async () => {
          //intervalId.value = setInterval(()=> { store.dispatch('wallets/getNewWallets','lazy'); }, 10000);
          const { address, net, token } = route.params;

          await setCurrentWallet({ address, net });
          await setCurrentToken(address, net, token);

          if (address && net) {
            const currentWallet = store.getters['wallets/currentWallet'];
            if (!currentWallet) return router.push({ name: 'AddAddress' });

            const hasTokens = store.getters['subtokens/formatedSubtokens'](
              false,
              currentWallet && currentWallet.some((t) => t.net === token)
            );

            const checkAddress = !findAddressWithNet(wallets.value, {
              address,
              net,
            });

            if (checkAddress || (token && !hasTokens)) {
              return router.push({ name: 'AddAddress' });
            }

            return redirectToWallet({
              wallet: store.getters['wallets/currentWallet'],
              token: store.getters['subtokens/currentToken'],
            });
          }
        })
        .catch(async (e) => {
          console.error(e);
          // router.push({ name: 'Login' });
        })
        .finally(() => {
          store.dispatch('app/setLoader', false);
        });
    });
    onUnmounted(() => clearInterval(intervalId.value));

    return { layout, showLoader };
  },
};
</script>

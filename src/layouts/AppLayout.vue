<template>
  <transition
    v-if="showLoader"
    name="fade"
  >
    <Modal>
      <img
        src="@/assets/gif/loader.gif"
        alt=""
      >
    </Modal>
  </transition>
  <component
    :is="layout"
    v-else
  >
    <slot />
  </component>
</template>

<script>
import { ref, computed, watch, markRaw, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Modal from '@/components/Modal';
import useWallets from '@/compositions/useWallets';
import { findAddressWithNet } from '@/helpers';
// import citadel from '@citadeldao/lib-citadel'
import redirectToWallet from '@/router/helpers/redirectToWallet';

export default {
  name: 'AppLayout',
  components: { Modal },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const intervalId = ref();
    const showLoader = computed(() => store.getters['app/showLoader'] || store.getters['app/showRouteLoader']);
    const { walletByAddress, wallets } = useWallets();

    const setCurrentWallet = async ({ net, address } = {}) => {
      if (net && address) {
        await store.dispatch('wallets/setCurrentWallet', walletByAddress({ net, address }));
      } else {
        await store.dispatch('wallets/setCurrentWallet', null);
      }
    };
    const setCurrentToken = async (address, net, token) => {
      if (token) {
        const currentToken = store.getters['subtokens/formatedSubtokens'](true)
          .find(({ net }) => net === token);

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

    // load main data
    store.dispatch('app/initDefaultState')
      .then(async () => {
        intervalId.value = setInterval(()=> {
          store.dispatch('wallets/getNewWallets', 'lazy');
        }, 10000);
        const { address, net, token } = route.params;

        await setCurrentWallet({ address, net });
        await setCurrentToken(address, net, token);

        if (address && net) {
          const hasTokenInWallet = store.getters['subtokens/formatedSubtokens'](
            false,
            store.getters['wallets/currentWallet'],
          ).some(t => t.net === token);

          if (!findAddressWithNet(wallets.value, { address, net }) || (token && !hasTokenInWallet)) {
            router.push({ name: 'AddAddress' });

            return;
          }

          redirectToWallet({
            wallet: store.getters['wallets/currentWallet'],
            token: store.getters['subtokens/currentToken'],
          });
        }
      })
      .catch(() => {
        router.push({ name: 'Login' });
      })
      .finally(() => {
        store.dispatch('app/setLoader', false);
      });

    const layout = ref();
    const getLayout = async (lyt) => {
      const component = await import(`@/layouts/${lyt}`);

      return component.default;
    };

    watch(
      () => route.params,
      async (params, oldParams) => {
        if (
          (params.net !== oldParams.net ||
            params.address?.toLowerCase() !== oldParams.address?.toLowerCase())
        ) {
          setCurrentWallet(params);
        }

        if (!params.token) {
          await store.dispatch('subtokens/setCurrentToken', null);
        }
      },
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
      },
    );

    onUnmounted(() => clearInterval(intervalId.value));

    return { layout, showLoader };
  },
};
</script>

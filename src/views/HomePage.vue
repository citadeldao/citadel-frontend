<script>
import useWallets from '@/compositions/useWallets';
import redirectToWallet from '@/router/helpers/redirectToWallet';
export default {
  name: 'HomePage',
  components: {},
  setup() {
    const { wallets } = useWallets();

    redirectToWallet({
      wallet: wallets?.value[0],
      root: true,
    });

    return {};
  },
};
</script>

import models from '@/models';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import FileSaver from 'file-saver';
import { oldTokens } from '@/config/oldTokens';
import { WALLET_TYPES } from '@/config/walletType';
import useWallets from '@/compositions/useWallets';

export default function useOldBackup() {
  const store = useStore();
  const existOldBackup = ref('');
  const oldWallets = ref([]);
  const citadel2FormatWallets = ref([]);
  const oldPasswordHash = ref('');

  const { wallets } = useWallets();
  const networksConfig = computed(() => store.getters['networks/config']);
  const oldBackupKey = computed(
    () => `__wallets__${store.getters['profile/info']?.id}`
  );

  existOldBackup.value = JSON.parse(localStorage.getItem(oldBackupKey.value));

  const downLoadOldBackup = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const prefix = 'citadel-backup-';
    const filename = `${prefix}${year}-${month}-${day}-${h}-${m}-${s}`;
    const blob = new Blob([JSON.stringify(existOldBackup.value)], {
      type: 'text/plain;charset=utf-8',
    });

    FileSaver.saveAs(blob, `${filename}.citadel`);
  };

  if (existOldBackup.value) {
    existOldBackup.value.forEach((wallet) => {
      // oneseed and get passwordHash
      if (wallet.type === 1 && !oldPasswordHash.value) {
        oldPasswordHash.value = wallet.passwordHash;
      }

      wallet.coins = wallet.coins
        .filter((coin) => !oldTokens.includes(coin.coin))
        .map((coin) => {
          let type = '';

          /*
          TODO - сделать объект { type: String, typeNumber: Number }
          use - type = types.find(t => t === wallet.type).number
         */
          if (wallet.type === 1) {
            type = 'oneSeed';
          }

          if (wallet.type === 2) {
            type = 'ledger';
          }

          if (wallet.type === 3) {
            type = 'Trezor';
          }

          if (wallet.type === 4) {
            type = 'Trezor';
          }

          if (!coin || !coin.coin) {
            return false;
          }

          const WalletConstructor = models[coin.coin.toUpperCase()];
          const walletOpts = {
            address: coin.address,
            privateKeyEncoded: coin.keys?.privateKeyEncoded,
            mnemonicEncoded: coin.keys?.mnemonicEncoded,
            publicKey: coin.keys?.publicKey,
            privateKeyHash: coin.keys?.privateKeyHash,
            type: type === 'oneSeed' ? 'privateKey' : type,
            config: store.getters['networks/configByNet'](coin.coin),
          };

          return new WalletConstructor(walletOpts);
        });

      oldWallets.value = oldWallets.value.concat(
        wallet.coins.filter((coin) => coin)
      );
      oldWallets.value = oldWallets.value.filter((item) => item.publicKey);
    });
  }

  // set empty structure for groupped
  Object.keys(networksConfig.value).forEach((net) => {
    citadel2FormatWallets.value.push({
      icon: net,
      net: networksConfig.value[net].name,
      wallets: [],
    });
  });

  // remove duplicate in old backup
  oldWallets.value = oldWallets.value
    .filter((w) => w.address)
    .filter(
      (w, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.net === w.net &&
            t.address.toLowerCase() === w.address.toLowerCase()
        )
    );

  // set to new structure old wallets
  oldWallets.value.forEach((wallet) => {
    citadel2FormatWallets.value.forEach((structItem) => {
      // check duplicate wallet in Wallets
      const searchWallet = wallets.value
        .filter((item) => item.type !== WALLET_TYPES.PUBLIC_KEY)
        .find(
          (w) =>
            w.address.toLowerCase() === wallet.address.toLowerCase() &&
            w.net === wallet.net
        );

      if (searchWallet) {
        wallet.existWallet = true;
      }

      if (structItem.icon === wallet.net) {
        structItem.wallets.push(wallet);
      }
    });
  });

  citadel2FormatWallets.value = citadel2FormatWallets.value
    .filter((struct) => struct.wallets.length)
    .sort((a, b) => {
      if (a.net > b.net) {
        return 1;
      }

      if (a.net < b.net) {
        return -1;
      }

      return 0;
    });

  return {
    existOldBackup,
    oldPasswordHash,
    oldWallets,
    citadel2FormatWallets,
    oldBackupKey,
    downLoadOldBackup,
  };
}

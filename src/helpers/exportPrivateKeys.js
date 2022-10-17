import FileSaver from 'file-saver';
import { getStorage } from '@/utils/storage';
import { WALLET_TYPES } from '@/config/walletType';

export const downLoadWallets = (backup) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const prefix = 'citadel-backup-';
  const filename = `${prefix}${year}-${month}-${day}-${h}-${m}-${s}`;
  const blob = new Blob([backup], {
    type: 'text/plain;charset=utf-8',
  });
  FileSaver.saveAs(blob, `${filename}.citadel`);
};

export default (keyStorage) => {
  const storage = getStorage(keyStorage) && JSON.parse(getStorage(keyStorage));
  const backup = storage && {
    mnemonic: storage.crypto.mnemonic,
    passwordHash: storage.crypto.passwordHash,
    wallets: storage.wallets.wallets.filter(
      (item) => item.net && item.type !== WALLET_TYPES.PUBLIC_KEY
    ),
  };

  if (backup?.wallets.length) {
    downLoadWallets(JSON.stringify(backup));
  }
};

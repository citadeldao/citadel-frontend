<template>
  <div class="sync-extension">
    <teleport to="body">
      <!-- MENU MODAL -->
      <Modal v-if="showMenuModal">
        <ModalContent
          :submit-button="false"
          :title="$t('syncExtensions.modalMenuTitle')"
          :desc="$t('syncExtensions.modalMenuDescription')"
          type="action"
          @close="$emit('close')"
        >
          <div class="menu-container">
            <PrimaryButton class="btn" @click="syncTo">
              {{ $t('syncExtensions.syncTo') }}
            </PrimaryButton>
            <PrimaryButton
              hover-bg-color="#f76132"
              bg-color="#FF5722"
              class="btn"
              @click="
                showMenuModal = false;
                showSyncFromModal = true;
              "
            >
              {{ $t('syncExtensions.syncFrom') }}
            </PrimaryButton>
          </div>
        </ModalContent>
      </Modal>
      <!-- SYNC TO MODAL -->
      <Modal v-if="showSyncToModal">
        <ModalContent
          :submit-button="false"
          :title="$t('syncExtensions.modalMenuTitle')"
          :desc="$t('syncExtensions.syncDescription')"
          type="action"
          @close="$emit('close')"
        >
          <div class="syncto-container">
            <Loading v-if="syncLoading" />
            <template v-else>
              <div class="syncto-input">
                <Input
                  id="walletSearchSync"
                  v-model="searchWalletStr"
                  :label="$t('searchToken')"
                  :hard-autocomplete-off="true"
                  type="text"
                  icon="loop"
                  :placeholder="$t('inputToken')"
                  background="#edf2fc"
                  clearable
                />
              </div>
              <div class="syncto-addresses">
                <AddressItem
                  v-for="(item, index) in walletsToSync"
                  :key="`${item.address}${item.net}${index}`"
                  :address="item"
                  :last-child="index === walletsToSync.length - 1"
                  :checked="isCheck(item)"
                  @check="addItem"
                  @uncheck="removeItem"
                />
              </div>
              <div class="password-wrap">
                <Input
                  id="password"
                  v-model="password"
                  :hard-autocomplete-off="true"
                  :show-error-text="!!incorrectPassword && confirmPassword"
                  :error="
                    incorrectPassword && confirmPassword
                      ? 'Incorrect password'
                      : ''
                  "
                  :label="$t('enterPassword')"
                  :placeholder="$t('password')"
                  type="password"
                  icon="key"
                  @keyup.enter="syncWallets"
                />
              </div>
              <div class="password-wrap mt-10">
                <Input
                  id="passwordConfirm"
                  v-model="passwordExtension"
                  :hard-autocomplete-off="true"
                  :show-error-text="
                    !!incorrectPasswordExtension && confirmPassword
                  "
                  :error="
                    incorrectPasswordExtension && confirmPassword
                      ? $t('syncExtensions.incorrectPasswordExtension')
                      : ''
                  "
                  :label="$t('syncExtensions.enterPassword')"
                  :placeholder="$t('password')"
                  type="password"
                  icon="key"
                  @keyup.enter="syncWallets"
                />
              </div>
              <PrimaryButton
                :disabled="!checkedItems.length"
                class="btn"
                @click="syncWallets"
              >
                {{ $t('next') }}
              </PrimaryButton>
            </template>
          </div>
        </ModalContent>
      </Modal>
      <!-- SYNC FROM -->
      <Modal v-if="showSyncFromModal">
        <ModalContent
          :submit-button="false"
          :title="$t('syncExtensions.syncingFromTitle')"
          :desc="$t('syncExtensions.syncingFromDescription')"
          type="action"
          @close="$emit('close')"
        >
          <div class="syncto-container">
            <Loading v-if="syncLoading" />
            <template v-else>
              <div class="password-wrap">
                <Input
                  id="password"
                  v-model="password"
                  :show-error-text="!!incorrectPassword && confirmPassword"
                  :error="
                    incorrectPassword && confirmPassword
                      ? 'Incorrect password'
                      : ''
                  "
                  :hard-autocomplete-off="true"
                  :label="$t('enterPassword')"
                  :placeholder="$t('password')"
                  type="password"
                  icon="key"
                  @keyup.enter="syncFrom"
                />
              </div>
              <PrimaryButton class="btn" @click="syncFrom">
                {{ $t('next') }}
              </PrimaryButton>
            </template>
          </div>
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>
<script>
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import AddressItem from '@/layouts/AddAddressLayout/components/CutomLists/components/AddressItem';
import useWallets from '@/compositions/useWallets';
import { findAddressWithNet } from '@/helpers';
import { WALLET_TYPES } from '../../config/walletType';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { i18n } from '@/plugins/i18n';
import { sha3_256 } from 'js-sha3';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';
import { INPUT_TYPE_ICON } from '@/config/newWallets';

export default {
  components: {
    Loading,
    Input,
    Modal,
    ModalContent,
    PrimaryButton,
    AddressItem,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const { t } = i18n.global;

    const showMenuModal = ref(true);
    const showSyncToModal = ref(false);
    const showSyncFromModal = ref(false);
    const showSuccessFromSyncModal = ref(false);
    const importedFromWallets = ref([]);

    const syncLoading = ref(false);
    const searchWalletStr = ref('');
    const password = ref('');
    const passwordExtension = ref('');
    const incorrectPasswordExtension = ref(false);

    const confirmPassword = ref(false);
    const checkedItems = ref([]);

    const { wallets } = useWallets();
    const walletsWithoutDublicates = ref([]);

    const userId = computed(() => store.getters['profile/info']?.id);

    const CryptoJS = require('crypto-js');

    onMounted(async () => {
      store.commit('newWallets/setCatPageProps', {
        inputTypeIcon: INPUT_TYPE_ICON.PRIVATE,
        walletTypePlaceholder: t('catPage.placeholderPrivate'),
      });
      if (!window.citadel) {
        notify({
          type: 'warning',
          text: t('syncExtensions.notFound'),
        });
        emit('close');

        return;
      }

      walletsWithoutDublicates.value = await Promise.all(
        wallets.value.map(async (w) => {
          const exist = await window.citadel.isWalletExists(w.address, w.net);
          if (
            !exist &&
            (w.privateKeyEncoded || [WALLET_TYPES.LEDGER].includes(w.type))
          ) {
            return w;
          }

          return null;
        })
      );
      walletsWithoutDublicates.value = walletsWithoutDublicates.value.filter(
        (w) => w
      );
    });

    const walletsToSync = computed(() => {
      if (!searchWalletStr.value) {
        return walletsWithoutDublicates.value;
      }

      const str = searchWalletStr.value.toLowerCase();

      return walletsWithoutDublicates.value.filter(
        (w) =>
          w.address.toLowerCase().includes(str) ||
          w.title.toLowerCase().includes(str)
      );
    });

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    const isCheck = (wallet) =>
      !!findAddressWithNet(checkedItems.value, wallet);

    const addItem = (item) => {
      checkedItems.value.push(item);
    };

    const removeItem = (wallet) => {
      checkedItems.value = checkedItems.value.filter(
        ({ address, net }) =>
          !(
            address.toLowerCase() === wallet.address.toLowerCase() &&
            net === wallet.net
          )
      );
    };

    const syncTo = () => {
      if (window.citadel) {
        showSyncToModal.value = true;
        showMenuModal.value = false;

        if (!walletsWithoutDublicates.value.length) {
          notify({
            type: 'warning',
            text: t('syncExtensions.walletsNotFound'),
          });
          emit('close');

          return;
        }
      }
    };

    const onSuccessFromSyncClose = () => {
      store.commit('newWallets/setModal', false);
      showSyncFromModal.value = false;
      emit('close');
    };

    const syncFrom = async () => {
      confirmPassword.value = true;

      const isReadyToSync = await window.citadel.isReadyToSync();

      if (!isReadyToSync) {
        notify({
          type: 'warning',
          text: t('syncExtensions.emptyWallets'),
        });

        return;
      }

      if (window.citadel && !incorrectPassword.value) {
        let syncResult = null;

        syncLoading.value = true;
        const networks = store.getters['networks/networksList'].map(
          (network) => network.net
        );

        try {
          await window.citadel.setUserId(userId.value);

          const phForChrome = CryptoJS.SHA256(password.value).toString();

          syncResult = await window.citadel.syncFromExtension(
            networks,
            phForChrome
          );
        } catch (err) {
          syncLoading.value = false;
        }
        console.log('syncResult WWW', syncResult);
        const newWallets = syncResult;
        const result =
          syncResult &&
          (await Promise.all(
            syncResult.map(async (wallet) => {
              const privateKey = await citadel.decodePrivateKeyByPassword(
                wallet.net,
                wallet.privateKeyEncoded,
                password.value
              );

              if (privateKey.error) {
                notify({
                  type: 'warning',
                  text: JSON.stringify(privateKey.error),
                });
                return;
              }

              const res = await citadel.addWalletByPrivateKey({
                net: wallet.net,
                privateKey: privateKey.data,
              });

              if (res.data) {
                const newInstance = await store.dispatch(
                  'crypto/createNewWalletInstance',
                  { walletOpts: wallet }
                );
                await store.dispatch('wallets/pushWallets', {
                  wallets: [newInstance],
                });
              }

              return res.result === 'success';
            })
          ));

        if (syncResult && result.every((res) => !!res)) {
          syncLoading.value = false;
          showSyncFromModal.value = false;

          store.commit('newWallets/setNewWalletsList', newWallets);
          store.commit('newWallets/setModal', true);
          password.value = '';
          importedFromWallets.value = syncResult;
        } else {
          syncLoading.value = false;
        }
      }
    };

    const syncWallets = async () => {
      incorrectPasswordExtension.value = false;
      const isReadyToSync = await window.citadel.isReadyToSync();
      const extensionPasswordHash = await window.citadel.getPasswordHash();

      if (!isReadyToSync) {
        confirmPassword.value = false;
        notify({
          type: 'warning',
          text: t('syncExtensions.emptyWallets'),
        });

        return;
      }

      confirmPassword.value = true;

      if (window.citadel && !incorrectPassword.value) {
        const citadelPasswordHash = CryptoJS.SHA256(
          passwordExtension.value
        ).toString();
        if (citadelPasswordHash !== extensionPasswordHash) {
          incorrectPasswordExtension.value = true;

          notify({
            type: 'warning',
            text: t('syncExtensions.incorrectPasswordExtension'),
          });

          return;
        }
        incorrectPasswordExtension.value = false;

        syncLoading.value = true;
        let syncResult = null;

        try {
          const formattedWallets = await Promise.all(
            checkedItems.value.map(async (w) => {
              const decodedMnemonic = await store.dispatch(
                'crypto/decodeUserMnemonic',
                {
                  password: password.value,
                  customMnemonic: w.importedFromSeed || null,
                }
              );
              const decodedPrivateKey =
                await citadel.decodePrivateKeyByPassword(
                  w.net,
                  w.privateKeyEncoded,
                  password.value
                );

              const encodedKey = await citadel.encodePrivateKeyByPassword(
                w.net,
                decodedPrivateKey.data,
                passwordExtension.value
              );

              return {
                mnemonic:
                  w.type === WALLET_TYPES.LEDGER
                    ? null
                    : CryptoJS.AES.encrypt(
                        decodedMnemonic,
                        passwordExtension.value
                      ).toString(),
                wallets: [
                  {
                    derivationPath:
                      w.type === WALLET_TYPES.LEDGER ? w.derivationPath : null,
                    publicKey:
                      w.type === WALLET_TYPES.LEDGER ? w.publicKey : null,
                    type:
                      w.type === WALLET_TYPES.LEDGER
                        ? WALLET_TYPES.LEDGER
                        : WALLET_TYPES.ONE_SEED,
                    net: w.net,
                    address: w.address,
                    privateKeyEncoded: encodedKey.data,
                  },
                ],
              };
            })
          );
          syncResult = await window.citadel.syncToExtension(formattedWallets);
          syncLoading.value = false;

          if (syncResult === true) {
            emit('close');
          }
        } catch (err) {
          console.log(err, 'error');
          syncLoading.value = false;
        }
      }
    };

    return {
      showMenuModal,
      showSyncToModal,
      showSyncFromModal,
      showSuccessFromSyncModal,
      onSuccessFromSyncClose,
      importedFromWallets,

      searchWalletStr,
      syncLoading,
      password,
      passwordExtension,
      confirmPassword,
      incorrectPassword,
      incorrectPasswordExtension,
      walletsToSync,

      isCheck,
      checkedItems,
      addItem,
      removeItem,
      syncTo,
      syncFrom,
      syncWallets,
    };
  },
};
</script>
<style lang="scss" scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  margin: 40px 0 0 0;

  .btn {
    margin: 5px 0;
  }
}

.syncto-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 15px 0;

  .syncto-input {
    height: 68px;
    width: 100%;
    margin-bottom: 15px;
  }

  .password-wrap {
    width: 100%;
    height: 90px;
    padding-top: 20px;

    &.mt-10 {
      margin-top: 15px;
    }
  }

  .syncto-addresses {
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
  }

  .btn {
    margin: 30px auto 0;
  }
}
</style>

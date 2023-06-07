<template>
  <div class="multisig-balance">
    <div class="multisig-balance__main">
      <div class="multisig-balance__title">
        {{ $t('multisigBalance.title') }}
      </div>
      <div class="multisig-balance__line" />
      <div class="multisig-balance__fields">
        <div class="autocomplete">
          <Autocomplete
            id="networks"
            v-model:value="searchAddress"
            :items="addresses"
            initial-icon="curve-arrow"
            :label="$t('multisigBalance.labelAddress')"
            :placeholder="$t('multisigBalance.labelPlaceholder')"
            @update:value="selectAddress"
          />
        </div>
        <div class="autocomplete">
          <Autocomplete
            id="networks"
            v-model:value="searchContract"
            :items="contracts"
            initial-icon="curve-arrow"
            :label="$t('multisigBalance.contractLabel')"
            :placeholder="$t('multisigBalance.contractPlaceholder')"
            @update:value="selectContract"
          />
        </div>
      </div>
      <div class="multisig-balance__stats-wrap">
        <div class="multisig-balance__stats">
          <div class="multisig-balance__info-line">
            <span class="multisig-balance__info-title">{{
              $t('multisigBalance.statsFrozen')
            }}</span>
            <el-tooltip placement="bottom" effect="rewards-list-tooltip">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigBalance.statsFrozenDescription') }}
                </div>
              </template>
            </el-tooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value:
                    privateSaleInfo.total -
                    (privateSaleInfo.pending + privateSaleInfo.used),
                  currency: 'XCT',
                }"
              />
              /
              <span
                v-pretty-number="{
                  value: privateSaleInfo.total,
                  currency: 'XCT',
                }"
              />
              <span class="multisig-balance__info-currency">
                {{ 'XCT' }}
              </span>
            </span>
          </div>
          <div class="multisig-balance__info-line">
            <span class="multisig-balance__info-title">{{
              $t('multisigBalance.statsUnlocked')
            }}</span>
            <el-tooltip placement="bottom" effect="rewards-list-tooltip">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigBalance.statsUnlockedDescription') }}
                </div>
              </template>
            </el-tooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: privateSaleInfo.pending + privateSaleInfo.used,
                  currency: 'XCT',
                }"
              />
              <span class="multisig-balance__info-currency">
                {{ 'XCT' }}
              </span>
            </span>
          </div>
          <div class="multisig-balance__info-line">
            <span class="multisig-balance__info-title">{{
              $t('multisigBalance.statsClaimed')
            }}</span>
            <el-tooltip placement="bottom" effect="rewards-list-tooltip">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigBalance.statsClaimedDescription') }}
                </div>
              </template>
            </el-tooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: privateSaleInfo.used,
                  currency: 'XCT',
                }"
              />
              <span class="multisig-balance__info-currency">
                {{ 'XCT' }}
              </span>
            </span>
          </div>
          <div class="multisig-balance__info-line">
            <span class="multisig-balance__info-title">
              {{ $t('multisigBalance.youHave') }}
            </span>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: privateSaleInfo.pending,
                  currency: 'XCT',
                }"
              />
              <span class="multisig-balance__info-currency">
                {{ 'XCT' }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <PrimaryButton
        :disabled="!selectedAddress || !selectedContract"
        :loading="loadingClaim"
        class="claim-btn"
        @click="prepareClaim"
      >
        {{ $t('multisigBalance.claim') }}
      </PrimaryButton>
    </div>
    <!-- CONFIRM CLAIM -->
    <teleport to="body">
      <Modal v-if="showClaimModal">
        <ModalContent
          v-click-away="clickAwayModal"
          :disabled="confirmModalDisabled"
          :submit-button="false"
          type="action"
          :loading="loadingSign"
          :title="$t('multisigBalance.confirmModalTitle')"
          :desc="$t('multisigBalance.confirmModalDescription')"
          :button-text="$t('confirm')"
          @buttonClick="prepareClaim"
          @close="showClaimModal = false"
        >
          <div class="claim-container">
            <div v-if="confirmModalDisabled" class="claim-loader">
              <Loading />
            </div>
            <div class="rows">
              <div class="claim-item">
                <div class="label">{{ $t('multisigBalance.claimTo') }}:</div>
                <div class="value">
                  {{ selectedAddress }}
                </div>
              </div>
              <div class="claim-item">
                <div class="label">
                  {{ $t('multisigBalance.amountToClaim') }}:
                </div>
                <div class="value">
                  <span
                    v-pretty-number="{
                      value: privateSaleInfo?.pending,
                      currency: 'XCT',
                    }"
                    class="blue"
                  />
                  XCT
                </div>
              </div>
              <div class="claim-item">
                <div class="label">{{ $t('multisigBalance.fee') }}:</div>
                <div class="value">
                  <span
                    v-pretty-number="{
                      value: preparePrivateClaim?.fee,
                      currency: 'BNB',
                    }"
                    class="red"
                  />
                  BNB
                </div>
              </div>
            </div>
            <div class="total">
              <div class="label">{{ $t('multisigBalance.totalAmount') }}:</div>
              <div class="value">
                <span
                  v-pretty-number="{
                    value: privateSaleInfo?.pending,
                    currency: 'XCT',
                  }"
                  class="blue"
                />
                XCT&nbsp;&nbsp;/&nbsp;&nbsp;<span
                  v-pretty-number="{
                    value: preparePrivateClaim?.fee,
                    currency: 'BNB',
                  }"
                  class="red"
                />
                BNB
              </div>
            </div>
            <div
              v-if="
                signerWallet &&
                PRIVATE_PASSWORD_TYPES.includes(signerWallet.type)
              "
              class="password-wrap"
            >
              <Input
                id="password"
                v-model="password"
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
              />
            </div>
            <PrimaryButton
              :disabled="confirmModalDisabled"
              class="confirm-btn"
              @click="confirmClaim"
            >
              {{ $t('confirm') }}
            </PrimaryButton>
          </div>
        </ModalContent>
      </Modal>
      <Modal v-if="showSuccessModal">
        <!-- SHOW SUCCESS MODAL -->
        <ModalContent
          v-click-away="closeSuccessModal"
          title="Success"
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
            :wallet="signerWallet || mergeWallet"
            :tx-hash="successTx"
            :fee="preparePrivateClaim?.fee"
            type="transfer"
          />
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Autocomplete from '@/components/UI/Autocomplete';
import PrimaryButton from '@/components/UI/PrimaryButton';
import info from '@/assets/icons/info.svg';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import { WALLET_TYPES, PRIVATE_PASSWORD_TYPES } from '@/config/walletType';
import Loading from '@/components/Loading';
import Input from '@/components/UI/Input';
import { sha3_256 } from 'js-sha3';
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent.vue';
import notify from '@/plugins/notify';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'MultisigBalance',
  components: {
    Modal,
    ModalContent,
    Loading,
    SuccessModalContent,
    Input,
    Autocomplete,
    PrimaryButton,
    info,
  },
  setup() {
    const store = useStore();
    const searchAddress = ref('');
    const searchContract = ref('');
    const loadingClaim = ref(false);
    const loadingSign = ref(false);

    const selectedAddress = ref('');
    const selectedContract = ref('');

    const showClaimModal = ref(false);
    const confirmModalDisabled = ref(false);

    const showSuccessModal = ref(false);
    const successTx = ref(null);

    const txComment = ref('');

    const password = ref('');
    const signerWallet = ref(null);
    const confirmPassword = ref(false);

    const { wallets } = useWallets();

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const mergeWallet = ref({}); // metamask

    onMounted(async () => {
      if (window.ethereum?.selectedAddress) {
        await store.dispatch('metamask/connectToMetamask');
        if (metamaskConnector.value.network === 'bsc') {
          const metamaskNet = metamaskConnector.value.network;
          const metamaskAddress =
            metamaskConnector.value.accounts[0] &&
            metamaskConnector.value.accounts[0].toLowerCase();

          mergeWallet.value = wallets.value.find(
            (w) =>
              w.type === WALLET_TYPES.PUBLIC_KEY &&
              metamaskNet === w.net &&
              metamaskAddress === w.address.toLowerCase()
          );
        }
      }
    });

    const addresses = computed(() =>
      wallets.value
        .filter((w) => w?.net === 'bsc' && w?.type !== WALLET_TYPES.PUBLIC_KEY)
        .concat([mergeWallet.value])
        .map((w) => ({
          id: w?.address,
          title: w?.address,
          icon: 'bsc',
        }))
        .filter((w) => !!w.title)
    );

    const incorrectPassword = computed(
      () => sha3_256(password.value) !== store.getters['crypto/passwordHash']
    );

    const privateSaleInfo = computed(
      () => store.getters['investors/privateSaleInfo']
    );
    const preparePrivateClaim = computed(
      () => store.getters['investors/preparePrivateClaim']
    );

    const contracts = ref([
      { id: 1, title: 'Advisors' },
      { id: 2, title: 'Private 1' },
      { id: 3, title: 'Private 2' },
      { id: 4, title: 'Team' },
    ]);

    const selectAddress = async (address) => {
      selectedAddress.value = address;

      if (address && selectedContract.value) {
        loadingClaim.value = true;
        await store.dispatch('investors/getPrivateSaleInfo', {
          address: selectedAddress.value,
          category: selectedContract.value,
        });
        loadingClaim.value = false;
      }

      if (address) {
        signerWallet.value = wallets.value.find(
          (w) =>
            w.address.toLowerCase() === address.toLowerCase() && w.net === 'bsc'
        );
      }
    };

    const selectContract = async (contract) => {
      // formatted param
      selectedContract.value = contract.replace(' ', '').toLowerCase();

      if (contract && selectedAddress.value) {
        loadingClaim.value = true;
        await store.dispatch('investors/getPrivateSaleInfo', {
          address: selectedAddress.value,
          category: selectedContract.value,
        });
        loadingClaim.value = false;
      }
    };

    const clickAwayModal = () => {
      if (showClaimModal.value) {
        showClaimModal.value = false;
      }
    };

    const prepareClaim = async () => {
      loadingClaim.value = true;
      showClaimModal.value = true;
      await store.dispatch('investors/getPreparePrivateClaim', {
        address: selectedAddress.value,
        category: selectedContract.value,
      });
      loadingClaim.value = false;
    };

    const confirmClaim = async () => {
      loadingSign.value = true;
      if (
        signerWallet.value.type === WALLET_TYPES.PUBLIC_KEY &&
        selectedAddress.value &&
        selectedAddress.value.toLowerCase() ===
          metamaskConnector.value.accounts[0]?.toLowerCase()
      ) {
        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            preparePrivateClaim.value.tx
          );

        if (metamaskResult.error) {
          loadingSign.value = false;
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
        } else {
          loadingSign.value = false;
          confirmModalDisabled.value = false;
          store.commit('investors/SET_PREPARE_PRIVATE_CLAIM', null, {
            root: true,
          });
          showClaimModal.value = false;
          showSuccessModal.value = true;
          successTx.value = [metamaskResult.txHash];
        }

        return;
      }

      confirmPassword.value = true;

      if (
        PRIVATE_PASSWORD_TYPES.includes(signerWallet.value.type) &&
        incorrectPassword.value
      ) {
        return;
      }

      confirmModalDisabled.value = true;

      const result = await signerWallet.value.signAndSendTransfer({
        walletId: signerWallet.value.id,
        rawTransaction: preparePrivateClaim.value.tx,
        privateKey:
          password.value &&
          (await signerWallet.value.getPrivateKeyDecoded(password.value)),
        derivationPath: signerWallet.value.derivationPath,
      });

      if (result.error) {
        loadingSign.value = false;
        confirmModalDisabled.value = false;
        store.commit('investors/SET_PREPARE_PRIVATE_CLAIM', null, {
          root: true,
        });
        showClaimModal.value = false;

        notify({
          type: 'warning',
          text: result.error,
        });

        return;
      }

      loadingSign.value = false;
      confirmModalDisabled.value = false;
      store.commit('investors/SET_PREPARE_PRIVATE_CLAIM', null, { root: true });
      showClaimModal.value = false;
      showSuccessModal.value = true;
      successTx.value = result.data;
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: 'bsc',
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
      store.commit('investors/SET_PREPARE_PRIVATE_CLAIM', null, { root: true });
      showSuccessModal.value = false;
      confirmPassword.value = false;
      successTx.value = '';
      password.value = '';
    };

    return {
      loadingSign,
      loadingClaim,
      txComment,
      successClickHandler,
      preparePrivateClaim,
      confirmModalDisabled,
      showSuccessModal,
      closeSuccessModal,
      successTx,
      clickAwayModal,
      incorrectPassword,
      confirmPassword,
      WALLET_TYPES,
      signerWallet,
      password,
      addresses,
      contracts,
      searchAddress,
      privateSaleInfo,
      searchContract,
      showClaimModal,
      selectedAddress,
      mergeWallet,
      selectedContract,
      prepareClaim,
      confirmClaim,
      selectAddress,
      selectContract,
      metamaskConnector,
      PRIVATE_PASSWORD_TYPES,
    };
  },
};
</script>

<style lang="scss" scoped>
.hint {
  color: #6b93c0;
  font-size: 14px;
  font-family: 'Panton_Regular';
  max-width: 180px;
  display: block;
}
.multisig-balance {
  width: 940px;
  margin: auto;
  position: relative;

  display: flex;
  align-items: center;
  flex: 1;

  &__main {
    height: 506px;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: 1;
    background: $white;
    box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
    border-radius: 50px;
    @include lg {
      border-radius: 25px;
    }
    @include md {
      box-shadow: 0px 0px 25px rgba(106, 75, 255, 0.3);
      border-radius: 25px;
    }
  }

  &__title {
    color: #0a2778;
    text-transform: uppercase;
    font-size: 20px;
    font-family: 'Panton_SemiBold';
  }

  &__line {
    background: #f0f3fd;
    border-radius: 50px;
    height: 2px;
    width: 100%;
    margin-top: 20px;
  }

  &__stats-wrap {
    display: flex;
    justify-content: flex-end;
  }

  &__stats {
    width: 430px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    margin-top: 30px;
  }

  &__fields {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__info-line {
    display: flex;
    width: 100%;
    margin-bottom: 11px;
    align-items: baseline;

    &:last-child {
      margin-bottom: 0;
    }

    @include md {
      margin-bottom: 7px;
    }
  }

  &__info-title {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_SemiBold';
    white-space: nowrap;
    display: flex;
    align-items: center;

    @include md {
      font-size: 14px;
      line-height: 17px;
    }

    &__text {
      padding-right: 5px;
      font-family: inherit;
    }
  }

  &__info-white-space {
    flex-grow: 1;
    border-bottom: 1px dashed $gainsboro;
  }

  &__info-value {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_Bold';
    color: $ligth-blue;
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }

  &__info-currency {
    font-family: 'Panton_Light';
    color: $black;
  }

  .autocomplete {
    width: 430px;
    height: 68px;
    position: relative;
    @include md {
      width: 483px;
    }
  }

  .info-icon {
    margin-left: 5px;
  }

  .claim-btn {
    margin: 90px auto 0;
  }
}

.claim-container {
  width: 100%;
  display: flex;
  flex-direction: column;

  .claim-loader {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rows {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #bcc2d8;

    .claim-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      .label {
        color: $fieldName;
        font-size: 14px;
        font-family: 'Panton_Regular';
      }

      .value {
        color: $black;
        font-size: 14px;
        font-family: 'Panton_Regular';

        .blue {
          color: $blue;
          font-family: 'Panton_Bold';
        }

        .red {
          color: $red;
          font-family: 'Panton_Bold';
        }
      }
    }
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    .label {
      color: $black;
      font-family: 'Panton_SemiBold';
      font-size: 18px;
    }

    .value {
      color: $fieldName;
      font-family: 'Panton_SemiBold';

      .blue {
        font-size: 18px;
        color: $blue;
      }

      .red {
        font-size: 18px;
        color: $red;
      }
    }
  }

  .confirm-btn {
    margin: 25px auto 0;
  }

  .password-wrap {
    margin-top: 20px;
    height: 66px;
  }
}
</style>

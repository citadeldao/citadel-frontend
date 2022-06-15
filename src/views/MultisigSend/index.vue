<template>
  <div class="multisig-balance">
    <div class="multisig-balance__main">
      <div class="multisig-balance__title">
        {{ $t('multisigSend.title') }}
      </div>
      <div class="multisig-balance__line" />
      <div class="multisig-balance__fields">
        <div class="autocomplete">
          <Autocomplete
            id="networks"
            v-model:value="searchAddress"
            :items="addresses"
            initial-icon="curve-arrow"
            :label="$t('multisigSend.labelAddress')"
            :placeholder="$t('multisigSend.labelPlaceholder')"
            @update:value="selectAddress"
          />
        </div>
        <div class="autocomplete">
          <Autocomplete
            id="networks"
            v-model:value="searchFund"
            :items="funds"
            initial-icon="curve-arrow"
            :label="$t('multisigSend.selectFundLabel')"
            :placeholder="$t('multisigSend.selectFundPlaceholder')"
            @update:value="selectFund"
          />
        </div>
      </div>
      <div class="multisig-balance__stats-wrap">
        <div class="inputs">
          <div class="input-field">
            <Input
              id="to"
              v-model="toAddress"
              :label="$t('to')"
              type="text"
              icon="curve-arrow"
              :with-copy="true"
              :placeholder="$t('selectAddress')"
              :show-error-text="''"
              :error="incorrectAddress"
              data-qa="send__to-field"
            />
          </div>
          <div
            :class="{ incorrectAddress: !!incorrectAddress }"
            class="input-field"
          >
            <Input
              id="amount"
              v-model="amount"
              type="currency"
              currency="XCT"
              :label="$t('amount')"
              :max="balanceFundInfo.total - balanceFundInfo.used"
              placeholder="0.0"
              icon="coins"
              :show-error-text="''"
              :error="insufficientFunds"
              data-qa="send__amount-field"
              show-set-max
            />
          </div>
        </div>
        <div class="multisig-balance__stats">
          <div class="multisig-balance__info-line">
            <span class="multisig-balance__info-title">{{
              $t('multisigSend.available')
            }}</span>
            <BalanceTooltip left="-128px" width="280px">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigSend.availableHint') }}
                </div>
              </template>
            </BalanceTooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: balanceFundInfo.total - balanceFundInfo.used,
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
              $t('multisigSend.spend')
            }}</span>
            <BalanceTooltip left="-88px" width="200px">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigSend.spendHint') }}
                </div>
              </template>
            </BalanceTooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: balanceFundInfo.used,
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
              $t('multisigSend.total')
            }}</span>
            <BalanceTooltip left="-88px" width="200px">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigSend.totalHint') }}
                </div>
              </template>
            </BalanceTooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: balanceFundInfo.total,
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
              $t('multisigSend.claimable')
            }}</span>
            <BalanceTooltip left="-88px" width="200px">
              <info class="info-icon" />
              <template #content>
                <div class="hint">
                  {{ $t('multisigSend.claimableHint') }}
                </div>
              </template>
            </BalanceTooltip>
            <div class="multisig-balance__info-white-space" />
            <span class="multisig-balance__info-value">
              <span
                v-pretty-number="{
                  value: balanceFundInfo.pending,
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
        :disabled="
          !selectedAddress ||
          !selectedFund ||
          !amount ||
          !toAddress ||
          !!incorrectAddress ||
          !!insufficientFunds
        "
        class="claim-btn"
        @click="prepareClaim"
      >
        {{ $t('send') }}
      </PrimaryButton>
    </div>
    <!-- CONFIRM SEND -->
    <teleport to="body">
      <Modal v-if="showClaimModal">
        <ModalContent
          v-click-away="clickAwayModal"
          :disabled="confirmModalDisabled"
          :submit-button="false"
          type="action"
          :title="$t('multisigSend.confirmModalTitle')"
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
                <div class="label">{{ $t('multisigSend.selectedFund') }}:</div>
                <div class="value">
                  {{ selectedFund }}
                </div>
              </div>
              <div class="claim-item">
                <div class="label">{{ $t('multisigSend.sendTo') }}:</div>
                <div class="value">
                  {{ toAddress }}
                </div>
              </div>
              <div class="claim-item">
                <div class="label">{{ $t('multisigSend.amountToSend') }}:</div>
                <div class="value">
                  <span
                    v-pretty-number="{ value: amount, currency: 'XCT' }"
                    class="blue"
                  />
                  XCT
                </div>
              </div>
              <div class="claim-item">
                <div class="label">{{ $t('multisigSend.fee') }}:</div>
                <div class="value">
                  <span
                    v-pretty-number="{
                      value: prepareTransferFund?.fee,
                      currency: 'BNB',
                    }"
                    class="red"
                  />
                  BNB
                </div>
              </div>
            </div>
            <div class="total">
              <div class="label">{{ $t('multisigSend.totalAmount') }}:</div>
              <div class="value">
                <span
                  v-pretty-number="{ value: amount, currency: 'XCT' }"
                  class="blue"
                />
                XCT&nbsp;&nbsp;/&nbsp;&nbsp;<span
                  v-pretty-number="{
                    value: prepareTransferFund?.fee,
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
            :wallet="signerWallet"
            :tx-hash="[successTx]"
            :fee="prepareTransferFund?.value?.fee"
            type="transfer"
          />
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Autocomplete from '@/components/UI/Autocomplete';
import PrimaryButton from '@/components/UI/PrimaryButton';
import info from '@/assets/icons/info.svg';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import { default as BalanceTooltip } from '@/components/Tooltip';
import { WALLET_TYPES } from '@/config/walletType';
import Loading from '@/components/Loading';
import Input from '@/components/UI/Input';
import { sha3_256 } from 'js-sha3';
import useWallets from '@/compositions/useWallets';
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent.vue';
import notify from '@/plugins/notify';

export default {
  name: 'MultisigSend',
  components: {
    Modal,
    ModalContent,
    Loading,
    SuccessModalContent,
    Input,
    Autocomplete,
    PrimaryButton,
    BalanceTooltip,
    info,
  },
  setup() {
    const store = useStore();
    const searchAddress = ref('');
    const searchFund = ref('');

    const selectedAddress = ref('');
    const selectedFund = ref('');

    const showClaimModal = ref(false);
    const confirmModalDisabled = ref(false);

    const showSuccessModal = ref(false);
    const successTx = ref(null);

    const txComment = ref('');

    const password = ref('');
    const signerWallet = ref(null);
    const confirmPassword = ref(false);

    const amount = ref('');
    const toAddress = ref('');

    const { wallets } = useWallets();
    const addresses = computed(() => {
      return wallets.value
        .filter((w) => w.net === 'bsc' && w.type !== WALLET_TYPES.PUBLIC_KEY)
        .map((w) => {
          return {
            id: w.address,
            title: w.address,
            icon: 'bsc',
          };
        });
    });

    const incorrectPassword = computed(
      () => sha3_256(password.value) !== store.getters['crypto/passwordHash']
    );

    const balanceFundInfo = computed(
      () => store.getters['investors/balanceFundInfo']
    );
    const prepareTransferFund = computed(
      () => store.getters['investors/prepareTransferFund']
    );

    const insufficientFunds = computed(
      () =>
        (!!amount.value && amount.value) >
          balanceFundInfo.value.total - balanceFundInfo.value.used &&
        'Insufficient funds'
    );
    const incorrectAddress = computed(
      () =>
        toAddress.value &&
        !signerWallet.value.validateAddress(toAddress.value) &&
        'Incorrect address'
    );

    const funds = ref([
      { id: 1, title: 'Community' },
      { id: 2, title: 'Foundation' },
      { id: 3, title: 'Ecosystem' },
    ]);

    const selectAddress = (address) => {
      selectedAddress.value = address;

      if (address && selectedFund.value) {
        store.dispatch('investors/getBalanceFundInfo', {
          address: selectedAddress.value,
          category: selectedFund.value,
        });
      }

      if (address) {
        signerWallet.value = wallets.value.find(
          (w) =>
            w.address.toLowerCase() === address.toLowerCase() && w.net === 'bsc'
        );
      }
    };

    const selectFund = (fund) => {
      // formatted param
      selectedFund.value = fund.toLowerCase();

      if (fund && selectedAddress.value) {
        store.dispatch('investors/getBalanceFundInfo', {
          address: selectedAddress.value,
          category: selectedFund.value,
        });
      }
    };

    const clickAwayModal = () => {
      if (showClaimModal.value) {
        showClaimModal.value = false;
      }
    };

    const prepareClaim = async () => {
      await store.dispatch('investors/getPrepareTransferFund', {
        address: selectedAddress.value,
        category: selectedFund.value,
        amount: amount.value,
        recipient: toAddress.value,
      });

      if (prepareTransferFund?.value?.fee) {
        showClaimModal.value = true;
      }
    };

    const confirmClaim = async () => {
      confirmPassword.value = true;

      if (
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
          signerWallet.value.type
        ) &&
        incorrectPassword.value
      ) {
        return;
      }

      confirmModalDisabled.value = true;

      const result = await signerWallet.value.signAndSendTransfer({
        walletId: signerWallet.value.id,
        rawTransaction: prepareTransferFund.value.tx,
        privateKey:
          password.value &&
          signerWallet.value.getPrivateKeyDecoded(password.value),
        derivationPath: signerWallet.value.derivationPath,
      });

      if (result.error) {
        confirmModalDisabled.value = false;
        store.commit('investors/SET_PREPARE_TRANSFER_FUND', null, {
          root: true,
        });
        showClaimModal.value = false;

        notify({
          type: 'warning',
          text: result.error,
        });

        return;
      }

      confirmModalDisabled.value = false;
      store.commit('investors/SET_PREPARE_TRANSFER_FUND', null, { root: true });
      showClaimModal.value = false;
      showSuccessModal.value = true;
      successTx.value = result.data;
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: 'bsc',
          hash: successTx.value,
          text: txComment.value,
        }));
      txComment.value = '';

      confirmPassword.value = false;
      showSuccessModal.value = false;
      successTx.value = '';
      password.value = '';
    };

    const closeSuccessModal = () => {
      store.commit('investors/SET_PREPARE_TRANSFER_FUND', null, { root: true });
      showSuccessModal.value = false;
      confirmPassword.value = false;
      successTx.value = '';
      password.value = '';
      amount.value = '';
      toAddress.value = '';
    };

    return {
      txComment,
      successClickHandler,
      prepareTransferFund,
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
      funds,
      searchAddress,
      balanceFundInfo,
      searchFund,
      showClaimModal,
      selectedAddress,
      selectedFund,
      prepareClaim,
      confirmClaim,
      selectAddress,
      selectFund,

      insufficientFunds,
      incorrectAddress,
      amount,
      toAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
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
    justify-content: space-between;
    align-items: flex-start;

    .inputs {
      width: 430px;

      .input-field {
        margin-top: 15px;
        height: 68px;

        &.incorrectAddress {
          margin-top: 35px;
        }
      }
    }
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

  .hint {
    color: #6b93c0;
    font-size: 14px;
    font-family: 'Panton_Regular';
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

<template>
  <div class="salary-page">
    <div class="salary-page__main p15">
      <emptySvg v-if="!membersList.length" class="empty-icon" />
      <div class="salary-members-wrap" v-else>
        <div
          v-for="(member, ndx) in membersList"
          :key="ndx"
          class="salary-members"
        >
          <MemberItem
            :member="member"
            :edited="memberToEdit?.name === member.name"
            :active="
              !!selectedMembers.find((select) => select.name === member.name)
            "
            :num="ndx + 1"
            :symbol="tokenContract?.symbol"
            :rate-usd="rateUsd"
            @editMember="onEditMember"
          />
        </div>
      </div>
      <div class="btns">
        <div class="btn">
          <PrimaryButton
            bg-color="#66af7c"
            hover-bg-color="#4b9361"
            @click="showBackupModal = true"
          >
            IMPORT LIST
          </PrimaryButton>
        </div>
        <div class="btn">
          <PrimaryButton @click="showMemberModal = true">
            ADD MEMBER
          </PrimaryButton>
        </div>
        <div v-if="membersList.length" class="btn">
          <PrimaryButton
            bg-color="#FA3B33"
            box-shadow="0px 0px 25px rgba(219, 71, 60, 0.3)"
            hover-bg-color="#000000"
            @click="copyBackup"
          >
            EXPORT LIST
          </PrimaryButton>
        </div>
      </div>
    </div>
    <div class="salary-page__main">
      <Tabs
        :items="TABS_CONTROLS"
        :active-index="activeTabControlsIndex"
        @changeTab="onChangeTabCongrolsIndex"
      />
      <!-- TABS CONTROLS -->
      <ReportPreview v-if="activeTabControlsIndex === 1" />
      <template v-else>
        <div class="fields">
          <div class="autocomplete z1">
            <Autocomplete
              id="utocomplete-networks"
              v-model:value="searchAddress"
              :items="addresses"
              initial-icon="curve-arrow"
              :label="signerWallet?.title || 'Signer (BSC)'"
              :placeholder="$t('multisigBalance.labelPlaceholder')"
              @update:value="selectAddress"
            />
          </div>
          <div class="autocomplete">
            <Autocomplete
              id="autocomplete-tokens"
              v-model:value="searchToken"
              :disabled="true"
              :items="tokens"
              initial-icon="curve-arrow"
              :label="mainBalance + '' || 'Token'"
              placeholder="Select token"
              @update:value="selectToken"
            />
          </div>
          <div
            v-if="tokenContract?.contract"
            class="salary-page__controls-contract"
          >
            Contract:
            <a
              :href="`https://bscscan.com/token/${tokenContract?.contract}`"
              target="_blank"
              >{{ tokenContract?.contract }}</a
            >
          </div>
          <div class="field">
            <Input
              id="rateUsd"
              v-model="rateUsd"
              :label="`Rate ${tokenContract?.symbol || '?'} / N`"
              :placeholder="`1 ${tokenContract?.symbol || '?'} = ? N`"
              type="number"
            />
          </div>
        </div>
        <div class="salary-page__controls">
          <div
            v-if="selectedMembers.length"
            class="salary-page__controls-counter"
          >
            {{ selectedMembers.length }} / {{ membersList.length }}
          </div>
          <PrimaryButton
            v-if="
              membersList.length && selectedMembers.length < membersList.length
            "
            class="salary-page__controls-selectall"
            @click="selectedMembers = [].concat(membersList)"
          >
            Select all Members
          </PrimaryButton>
          <div
            v-if="selectedMembers.length > 1"
            class="salary-page__controls-deselectall"
            @click="selectedMembers = []"
          >
            Unselect all Members
          </div>
        </div>
        <div
          v-if="selectedMembers.length && tokenContract && rateUsd"
          class="btn-next"
        >
          <PrimaryButton :loading="isLoadingPrepare" @click="prepareTransfer">
            NEXT
          </PrimaryButton>
        </div>
      </template>
    </div>
    <!-- MEMBER MODAL -->
    <Modal v-if="showMemberModal" @close="closeMemberModal">
      <ModalContent
        v-click-away="closeMemberModal"
        title="Member info"
        desc="Fill all fields to add/update member"
        :button-text="memberToEdit ? 'UPDATE' : 'ADD'"
        :button-text2="memberToEdit ? 'DELETE' : ''"
        type="system"
        @close="closeMemberModal"
        @buttonClick="confirmMember"
        @buttonClick2="onDeleteMember"
      >
        <MemberForm
          :member-to-edit="memberToEdit"
          @updateFormData="onUpdateFormData"
        />
      </ModalContent>
    </Modal>
    <!-- BACKUP MODAL -->
    <Modal v-if="showBackupModal" @close="closeBackupModal">
      <ModalContent
        v-click-away="closeBackupModal"
        title="Import members list from JSON"
        desc="Upload file with member list"
        type="system"
        @close="closeBackupModal"
      >
        <!-- <div class="textarea-wrap">
          <Textarea id="json-backup" v-model:value="jsonBackup" icon="text" />
        </div> -->
        <div class="salary-import-list">
          <!-- <PrimaryButton @click="importBackup">IMPORT</PrimaryButton> -->
          <PrimaryButton class="upload-btn">UPLOAD FILE</PrimaryButton>
          <input
            v-if="!file"
            data-qa="file-input"
            type="file"
            name="file-input"
            accept=".json"
            class="upload-input"
            @change="handleFileInput"
          />
        </div>
      </ModalContent>
    </Modal>
    <!-- PREPARE MODAL -->
    <Modal v-if="showPrepareModal" @close="closePrepareModal">
      <ModalContent
        v-click-away="closePrepareModal"
        width="800px"
        title="Confirm operation"
        desc="Please, check the details below"
        :button-text="!Object.keys(successTxs).length ? 'SIGN' : 'FINISH'"
        type="system"
        :loading="signLoading"
        @close="closePrepareModal"
        @buttonClick="
          Object.keys(successTxs).length
            ? closePrepareModal()
            : signAndSend(signAndSendCb)
        "
      >
        <div class="salary-page__transactions">
          <div v-for="(member, ndx) in selectedMembers" :key="ndx" class="item">
            <div class="name">{{ member.name }}</div>
            <div v-if="!successTxs[member.name]" class="amount">
              {{ (member.amount / rateUsd).toFixed(4) }}
              <span>{{ tokenContract?.symbol }}</span>
            </div>
            <a
              v-else
              class="link"
              target="_blank"
              :href="`https://bscscan.com/tx/${successTxs[member.name]}`"
            >
              {{ (member.amount / rateUsd).toFixed(4) }}
              {{ tokenContract?.symbol }}
            </a>
          </div>
        </div>
        <template
          v-if="
            !Object.keys(successTxs).length &&
            signerWallet &&
            [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
              signerWallet.type
            )
          "
        >
          <div class="line" />
          <div class="field">
            <Input
              id="password"
              v-model="password"
              :show-error-text="!!incorrectPassword && confirmPassword"
              :error="
                incorrectPassword && confirmPassword ? 'Incorrect password' : ''
              "
              :label="$t('enterPassword')"
              :placeholder="$t('password')"
              type="password"
              icon="key"
            />
          </div>
        </template>
      </ModalContent>
    </Modal>
  </div>
</template>
<script>
import useWallets from '@/compositions/useWallets';
import { computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { WALLET_TYPES } from '@/config/walletType';
import citadel from '@citadeldao/lib-citadel';
import Autocomplete from '@/components/UI/Autocomplete';
import PrimaryButton from '@/components/UI/PrimaryButton';
// import Textarea from '@/components/UI/Textarea';
import Input from '@/components/UI/Input';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import MemberForm from './components/MemberForm';
import MemberItem from './components/MemberItem';
import ReportPreview from './components/ReportPreview';
import Tabs from './components/Tabs';
import notify from '@/plugins/notify';
import emptySvg from '@/assets/icons/browser.svg';
// import copyToClipboard from '@/helpers/copyToClipboard';
import FileSaver from 'file-saver';
import { sha3_256 } from 'js-sha3';
import { TABS_CONTROLS } from './config';
import { useRoute } from 'vue-router';

export default {
  name: 'SalaryPage',
  components: {
    Autocomplete,
    PrimaryButton,
    // Textarea,
    Input,
    Modal,
    ModalContent,
    MemberForm,
    MemberItem,
    ReportPreview,
    Tabs,
    emptySvg,
  },
  setup() {
    const { wallets } = useWallets();
    const mainBalance = ref('');
    const showMemberModal = ref(false);
    const showBackupModal = ref(false);
    const showPrepareModal = ref(false);
    const router = useRoute();

    const password = ref('');
    const confirmPassword = ref(false);

    const rawsTxs = ref([]);

    const rateUsd = ref('');

    const jsonBackup = ref('');

    const memberName = ref('');
    const memberAmount = ref('');
    const memberAddress = ref('');

    const memberToEdit = ref(null);

    const searchAddress = ref('');
    const searchToken = ref('');
    const tokenContract = ref('');

    const store = useStore();
    const isLoadingPrepare = ref(false);
    const signLoading = ref(false);

    const signerWallet = ref(null);

    const selectedMembers = ref([]);

    const activeTabControlsIndex = ref(0);

    const file = ref(null);

    onMounted(() => {
      if (router.query.token) {
        document.querySelector('.header').style.display = 'none'; // app mode
      }
    });

    // ------- IMPORT FILE -----
    const handleFileInput = (e) => {
      const [payload] = e.target.files;

      if (!payload?.name?.match(/.json$/)) {
        file.value = null;

        return;
      }

      file.value = payload;
    };

    const removeFile = () => {
      file.value = null;
    };

    const readFile = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        jsonBackup.value = event.target.result;
        removeFile();
        importBackup();
      };

      reader.readAsText(file);
    };

    watch(
      () => file.value,
      (file) => {
        if (file) {
          readFile(file);
        }
      }
    );

    //--------

    const onChangeTabCongrolsIndex = (ndx) => {
      activeTabControlsIndex.value = ndx;
    };

    const membersList = computed(() => store.getters['salary/members']);

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    const addresses = computed(() =>
      wallets.value
        .filter(
          (w) =>
            w?.net === 'bsc' &&
            [
              WALLET_TYPES.ONE_SEED,
              WALLET_TYPES.PRIVATE_KEY,
              WALLET_TYPES.LEDGER,
            ].includes(w?.type)
        )
        .map((w) => ({
          id: w.address,
          title: w.address,
          icon: 'bsc',
        }))
    );

    const networksList = computed(() => {
      const tokens = store.getters['networks/networksList']?.find(
        (item) => item.net === 'bsc'
      )?.tokens;
      return Object.keys(tokens || {}).map((key) => {
        return tokens[key];
      });
    });

    const tokens = computed(() => {
      return networksList.value?.map((token) => {
        return {
          id: token.net,
          title: `${token.name} (${token.code})`,
          net: token.net,
          symbol: token.code,
          contract: token.address,
        };
      });
    });

    const prepareTransfer = async () => {
      isLoadingPrepare.value = true;
      rawsTxs.value = await Promise.all(
        selectedMembers.value.map(async (member) => {
          const { data } = await signerWallet.value.prepareTransfer({
            walletId: signerWallet.value.id,
            options: {
              net: tokenContract.value.net,
              toAddress: member.address,
              amount: (member.amount / rateUsd.value).toFixed(4),
            },
          });
          return { ...data, name: member.name };
        })
      );
      isLoadingPrepare.value = false;
      const result = rawsTxs.value.every((res) => res.transaction);
      if (result) {
        showPrepareModal.value = true;
      }

      let counter = 0;
      rawsTxs.value = rawsTxs.value.map((raw) => {
        return {
          mem_tx_id: raw.mem_tx_id,
          name: raw.name,
          transaction: {
            ...raw.transaction,
            nonce: raw.transaction.nonce + counter++,
          },
        };
      });
    };

    const selectAddress = async (address) => {
      mainBalance.value = '';
      if (address) {
        signerWallet.value = wallets.value.find(
          (w) =>
            w.address.toLowerCase() === address.toLowerCase() && w.net === 'bsc'
        );

        if (!signerWallet.value || !tokenContract.value) return;
        const { data } = await citadel.getBalanceById(
          signerWallet.value.id,
          tokenContract.value.net
        );
        mainBalance.value = data.mainBalance;
      }
    };

    const selectToken = async (title) => {
      mainBalance.value = '';
      searchToken.value = title;
      tokenContract.value = tokens.value.find((token) => token.title === title);

      if (!signerWallet.value || !tokenContract.value) return;
      const { data } = await citadel.getBalanceById(
        signerWallet.value.id,
        tokenContract.value.net
      );
      mainBalance.value = data.mainBalance;
    };

    // MEMBERS

    const closeMemberModal = () => {
      showMemberModal.value = false;

      if (memberToEdit.value) {
        clearData();
      }
    };

    const confirmMember = () => {
      if (!memberName.value.trim().length) {
        notify({
          type: 'warning',
          text: 'Empty member name',
        });
        return;
      }

      if (
        !memberToEdit.value &&
        membersList.value.find(
          (member) =>
            member.name.toLowerCase() === memberName.value.toLowerCase()
        )
      ) {
        notify({
          type: 'warning',
          text: 'This name is already on the list',
        });
        return;
      }

      if (!memberAmount.value) {
        notify({
          type: 'warning',
          text: 'Empty amount',
        });
        return;
      }

      if (!/^(0x){1}[0-9a-fA-F]{40}$/i.test(memberAddress.value)) {
        notify({
          type: 'warning',
          text: 'Invalid BSC address',
        });
        return;
      }

      if (memberToEdit.value) {
        store.dispatch('salary/updateMember', {
          name: memberName.value,
          amount: memberAmount.value,
          address: memberAddress.value,
        });
        showMemberModal.value = false;
        clearData();
        return;
      }

      store.dispatch('salary/addMember', {
        name: memberName.value,
        amount: memberAmount.value,
        address: memberAddress.value,
      });
      showMemberModal.value = false;
      clearData();
    };

    const clearData = () => {
      memberName.value = '';
      memberAmount.value = '';
      memberAddress.value = '';
      memberToEdit.value = null;
    };

    const onUpdateFormData = ({ name, amount, address }) => {
      memberName.value = name;
      memberAmount.value = amount;
      memberAddress.value = address;
    };

    const onEditMember = (member) => {
      const active = !!selectedMembers.value.find(
        (select) => select.name === member.name
      );

      if (active) {
        selectedMembers.value = selectedMembers.value.filter(
          (select) => select.name !== member.name
        );
        return;
      }

      memberToEdit.value = member;
      showMemberModal.value = true;
    };

    const onDeleteMember = () => {
      store.dispatch('salary/removeMember', memberToEdit.value?.name);
      showMemberModal.value = false;
      clearData();
    };

    const copyBackup = () => {
      // copyToClipboard(JSON.stringify(membersList.value));
      downLoadSalary(JSON.stringify(membersList.value), 'list-');
      notify({
        type: 'success',
        text: 'File with members list downloaded',
      });
    };

    const closeBackupModal = () => {
      showBackupModal.value = false;
      jsonBackup.value = '';
    };

    const importBackup = () => {
      try {
        const membersListNew = JSON.parse(jsonBackup.value);

        if (
          membersListNew &&
          membersListNew.length &&
          membersListNew[0].address &&
          !(membersListNew[0].salary || membersListNew[0].sum)
        ) {
          store.dispatch('salary/setMembersList', membersListNew);
          selectedMembers.value = [];
          closeBackupModal();
        } else {
          notify({
            type: 'warning',
            text: 'Incorrect list format',
          });
        }
      } catch (err) {
        notify({
          type: 'warning',
          text: 'Incorrect list format',
        });
      }
    };

    const downLoadSalary = (info, prefix) => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const h = date.getHours();
      const m = date.getMinutes();
      const filename = `${prefix}${year}-${month}-${day}-${h}-${m}`;
      const blob = new Blob([info], {
        type: 'text/plain;charset=utf-8',
      });
      FileSaver.saveAs(blob, `${filename}.json`);
    };

    // send
    const successTxs = ref({});

    const closePrepareModal = () => {
      showPrepareModal.value = false;
      confirmPassword.value = false;
      signLoading.value = false;
      rawsTxs.value = [];
      successTxs.value = {};
      password.value = '';
    };

    const signAndSendCb = (data, name) => {
      successTxs.value[name] = data[0];
    };

    const signAndSend = async (cb) => {
      confirmPassword.value = true;
      if (
        incorrectPassword.value &&
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
          signerWallet.value.type
        )
      )
        return;

      signLoading.value = true;

      if (signerWallet.value.type === WALLET_TYPES.LEDGER) {
        for (const rawTx of rawsTxs.value) {
          const { data } = await signerWallet.value.signAndSendTransfer({
            walletId: signerWallet.value.id,
            rawTransaction: rawTx,
            privateKey:
              password.value &&
              signerWallet.value.getPrivateKeyDecoded(password.value),
            derivationPath: signerWallet.value.derivationPath,
          });

          cb(data, rawTx.name);
        }
      } else {
        await Promise.all(
          rawsTxs.value.map(async (rawTx) => {
            const { data } = await signerWallet.value.signAndSendTransfer({
              walletId: signerWallet.value.id,
              rawTransaction: rawTx,
              privateKey:
                password.value &&
                signerWallet.value.getPrivateKeyDecoded(password.value),
              derivationPath: signerWallet.value.derivationPath,
            });

            cb(data, rawTx.name);
            return data;
          })
        );
      }
      signLoading.value = false;

      const backupData = [];
      selectedMembers.value.forEach((member) => {
        backupData.push({
          ...member,
          amount: `${member.amount}`,
          rate: `${rateUsd.value}`,
          sum: `${(member.amount / rateUsd.value).toFixed(4)} ${
            tokenContract.value?.symbol
          }`,
          tx: `https://bscscan.com/tx/${successTxs.value[member.name]}`,
        });
      });
      downLoadSalary(JSON.stringify(backupData), 'salary-');
    };

    return {
      TABS_CONTROLS,
      password,
      incorrectPassword,
      confirmPassword,

      mainBalance,

      showMemberModal,
      showBackupModal,
      isLoadingPrepare,
      signLoading,
      rateUsd,

      addresses,
      tokens,

      searchAddress,
      searchToken,

      selectAddress,
      selectToken,

      prepareTransfer,
      tokenContract,

      closeMemberModal,
      closeBackupModal,

      confirmMember,
      membersList,
      memberToEdit,

      onUpdateFormData,
      onEditMember,
      onDeleteMember,

      selectedMembers,
      copyBackup,
      jsonBackup,
      importBackup,

      showPrepareModal,
      closePrepareModal,
      signAndSend,
      signAndSendCb,
      successTxs,

      WALLET_TYPES,
      signerWallet,

      activeTabControlsIndex,
      onChangeTabCongrolsIndex,

      handleFileInput,
      file,
    };
  },
};
</script>
<style lang="scss" scoped>
.salary-page {
  width: 100%;
  margin: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  position: relative;

  &__controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    cursor: pointer;
  }

  &__controls-contract {
    margin-top: 14px;
    font-size: 14px;

    a {
      text-decoration: none;
      color: $mid-blue;
      border-bottom: 1px dashed $mid-blue;
      cursor: pointer;
    }
  }

  &__controls-counter {
    color: $black;
    font-weight: 800;
    margin-bottom: 10px;
  }

  &__controls-deselectall {
    margin-top: 10px;
    color: $red;
    border-bottom: 1px solid $red;
  }

  &__main {
    width: 80%;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    margin: 0 10px;
    flex-direction: column;
    flex: 1;
    background: $white;
    box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
    border-radius: 50px;

    &.p15 {
      width: 100%;
      padding: 30px 15px;
    }

    @include lg {
      border-radius: 25px;
    }
    @include md {
      box-shadow: 0px 0px 25px rgba(106, 75, 255, 0.3);
      border-radius: 25px;
    }
  }

  &__transactions {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 20px 0 0 0;
    max-height: 200px;
    overflow-y: auto;

    .item {
      width: 110px;
      margin: 10px 0;
    }

    .name {
      font-size: 13px;
      color: #888;
    }

    .amount {
      font-size: 12px;
      color: $mid-blue;
      border-bottom: 1px dashed transparent;
    }

    .link {
      font-size: 12px;
      color: #26861e;
      text-decoration: none;
      border-bottom: 1px dashed #26861e;
    }
  }

  .line {
    border-top: 1px solid #bcc2d8;
    height: 1px;
    margin-top: 10px;
    width: 100%;
  }

  .empty-icon {
    margin: auto;
    transform: scale(1.4);
    opacity: 0.4;
  }

  .salary-members-wrap {
    height: calc(100% - 80px);
    max-height: 520px;
    overflow: auto;
  }

  .salary-members {
    padding-top: 3px;
  }

  .field {
    width: 100%;
    height: 68px;
    margin-top: 15px;
  }

  .btns {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 40px;
    width: calc(50% - 60px);
  }

  .btn {
    display: flex;
    justify-content: center;
    margin: 0 5px;
  }

  .btn-next {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 40px;
    width: calc(50% - 60px);
  }

  .textarea-wrap {
    width: 100%;
    height: 120px;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .salary-import-list {
    margin-top: 20px;
    position: relative;

    .upload-btn {
      margin-left: 15px;
    }

    .upload-input {
      width: 160px;
      height: 58px;
      position: absolute;
      right: 0;
      top: 0;
      opacity: 0;
      z-index: 10;
      cursor: pointer;
    }
  }

  .autocomplete {
    width: 100%;
    height: 68px;
    position: relative;
    margin-top: 10px;

    &.z1 {
      z-index: 10;
    }
  }
}
</style>

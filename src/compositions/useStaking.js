/* eslint-disable */
import { computed, provide, ref } from 'vue';
import useCheckPassword from '@/compositions/useCheckPassword';
import { useI18n } from 'vue-i18n';
import useWallets from '@/compositions/useWallets';
import { OUR_NODE } from '@/config/walletType';
import BigNumber from 'bignumber.js';
import { useStore } from 'vuex';

export default function useStaking(stakeNodes, list) {
  const { t } = useI18n();
  const { currentWallet } = useWallets();
  const currentToken = computed(() => store.getters['subtokens/currentToken']);
  const isMultiple = computed(() => currentWallet.value.net === 'polkadot');
  provide('isMultiple', isMultiple)
  const isLoading = ref(false);
  const showModal = ref(false);
  const store = useStore();
  const updateShowModal = (value) => {
    showModal.value = value;
  };

  const isWithoutDelegation = ref(false)
  provide('isWithoutDelegation', isWithoutDelegation)
  const updateIsWithoutDelegation = (value)=> {
    isWithoutDelegation.value = value
  }
  provide('updateIsWithoutDelegation', updateIsWithoutDelegation)

  const canStake = computed(()=> currentToken.value ? currentToken.value.tokenBalance.mainBalance > 0 && currentWallet.value.balance.mainBalance > 0
  : currentWallet.value.balance.mainBalance > 0 )
  provide('canStake', canStake);

  const mode = ref('stake');
  provide('mode', mode);

  provide('showModal', showModal);
  provide('updateShowModal', updateShowModal);

  const modalCloseHandler = () => {
    updateShowModal(false);
    updateSelectedNode('');
    updateRewardDestinationAddress('');
    updateRewardDestinationOption(0);
    updateSelectedNodeForRedelegation('');
    updateRedelegationDirection('');
    updateIsWithoutDelegation(false)
    updateShowChooseNode(false);
    updateShowNodesList(false);
    updateShowConfirmTransaction(false);
    updateShowSuccessModal(false);
    updateAmount('');
    updateAdditionalFee('');
    activeTab.value = 'stake';
    mode.value = 'stake';
    updatePassword("");
    inputError.value = false;
    updateEditMode(false);
    resMaxAmount.value = '';
  };
  const nodesListModalCloseHandler = () => {
    if (activeTab.value === 'redelegate' || mode.value === 'redelegate') {
      updateShowNodesList(false);
      updateShowChooseNode(true);
    } else {
      modalCloseHandler();
    }
  };

  const rewardDestinationAddress = ref('');
  const updateRewardDestinationAddress = (value) => {
    rewardDestinationAddress.value = value
  }
  provide('updateRewardDestinationAddress', updateRewardDestinationAddress)

  const rewardDestinationOption = ref(0);
  const updateRewardDestinationOption = (value) => {
    rewardDestinationOption.value = value
  }
  provide('updateRewardDestinationOption', updateRewardDestinationOption)

  const additionalFee = ref('');
  const updateAdditionalFee = (value) => {
    additionalFee.value = value
  };
  provide('updateAdditionalFee', updateAdditionalFee);

  const amount = ref('');
  const updateAmount = (value) => {
    amount.value = value;
  };
  provide('updateAmount', updateAmount);

  const fee = ref();
  const adding = ref();
  const resMaxAmount = ref('');
  provide('resMaxAmount', resMaxAmount);
  const resEnough = ref();
  provide('enough', resEnough);

  const currentKtAddress = computed(() => store.getters['ktAddresses/currentKtAddress']);
  const getDelegationFee = async (txType, validatorAddr, validatorSrcAddr = '') => {
    isLoading.value = true;

    //if there is multiple validators
    const srcNodeAddress = Array.isArray(validatorSrcAddr) ? validatorSrcAddr[0].address : validatorSrcAddr?.address
    const destNodeAddress = Array.isArray(validatorAddr) ? validatorAddr[0].address : validatorAddr?.address
    const { ok, resFee, maxAmount, resAdding, enough } = await currentWallet.value.getDelegationFee({
      walletId: currentWallet.value.id,
      transactionType: txType,
      nodeAddress: isWithoutDelegation.value ? null : destNodeAddress,
      sourceNodeAddress: srcNodeAddress,
      kt: currentKtAddress.value ? currentKtAddress.value.address : undefined,
      isWithoutDelegation: isWithoutDelegation.value
    });
    if (ok) {
      fee.value = resFee;
      adding.value = resAdding;
      resMaxAmount.value = maxAmount;
      resEnough.value = enough;
      if (!enough) {
        !(editMode.value || isMultiple.value) && modalCloseHandler();
      }
    } else {
      modalCloseHandler();
    }
    isLoading.value = false;
  };
  provide('getDelegationFee', getDelegationFee);
  const selectedNode = ref();
  const updateSelectedNode = async (value) => {
    amount.value = '';
    selectedNode.value = value;
    if ((activeTab.value === 'redelegate' || mode.value === 'redelegate') && value && selectedNodeForRedelegation.value) {
      await getDelegationFee('redelegate', selectedNodeForRedelegation.value, value);
    } else if (!(activeTab.value === 'redelegate' || mode.value === 'redelegate') && value) {
      await getDelegationFee(mode.value, value);
    }
  };
  provide('selectedNode', selectedNode);
  provide('updateSelectedNode', updateSelectedNode);

  const selectedNodeForRedelegation = ref();
  const updateSelectedNodeForRedelegation = async (value) => {
    selectedNodeForRedelegation.value = value;
    if (value && selectedNode.value) {
      await getDelegationFee('redelegate', selectedNodeForRedelegation.value, selectedNode.value);
    }
  };
  provide('selectedNodeForRedelegation', selectedNodeForRedelegation);
  provide('updateSelectedNodeForRedelegation', updateSelectedNodeForRedelegation);

  const redelegationDirection = ref();
  const updateRedelegationDirection = (value) => {
    redelegationDirection.value = value;
  };
  provide('redelegationDirection', redelegationDirection);
  provide('updateRedelegationDirection', updateRedelegationDirection);

  const editMode = ref(false);
  const updateEditMode = (value) => {
    editMode.value = value;
  };
  provide('editMode', editMode);
  provide('updateEditMode', updateEditMode);

  const showChooseNode = ref(false);
  const updateShowChooseNode = (value) => {
    showChooseNode.value = value;
  };
  provide('showChooseNode', showChooseNode);
  provide('updateShowChooseNode', updateShowChooseNode);

  const showNodesList = ref(false);
  const updateShowNodesList = (value) => {
    showNodesList.value = value;
  };
  provide('showNodesList', showNodesList);
  provide('updateShowNodesList', updateShowNodesList);

  const showConfirmTransaction = ref(false);
  const updateShowConfirmTransaction = (value) => {
    showConfirmTransaction.value = value;
  };
  provide('showConfirmTransaction', showConfirmTransaction);
  provide('updateShowConfirmTransaction', updateShowConfirmTransaction);

  const showSuccessModal = ref(false);
  const updateShowSuccessModal = (value) => {
    showSuccessModal.value = value;
  };
  const toStake = async () => {
    if (isMultiple.value && list.length) {
      await getDelegationFee('stake', list);
    }
    if (initialStakingNode) {
      await updateSelectedNode(initialStakingNode.value);
    }
    updateShowModal(true);
    updateShowChooseNode(true);
  };

  const initialStakingNode = computed(() => {
    return stakeNodes.find(n => n.name === OUR_NODE);
  });

  const toUnstake = async () => {
    activeTab.value = 'unstake';
    mode.value = 'unstake';
    updateShowModal(true);

    if (currentWallet.value.net === 'polkadot') {
      await updateSelectedNode(list)
      updateShowChooseNode(true);

      return;
    }
    updateShowNodesList(true);
  };
  const initialSelectedNodeRedelegateFrom = computed(() => {
    if (isMultiple.value) {
      return list
    }
    const filteredList = list.filter(({ name }) => name !== OUR_NODE);
    if (filteredList.length > 0) {
      return filteredList[0];
    }

    return list[0];

  });
  const toRedelegate = async () => {
    activeTab.value = 'redelegate';
    mode.value = 'redelegate';
    await updateSelectedNode(initialSelectedNodeRedelegateFrom.value);
    updateShowModal(true);
    updateShowChooseNode(true);
  };
  const toggleShowPlaceholder = () => {
    updateShowModal(true);
    updateShowChooseNode(true);
  };
  const activeTab = ref('stake');
  provide('activeTab', activeTab);

  const { password, passwordIncorrect, passwordError, inputError } = useCheckPassword();
  const updatePassword = (value) => {
    password.value = value;
  };
  provide('password', password);
  provide('updatePassword', updatePassword);
  provide('passwordError', passwordError);
  provide('inputError', inputError);

  const stakeNodesWithValue = computed(() => {
    const data = stakeNodes.map((item) => {
      const stakedNode = list.find((i) => {
        return i.address?.toLowerCase() === item.address?.toLowerCase();
      });
      if (stakedNode) {
        return stakedNode;
      }

      return item;

    });

    return data;
  });

  const maxAmount = computed(() => {
    let max = resMaxAmount.value || currentWallet.value.balance.mainBalance;

    if (max > 0) {
      return max;
    } else {
      return 0;
    }
  }
  );
  provide('maxAmount', maxAmount);

  const maxAdditionalFee = computed(() => {
    if (mode.value === 'stake') {
      return BigNumber(Number(maxAmount.value)).minus(Number(amount.value)).toNumber()
    } else {
      return BigNumber(Number(currentWallet.value.balance.mainBalance)).minus(Number(fee.value)).toNumber()
    }

  })
  provide('maxAdditionalFee', maxAdditionalFee)

  const insufficientFunds = computed(
    () =>
      !!amount.value && +amount.value > +maxAmount.value && t('insufficientFunds'),
  );
  provide('insufficientFunds', insufficientFunds);

  const insufficientAdditionalFee = computed(
    () => {
      return !!additionalFee.value && +additionalFee.value > maxAdditionalFee.value && t('insufficientFunds')
    }
  )
  provide('insufficientAdditionalFee', insufficientAdditionalFee)

  const disabled = computed(() => {
    if (((activeTab.value === 'redelegate' || mode.value === 'redelegate') && (!selectedNode.value || !selectedNodeForRedelegation.value))
      || (!isWithoutDelegation.value && !selectedNode.value) || insufficientFunds.value || amount.value <= 0 || !resEnough.value || insufficientAdditionalFee.value) {
      return true;
    }

    return false;

  });
  const disabledPolkadot = computed(() => {
    if (((activeTab.value === 'redelegate' || mode.value === 'redelegate') && (!selectedNode.value || !selectedNodeForRedelegation.value))
      || (!selectedNode.value && !list.length) || insufficientFunds.value || amount.value <= 0 || !resEnough.value || insufficientAdditionalFee.value) {
      return true;
    }

    return false;

  });
  const showWarningModal = ref(false);
  const finalClose = () => {
    updateShowModal(false);
    updateSelectedNode('');
    updateSelectedNodeForRedelegation('');
    updateIsWithoutDelegation(false)
    updateRedelegationDirection('');
    updateShowChooseNode(false);
    updateShowNodesList(false);
    updateShowConfirmTransaction(false);
    updateShowSuccessModal(false);
    updateAmount('');
    updateAdditionalFee('');
    showWarningModal.value = false;
    activeTab.value = 'stake';
    mode.value = 'stake';
    updatePassword("");
    inputError.value = false;
    updateEditMode(false);
    resMaxAmount.value = '';
  };

  const nodesListModalData = computed(() => {
    if (mode.value === 'redelegate' || activeTab.value === 'redelegate') {
      return {
        title: t('redelegation.chooseNodeTitle'),
        desc: t('redelegation.redelegationDesc'),
        list: isMultiple.value ? stakeNodesWithValue.value.filter(n => n.isActive)
          : redelegationDirection.value === 'to'
            ? stakeNodesWithValue.value
              .filter(({ address }) => address.toLowerCase() !== selectedNode?.value?.address?.toLowerCase())
            : redelegationDirection.value === 'from'
              ? list.filter(({ address }) => address.toLowerCase() !== selectedNodeForRedelegation?.value?.address?.toLowerCase())
              : list,
      };
    } else if (mode.value === 'stake') {
      return {
        title: t('staking.chooseNodeForStaking'),
        desc: currentWallet.value.unstakePerioudFrom ?
          `${t('staking.chooseNodeModalDescWithFrom', {
            net: currentWallet.value.name,
            perioudFrom: currentWallet.value.unstakePerioudFrom,
            perioudTo: currentWallet.value.unstakePerioudTo,
            link: currentWallet.value.unstakePerioudLink,
          })}`
          : `${t('staking.chooseNodeModalDesc1', {
            net: currentWallet.value.name,
            perioud: currentWallet.value.unstakeingPerioud,
          })}`,
        list: stakeNodesWithValue.value.filter(n => n.isActive),
      };

    } else if (mode.value === 'unstake') {
      return {
        title: t('unstaking.chooseNodeForUnstaking'),
        desc: currentWallet.value.unstakePerioudFrom ?
          `${t(currentWallet.value.messages.unstakeingPrefix ? currentWallet.value.messages.unstakeingPrefix : 'unstaking.defaultPrefix')} ${t('unstaking.chooseNodeModalDescWithFrom', {
            net: currentWallet.value.name,
            perioudFrom: currentWallet.value.unstakePerioudFrom,
            perioudTo: currentWallet.value.unstakePerioudTo,
            link: currentWallet.value.unstakePerioudLink,
          })}`
          : `${t(currentWallet.value.messages.unstakeingPrefix ? currentWallet.value.messages.unstakeingPrefix : 'unstaking.defaultPrefix')} ${t('unstaking.chooseNodeModalDesc', {
            net: currentWallet.value.name,
            perioud: currentWallet.value.unstakeingPerioud,
          })}`,
        list: list,
      };
    }
  });

  const chooseNodeModalData = computed(() => {
    if (currentWallet.value.net === 'polkadot') {
      if (mode.value === 'stake') {
        return {
          title: 'manageStaking',
          button: "staking.Stake",
          desc: `${t('polkadot.chooseNodeModalDesc', { net: currentWallet.value.name, perioud: currentWallet.value.unstakeingPerioud, maxNodes: currentWallet.value.maxNodes, minStakingAmount: currentWallet.value.minStakingAmount, code: currentWallet.value.code, })}`
        }
      } else if (mode.value === 'unstake') {
        return {
          title: 'manageStaking',
          button: "unstake",
          desc: `${t('polkadot.chooseNodeModalDesc', { net: currentWallet.value.name, perioud: currentWallet.value.unstakeingPerioud, maxNodes: currentWallet.value.maxNodes, minStakingAmount: currentWallet.value.minStakingAmount, code: currentWallet.value.code, })}`
        }
      }
      else if (mode.value === 'redelegate') {
        return {
          title: 'manageStaking',
          button: "redelegation.redelegate",
          desc: `${t('polkadot.chooseNodeModalDesc', { net: currentWallet.value.name, perioud: currentWallet.value.unstakeingPerioud, maxNodes: currentWallet.value.maxNodes, minStakingAmount: currentWallet.value.minStakingAmount, code: currentWallet.value.code, })}`
        }
      }
    }
    if (editMode.value) {
      return {
        title: 'staking.editNode',
        button: mode.value === 'redelegate' || activeTab.value === 'redelegate' ? 'confirm'
          : mode.value === 'unstake' || activeTab.value === 'unstake' ? 'unstaking.unstake'
            : 'staking.Stake',
        desc: activeTab.value === 'redelegate' ?
          `${t(currentWallet.value.messages.unstakeingPrefix ? currentWallet.value.messages.unstakeingPrefix : 'unstaking.defaultPrefix')} ${t('unstaking.chooseNodeModalDesc', {
            net: currentWallet.value.name,
            perioud: currentWallet.value.unstakeingPerioud,
          })}`
          : currentWallet.value.unstakePerioudFrom ?
            `${t('staking.editModeDescWithFrom', {
              net: currentWallet.value.name,
              perioudFrom: currentWallet.value.unstakePerioudFrom,
              perioudTo: currentWallet.value.unstakePerioudTo,
              link: currentWallet.value.unstakePerioudLink,
            })}`
            : `${t('staking.editModeDesc', {
              net: currentWallet.value.name,
              perioud: currentWallet.value.unstakeingPerioud,
            })}`,
      };
    }
    if (mode.value === 'unstake' || activeTab.value === 'unstake') {
      return {
        title: 'unstaking.unstake',
        button: 'unstaking.unstake',
        desc: currentWallet.value.unstakePerioudFrom ?
          `${t(currentWallet.value.messages.unstakeingPrefix ? currentWallet.value.messages.unstakeingPrefix : 'unstaking.defaultPrefix')} ${t('unstaking.chooseNodeModalDescWithFrom', {
            net: currentWallet.value.name,
            perioudFrom: currentWallet.value.unstakePerioudFrom,
            perioudTo: currentWallet.value.unstakePerioudTo,
            link: currentWallet.value.unstakePerioudLink,
          })}`
          : `${t(currentWallet.value.messages.unstakeingPrefix ? currentWallet.value.messages.unstakeingPrefix : 'unstaking.defaultPrefix')} ${t('unstaking.chooseNodeModalDesc', {
            net: currentWallet.value.name,
            perioud: currentWallet.value.unstakeingPerioud,
          })}`,
      };
    }
    if (mode.value === 'stake' || activeTab.value === 'stake') {
      return {
        title: 'staking.Stake',
        button: 'staking.Stake',
        desc: currentWallet.value.unstakePerioudFrom ?
          `${t('staking.chooseNodeModalDescWithFrom', {
            net: currentWallet.value.name,
            perioudFrom: currentWallet.value.unstakePerioudFrom,
            perioudTo: currentWallet.value.unstakePerioudTo,
            link: currentWallet.value.unstakePerioudLink,
          })}`
          : `${t('staking.chooseNodeModalDesc1', {
            net: currentWallet.value.name,
            perioud: currentWallet.value.unstakeingPerioud,
          })}`,
      };
    }
    if (mode.value === 'redelegate') {
      return {
        title: 'redelegation.redelegate',
        button: 'confirm',
        desc: t('redelegation.redelegationDesc'),
      };
    }
  });

  const actionModalData = computed(() => {
    if (mode.value === 'unstake' || activeTab.value === 'unstake') {
      return {
        title: t('unstaking.actionModalTitle'),
        desc: t('unstaking.actionModalDesc'),
      };
    } else if (mode.value === 'redelegate' || activeTab.value === 'redelegate') {
      return {
        title: t('singleStake.actionModalTitle'),
        desc: t('singleStake.actionModalDesc'),
      };
    }

    return {
      title: t('staking.actionModalTitle'),
      desc: t('staking.actionModalDesc'),
    };

  });

  return {
    getDelegationFee,
    nodesListModalData,
    chooseNodeModalData,
    actionModalData,
    mode,
    showModal,
    modalCloseHandler,
    amount,
    additionalFee,
    rewardDestinationAddress,
    rewardDestinationOption,
    selectedNode,
    showChooseNode,
    showNodesList,
    showConfirmTransaction,
    toStake,
    toggleShowPlaceholder,
    activeTab,
    updateShowChooseNode,
    updateShowConfirmTransaction,
    updateShowSuccessModal,
    showSuccessModal,
    password,
    passwordIncorrect,
    stakeNodesWithValue,
    disabled,
    finalClose,
    showWarningModal,
    updateShowNodesList,
    updateSelectedNode,
    updateShowModal,
    inputError,
    passwordError,
    isLoading,
    fee,
    adding,
    toUnstake,
    toRedelegate,
    selectedNodeForRedelegation,
    nodesListModalCloseHandler,
    isMultiple,
    resMaxAmount,
    updateAmount,
    disabledPolkadot,
    isWithoutDelegation
  };
}

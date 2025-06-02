import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';
import { getTimeForClaim } from '@/helpers/stacks';

const types = {
  ADD_STAKE_INFO: 'ADD_STAKE_INFO',
  SHOW_CLAIM_MODAL: 'SHOW_CLAIM_MODAL',
  SET_CYCLE_END_TIME: 'SET_CYCLE_END_TIME',
  SHOW_CLAIM_SBTC_MODAL: 'SHOW_CLAIM_SBTC_MODAL',
};

export default {
  namespaced: true,
  state: () => ({
    stakeInfo: null,
    showClaimModal: false,
    showClaimSBTCModal: false,
    cycleEndTime: '',
  }),

  getters: {
    stakeInfo: (state) => state.stakeInfo,
    showClaimModal: (state) => state.showClaimModal,
    showClaimSBTCModal: (state) => state.showClaimSBTCModal,
    cycleEndTime: (state) => state.cycleEndTime,
  },

  mutations: {
    [types.SHOW_CLAIM_SBTC_MODAL](state, value) {
      state.showClaimSBTCModal = value;
    },
    [types.SET_CYCLE_END_TIME](state, value) {
      state.cycleEndTime = value;
    },
    [types.ADD_STAKE_INFO](state, value) {
      state.stakeInfo = value;
    },
    [types.SHOW_CLAIM_MODAL](state, value) {
      state.showClaimModal = value;
    },
  },

  actions: {
    setCycleEndTime({ commit }, value) {
      commit(types.SET_CYCLE_END_TIME, value);
    },
    addStakeInfo({ commit }, value) {
      commit(types.ADD_STAKE_INFO, value);
    },
    showClaimModal({ commit }, value) {
      commit(types.SHOW_CLAIM_MODAL, value);
    },
    showClaimSBTCModal({ commit }, value) {
      commit(types.SHOW_CLAIM_SBTC_MODAL, value);
      console.log('showClaimSBTCModal', value);
    },
    async getStakingInfo({ commit }, currentWallet) {
      const key = 'ststx-withdraw-nft';
      const keyBtc = 'ststxbtc-withdraw-nft';
      const info = await citadel.stacksStaking(currentWallet.id, {
        address: currentWallet.address,
        publicKey: currentWallet.publicKey,
      });
      console.log('info', info);
      const stakingInfo = info.data || null;
      if (!stakingInfo) {
        commit(types.ADD_STAKE_INFO, null);
        notify({
          type: 'warning',
          text: info.error,
        });
        return;
      }

      stakingInfo.nfts =
        stakingInfo?.[key] && stakingInfo?.[key]?.length
          ? stakingInfo?.[key]
          : [];

      stakingInfo.nfts = stakingInfo.nfts.concat(
        stakingInfo?.[keyBtc].map((item) => {
          return {
            ...item,
            isBtc: true,
          };
        })
      );
      commit(types.ADD_STAKE_INFO, stakingInfo);
      if (stakingInfo?.nfts?.[0]) {
        commit(
          types.SET_CYCLE_END_TIME,
          getTimeForClaim(stakingInfo?.nfts[0], stakingInfo)
        );
      }
    },
  },
};

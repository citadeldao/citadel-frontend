import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';

const types = {
  ADD_STAKE_INFO: 'ADD_STAKE_INFO',
  SHOW_CLAIM_MODAL: 'SHOW_CLAIM_MODAL',
};

export default {
  namespaced: true,
  state: () => ({
    stakeInfo: null,
    showClaimModal: false,
  }),

  getters: {
    stakeInfo: (state) => state.stakeInfo,
    showClaimModal: (state) => state.showClaimModal,
  },

  mutations: {
    [types.ADD_STAKE_INFO](state, value) {
      state.stakeInfo = value;
    },
    [types.SHOW_CLAIM_MODAL](state, value) {
      state.showClaimModal = value;
    },
  },

  actions: {
    addStakeInfo({ commit }, value) {
      commit(types.ADD_STAKE_INFO, value);
    },
    showClaimModal({ commit }, value) {
      commit(types.SHOW_CLAIM_MODAL, value);
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
    },
  },
};

const types = {
  ADD_MEMBER: 'ADD_MEMBER',
  REMOVE_MEMBER: 'REMOVE_MEMBER',
  UPDATE_MEMBER: 'UPDATE_MEMBER',
  SET_MEMBERS_LIST: 'SET_MEMBERS_LIST',
};

export default {
  namespaced: true,
  state: () => ({
    members: [],
  }),

  getters: {
    members: (state) => state.members,
  },

  mutations: {
    [types.ADD_MEMBER](state, value) {
      state.members.push(value);
    },
    [types.REMOVE_MEMBER](state, value) {
      state.members = state.members.filter((member) => member.name !== value);
    },
    [types.UPDATE_MEMBER](state, value) {
      const oldMemberIndex = state.members.findIndex(
        (member) => member.name === value.name
      );
      state.members.splice(oldMemberIndex, 1, value);
    },
    [types.SET_MEMBERS_LIST](state, value) {
      state.members = value;
    },
  },

  actions: {
    addMember({ commit }, value) {
      commit(types.ADD_MEMBER, value);
    },
    removeMember({ commit }, value) {
      commit(types.REMOVE_MEMBER, value);
    },
    updateMember({ commit }, value) {
      commit(types.UPDATE_MEMBER, value);
    },
    setMembersList({ commit }, value) {
      commit(types.SET_MEMBERS_LIST, value);
    },
  },
};

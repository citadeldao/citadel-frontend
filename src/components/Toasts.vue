<template>
  <div
    class="toasts"
  >
    <transition-group name="slide-from-top">
      <Toast
        v-for="toast of toasts"
        :key="toast.id"
        :type="toast.type"
        :title="toast.title"
        :text="toast.text"
        :hash="toast.hash"
        @close="close(toast.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Toast from './Toast';

export default {
  name: 'Toasts',
  components: { Toast },
  setup() {
    const store = useStore();
    const toasts = computed(() => store.getters['toasts/toasts']);

    const close = (id) => {
      store.dispatch('toasts/removeToast', id);
    };

    return {
      toasts,
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
.toasts {
  position: fixed;
  left: 50%;
  top: 0;
  z-index: 99999;
  padding: 10px;
  transform: translateX(-50%);
  width: 100%;
}

</style>

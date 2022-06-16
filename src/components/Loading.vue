<template>
  <div class="lds-grid" :class="{ small, ledger }">
    <div v-for="item in 9" :key="item" />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    ledger: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.lds-grid {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  & div {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #c4c4c4;
    animation: lds-grid 1.2s linear infinite;
  }
  & div:nth-child(1) {
    top: 8px;
    left: 8px;
    animation-delay: 0s;
  }
  & div:nth-child(2) {
    top: 8px;
    left: 32px;
    animation-delay: -0.4s;
  }
  & div:nth-child(3) {
    top: 8px;
    left: 56px;
    animation-delay: -0.8s;
  }
  & div:nth-child(4) {
    top: 32px;
    left: 8px;
    animation-delay: -0.4s;
  }
  & div:nth-child(5) {
    top: 32px;
    left: 32px;
    animation-delay: -0.8s;
  }
  & div:nth-child(6) {
    top: 32px;
    left: 56px;
    animation-delay: -1.2s;
  }
  & div:nth-child(7) {
    top: 56px;
    left: 8px;
    animation-delay: -0.8s;
  }
  & div:nth-child(8) {
    top: 56px;
    left: 32px;
    animation-delay: -1.2s;
  }
  & div:nth-child(9) {
    top: 56px;
    left: 56px;
    animation-delay: -1.6s;
  }
  @keyframes lds-grid {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}

.small {
  width: 56px;
  height: 56px;

  & div {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c4c4c4;
    animation: lds-grid 1.2s linear infinite;
  }
  & div:nth-child(1) {
    top: 8px;
    left: 8px;
  }
  & div:nth-child(2) {
    top: 8px;
    left: 24px;
  }
  & div:nth-child(3) {
    top: 8px;
    left: 40px;
  }
  & div:nth-child(4) {
    top: 24px;
    left: 8px;
  }
  & div:nth-child(5) {
    top: 24px;
    left: 24px;
  }
  & div:nth-child(6) {
    top: 24px;
    left: 40px;
  }
  & div:nth-child(7) {
    top: 40px;
    left: 8px;
  }
  & div:nth-child(8) {
    top: 40px;
    left: 24px;
    animation-delay: -1.2s;
  }
  & div:nth-child(9) {
    top: 40px;
    left: 40px;
    animation-delay: -1.6s;
  }
}
.ledger {
  width: 12px;
  height: 12px;
  display: flex;
  & div {
    width: 3px;
    height: 3px;
    background: $dark-blue;
  }
  & div:nth-child(1) {
    top: 0px;
    left: 0px;
  }
  & div:nth-child(2) {
    top: 0px;
    left: 4px;
  }
  & div:nth-child(3) {
    top: 0px;
    left: 8px;
  }
  & div:nth-child(4) {
    top: 4px;
    left: 0px;
  }
  & div:nth-child(5) {
    top: 4px;
    left: 4px;
  }
  & div:nth-child(6) {
    top: 4px;
    left: 8px;
  }
  & div:nth-child(7) {
    top: 8px;
    left: 0px;
  }
  & div:nth-child(8) {
    top: 8px;
    left: 4px;
  }
  & div:nth-child(9) {
    top: 8px;
    left: 8px;
  }
}
</style>

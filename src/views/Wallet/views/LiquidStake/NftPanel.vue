<template>
  <div class="nft-panel">
    <div class="nft-panel__id">#{{ nft.id }}</div>
    <div class="nft-panel__item">
      <div class="label">STX</div>
      <div class="line" />
      <div class="value">{{ nft.STX }}</div>
    </div>
    <div class="nft-panel__item">
      <div class="label">stSTX</div>
      <div class="line" />
      <div class="value">{{ nft.stSTX }}</div>
    </div>
    <div class="nft-panel__unlock">
      <div class="nft-panel__item">
        <div class="label">Current height</div>
        <div class="line" />
        <div class="value">{{ currentHeight }}</div>
      </div>
      <div class="nft-panel__progress">
        <div class="progress" :style="{ width: `${percent}%` }" />
      </div>
      <div class="nft-panel__item">
        <div class="label">Start unlock {{ nft.startUnlock }}</div>
        <div class="line" />
        <div class="value">End unlock {{ nft.endUnlock }}</div>
      </div>
    </div>
    <div class="nft-panel__btns">
      <el-button
        type="success"
        :disabled="currentHeight < nft.endUnlock"
        :loading="loadingDelayed"
        class="btn"
        @click="$emit('delayed', nft)"
        >CLAIM</el-button
      >
      <!-- <el-button
        type="success"
        :loading="loadingInstant"
        class="btn"
        @click="$emit('instant', nft)"
        >INSTANT</el-button
      > -->
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    nft: {
      required: true,
    },
    loadingDelayed: {
      type: Boolean,
      default: false,
    },
    loadingInstant: {
      type: Boolean,
      default: false,
    },
    currentHeight: {
      required: true,
    },
  },
  setup(props) {
    const calculateProgress = (currentHeight, startUnlock, endUnlock) => {
      // Если текущий блок меньше блока начала разблокировки – прогресс 0%
      if (currentHeight <= startUnlock) {
        return 0;
      }
      // Если текущий блок больше блока завершения разблокировки – прогресс 100%
      if (currentHeight >= endUnlock) {
        return 100;
      }
      // Вычисление процента заполнения в диапазоне между startUnlock и endUnlock
      const progress =
        ((currentHeight - startUnlock) / (endUnlock - startUnlock)) * 100;
      return progress;
    };
    const percent = computed(() => {
      const nft = props.nft;
      return calculateProgress(
        props.currentHeight,
        nft.startUnlock,
        nft.endUnlock
      );
    });

    return {
      percent,
    };
  },
};
</script>
<style lang="scss" scoped>
.nft-panel {
  display: flex;
  flex-direction: column;
  width: 358px;
  min-height: 200px;
  background-color: #f0f3fd;
  padding: 20px;
  border-radius: 12px;

  &__unlock {
    padding: 10px;
    border-radius: 12px;
    background: #ffffff;
    margin-bottom: 15px;
    margin-top: 5px;
  }

  &__progress {
    margin: 5px 0 15px 0;
    height: 25px;
    border-radius: 8px;
    width: 100%;
    background-color: #d3d7e3ab;
    position: relative;
    overflow: hidden;

    .progress {
      position: absolute;
      left: 0;
      top: 0;
      height: 25px;
      background-color: $dark-blue;
    }
  }

  &__btns {
    display: flex;
    align-items: center;

    .btn {
      width: 100%;
    }
  }

  &__item {
    display: flex;
    margin-bottom: 10px;

    .label {
      font-size: 14px;
      line-height: 19px;
      color: #6b93c0;
      font-family: 'Panton_Bold';
    }

    .value {
      color: #00a3ff;
      font-size: 14px;
      font-family: 'Panton_Bold';

      span {
        color: #000;
      }
    }

    .line {
      flex-grow: 1;
      border-bottom: 1px dashed #8282824f;
      margin-bottom: 4px;
    }
  }

  &__id {
    font-size: 14px;
    font-family: 'Panton_Bold';
    color: #000;
    margin-bottom: 20px;
  }
}

body.dark {
  .nft-panel {
    background-color: #313354;

    &__unlock {
      background-color: #6b93c036;
    }

    &__item {
      .line {
      }
    }

    &__progress {
      background-color: #dadeea14;
    }

    &__id {
      color: #fff;
    }
  }
}
</style>

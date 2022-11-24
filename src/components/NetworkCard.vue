<template>
  <div
    class="network-card"
    :class="{ 'network-card--checked': checked }"
    @click="toggleChecked"
  >
    <div class="network-card__section">
      <div class="network-card__icon">
        <keep-alive>
          <component :is="icon" />
        </keep-alive>
      </div>
      <div class="network-card__content">
        <span class="network-card__title">
          {{ network?.title || network?.label }}
        </span>
        <div class="network-card__info">
          <span v-if="network?.percent" class="network-card__percent">
            {{ network?.percent }}%
          </span>
          <div class="network-card__abbr">
            {{ network?.abbr || network?.key }}
          </div>
        </div>
      </div>
    </div>
    <div class="network-card__select">
      <transition name="fade">
        <done v-if="checked" />
      </transition>
    </div>
  </div>
</template>

<script>
import done from '@/assets/icons/step/done.svg';
import { ref, markRaw } from 'vue';

export default {
  name: 'NetworkCard',
  components: { done },
  props: {
    network: {
      type: Object,
      default: () => {},
    },
    iconPath: {
      type: String,
      default: 'networks',
    },
    checked: {
      type: Boolean,
    },
  },
  emits: ['uncheck', 'check'],
  setup(props, { emit }) {
    const icon = ref();
    const iconName = props.network?.icon || props.network?.net;

    import(`@/assets/icons/${props.iconPath}/${iconName}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const toggleChecked = () => {
      if (props.checked) {
        emit('uncheck', props.network.id || props.network);
      } else {
        emit('check', props.network.id || props.network);
      }
    };

    return { icon, toggleChecked };
  },
};
</script>

<style lang="scss" scoped>
@mixin getWidth($columns, $gutter) {
  width: calc(
    #{100% / $columns} - #{if(
        $columns > 2,
        #{$columns * $gutter} / #{$columns - 1},
        $gutter
      )}
  );

  &:nth-child(#{$columns}n) {
    margin-right: 0;
  }
}

.network-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;

  border-radius: 8px;
  background-color: $ghostwhite;
  cursor: pointer;
  max-width: 290px;
  width: 100%;
  height: 94px;
  max-height: 94px;

  margin: 8px 0;

  &:hover {
    background: $white;
    box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
      0 10px 15px rgba(80, 100, 124, 0.16);

    .network-card {
      &__icon {
        svg {
          fill: $white;
        }

        &::before {
          opacity: 1;
        }
      }
    }
  }

  @include md {
    height: 75px;
    width: 285px;
  }

  &--checked,
  &--checked:hover {
    background: $blue-gradient;
    box-shadow: none;

    .network-card {
      &__icon {
        & svg {
          fill: $dark-blue;
        }

        &::before {
          opacity: 0;
        }
      }

      &__percent,
      &__title {
        color: $white;
      }

      &__abbr {
        color: $too-ligth-blue;
      }

      &__select {
        background-color: $white;
      }
    }
  }

  &__section {
    display: flex;
    height: fit-content;
  }

  &__icon {
    width: 46px;
    height: 46px;
    min-width: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    margin-right: 16px;
    z-index: 1;
    position: relative;
    background: $white;

    @include md {
      margin-right: 10px;
    }

    & svg {
      fill: $mid-blue;
      max-width: 24px;
      max-height: 24px;
    }

    &::before {
      position: absolute;
      content: '';
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $blue-gradient;
      opacity: 0;
      z-index: -1;
      transition: 0.3s all;
      border-radius: 8px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__title {
    font-size: 16px;
    line-height: 19px;
    color: $darkslategray;
  }

  &__info {
    display: flex;
  }

  &__percent {
    font-family: 'Panton_ExtraBold';
    font-size: 14px;
    line-height: 17px;
    color: $blue;
    margin-right: 8px;

    @include md {
      font-size: 12px;
    }
  }

  &__abbr {
    font-size: 14px;
    line-height: 17px;
    color: $too-ligth-blue;
  }

  &__select {
    width: 28px;
    height: 28px;
    margin-bottom: 19px;
    min-width: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $round;
    background: $too-ligth-blue;

    & svg {
      width: 14px;
      height: 10px;
      fill: $dark-blue;
    }
  }
}
</style>

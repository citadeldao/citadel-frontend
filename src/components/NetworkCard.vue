<template>
  <div
    class="network-card"
    :class="{ 'network-card--checked': checked, isNew, emptyMnemonic }"
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
    isNew: {
      type: Boolean,
      default: false,
    },
    emptyMnemonic: {
      type: Boolean,
      default: false,
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
        emit(
          'uncheck',
          typeof props.network?.id === 'number'
            ? props.network.id
            : props.network
        );
      } else {
        emit(
          'check',
          typeof props.network?.id === 'number'
            ? props.network.id
            : props.network
        );
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
    background: linear-gradient(90deg, #f3e7ff 0%, #cde6ff 100%);
    box-shadow: none;

    .network-card {
      &__title {
        color: $darkslategray;
      }

      &__percent {
        color: $blue;
      }
    }

    &.emptyMnemonic {
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
          color: $darkgray;
        }

        &__select {
          background-color: $white;
        }
      }
    }
  }

  &.isNew,
  &.emptyMnemonic {
    background: $blue-gradient;

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
        color: $darkgray;
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
    color: $darkgray;
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

.network-card.emptyMnemonic:not(.network-card--checked) {
  background: $ghostwhite;

  .network-card__section {
    display: flex;
    height: fit-content;
  }

  .network-card__icon {
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

  .network-card__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .network-card__title {
    font-size: 16px;
    line-height: 19px;
    color: $darkslategray;
  }

  .network-card__info {
    display: flex;
  }

  .network-card__percent {
    font-family: 'Panton_ExtraBold';
    font-size: 14px;
    line-height: 17px;
    color: $blue;
    margin-right: 8px;

    @include md {
      font-size: 12px;
    }
  }

  .network-card__abbr {
    font-size: 14px;
    line-height: 17px;
    color: $darkgray;
  }

  .network-card__select {
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

body.dark {
  .network-card {
    background: #393c5f;

    &__title {
      color: $white;
    }

    &__percent {
      color: $dark-blue;
    }
  }

  .network-card.isNew,
  .network-card.emptyMnemonic {
    background: linear-gradient(90deg, #3d4964 0%, #532d8e 100%);
  }

  .network-card.emptyMnemonic:not(.network-card--checked)
    .network-card__icon
    svg {
    fill: $white;
  }

  .network-card.emptyMnemonic:not(.network-card--checked) .network-card__icon {
    background: #26273b;
  }

  .network-card.emptyMnemonic:not(.network-card--checked) .network-card__title {
    color: $white;
  }

  .network-card.emptyMnemonic[data-v-b4613d44]:not(.network-card--checked) {
    background: #393c5f;
  }

  // add networks (no keplr)
  .network-card--checked,
  .network-card--checked:hover {
    background: linear-gradient(90deg, #3d4964 0%, #532d8e 100%);
  }

  .network-card--checked .network-card__title,
  .network-card--checked:hover .network-card__title {
    color: $white;
  }
}
</style>

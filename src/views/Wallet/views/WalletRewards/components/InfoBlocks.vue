<template>
  <div class="info-block">
    <div class="info-block__block">
      <span class="info-block__block-title">
        {{ $t(blockData.block1.title) }}
      </span>
      <div
        class="info-block__block-section"
        :class="{
          withTwoButtons:
            unassignedAddresses.length && assignedAddresses.length,
        }"
      >
        <span class="info-block__block-info">
          {{ $t(blockData.block1.desc) }}
        </span>
        <div class="info-block__block-section-controlls">
          <RoundArrowButton
            v-if="blockData.block1.showRoundButton"
            text="addAddressExp"
            @click="$emit('block1ButtonClick')"
          />
          <div
            v-if="assignedAddresses.length"
            class="info-block__block-assigned-addresses-button"
          >
            <AssignButton
              type="assigned"
              :amount="assignedAddresses.length"
              @click="$emit('assignedButtonClick')"
            />
          </div>
          <div
            v-if="unassignedAddresses.length"
            class="info-block__block-unassigned-addresses-button"
          >
            <AssignButton
              type="unassigned"
              :amount="unassignedAddresses.length"
              @click="$emit('unassignedButtonClick')"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="info-block__block">
      <span class="info-block__block-title">
        {{ $t(blockData.block2.title) }}
      </span>
      <div class="info-block__block-section">
        <span class="info-block__block-info">
          {{ $t(blockData.block2.desc) }}
        </span>
        <RoundArrowButton
          v-if="false"
          text="learnMore"
          @click="$emit('block2ButtonClick')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import AssignButton from './AssignButton.vue';
export default {
  name: 'InfoBlocks',
  components: { RoundArrowButton, AssignButton },
  props: {
    unassignedAddresses: {
      type: Array,
      default: () => [],
    },
    assignedAddresses: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'block1ButtonClick',
    'block2ButtonClick',
    'assignedButtonClick',
    'unassignedButtonClick',
  ],
  setup(props) {
    const blockData = computed(() => {
      if (
        !props.unassignedAddresses.length &&
        !props.assignedAddresses.length
      ) {
        return {
          block1: {
            title: 'xct.blocks.title1',
            desc: 'xct.blocks.desc1',
            showRoundButton: true,
          },
          block2: {
            title: 'xct.blocks.title2',
            desc: 'xct.blocks.desc2',
          },
        };
      }

      if (props.unassignedAddresses.length && !props.assignedAddresses.length) {
        return {
          block1: {
            title: 'xct.blocks.title3',
            desc: 'xct.blocks.desc3',
            showRoundButton: false,
          },
          block2: {
            title: 'xct.blocks.title4',
            desc: 'xct.blocks.desc4',
          },
        };
      }

      if (!props.unassignedAddresses.length && props.assignedAddresses.length) {
        return {
          block1: {
            title: 'xct.blocks.title5',
            desc: 'xct.blocks.desc5',
            showRoundButton: false,
          },
          block2: {
            title: 'xct.blocks.title6',
            desc: 'xct.blocks.desc4',
          },
        };
      }

      if (props.unassignedAddresses.length && props.assignedAddresses.length) {
        return {
          block1: {
            title: 'xct.blocks.title3',
            desc: 'xct.blocks.desc5',
            showRoundButton: false,
          },
          block2: {
            title: 'xct.blocks.title3',
            desc: 'xct.blocks.desc4',
          },
        };
      }

      return {
        block1: {},
        block2: {},
      };
    });

    return { blockData };
  },
};
</script>

<style lang="scss" scoped>
.info-block {
  width: 437px;
  @include lg {
    width: 573px;
  }
  @include md {
    width: 469px;
  }

  &__block {
    display: flex;
    flex-direction: column;
    &:first-child {
      padding-bottom: 25px;
      border-bottom: 1px dashed $too-ligth-blue;
      margin-bottom: 24px;
      @include lg {
        padding-bottom: 17px;
        margin-bottom: 20px;
      }
      @include md {
        padding-bottom: 29px;
        margin-bottom: 25px;
      }
    }
  }
  &__block-title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin-bottom: 15px;
  }
  &__block-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    @include lg {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    @include md {
      flex-direction: row;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  &__block-section-controlls {
    display: flex;
  }
  &__block-assigned-addresses-button {
    margin-right: 16px;
  }
  &__block-unassigned-addresses-button,
  &__block-assigned-addresses-button {
    margin-bottom: 9px;
    @include lg {
      margin-right: 0;
      margin-bottom: 0;
    }
    @include md {
      margin-right: 0;
      margin-bottom: 0;
    }
  }
  &__block-info {
    font-size: 14px;
    line-height: 20px;
    color: $mid-blue;
    margin-bottom: 12px;
    width: 437px;
    @include lg {
      width: 391px;
      margin-bottom: 0;
    }
    @include md {
      width: 277px;
      margin-bottom: 0;
    }
  }
}
.withTwoButtons {
  @include lg {
    flex-direction: column;
    align-items: flex-start;
    .info-block__block-info {
      margin-bottom: 16px;
      width: fit-content;
    }
    .info-block__block-assigned-addresses-button {
      margin-right: 16px;
    }
    .info-block__block-unassigned-addresses-button,
    .info-block__block-assigned-addresses-button {
      margin-bottom: 15px;
    }
  }
  @include md {
    flex-direction: column;
    align-items: flex-start;
    .info-block__block-info {
      margin-bottom: 16px;
      width: fit-content;
    }
    .info-block__block-assigned-addresses-button {
      margin-right: 16px;
    }
    .info-block__block-unassigned-addresses-button,
    .info-block__block-assigned-addresses-button {
      margin-bottom: 4px;
    }
  }
}
</style>

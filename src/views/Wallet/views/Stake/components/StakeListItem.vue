<template>
  <div class="stake-list-item" :class="type && `stake-list-item--${type}`">
    <div class="stake-list-item__left-section">
      <div v-if="icon" class="stake-list-item__icon-wrapper">
        <div class="stake-list-item__icon">
          <img
            v-show="hasLogo"
            :src="item.imageSource"
            alt=""
            @load="onLoadLogo"
          />
          <keep-alive
            v-if="!hasLogo"
            :style="{ fill: item.color || colors[index] }"
          >
            <component :is="currentIcon" />
          </keep-alive>
        </div>
        <div class="stake-list-item__ring">
          <div
            class="stake-list-item__ring-left"
            :style="{ borderColor: item.color || colors[index] }"
          />
          <div
            class="stake-list-item__ring-right"
            :style="{ borderColor: item.color || colors[index] }"
          />
        </div>
      </div>
      <div class="stake-list-item__title">
        <div>
          <span
            class="stake-list-item__title-title"
            :style="{ maxWidth: `${titleMaxWidth}px` }"
          >
            {{ title }}
          </span>
          <Tooltip>
            <template #content>
              <div class="stake-list-item__tooltip">
                {{ $t('staking.nodeIsJailed') }}
              </div>
            </template>
            <template #default>
              <Label
                color="#FA3B33"
                style="align-items: center; margin-top: -6px"
              >
                {{ $t('jailed') }}
              </Label>
            </template>
          </Tooltip>
        </div>
        <div v-if="!type" class="stake-list-item__title-title-info">
          <div class="stake-list-item__title-line">
            <span class="stake-list-item__title-line-title"
              >{{ $t('fee') }}:</span
            >
            <span class="stake-list-item__fee-line-value">{{ fee }}</span>
            <span class="stake-list-item__title-line-currency"> %</span>
          </div>
          <div class="stake-list-item__title-line">
            <span class="stake-list-item__title-line-title"
              >{{ $t('uptime') }}:</span
            >
            <span class="stake-list-item__title-line-value">{{
              item.uptime
            }}</span>
            <span class="stake-list-item__title-line-currency">%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="stake-list-item__right-section">
      <div class="stake-list-item__right-section-info">
        <div v-if="showAmount" class="stake-list-item__right-section-line">
          <span
            v-pretty-number="{ value: amount, currency: currentWallet.code }"
            class="stake-list-item__right-section-amount"
          />
          <span class="stake-list-item__right-section-amount-currency">
            {{ currentWallet.code }}
          </span>
        </div>
        <div v-if="item.stakeShare" class="stake-list-item__right-section-line">
          <span class="stake-list-item__right-section-share">Stake share</span>
          <span
            v-pretty-number="item.stakeShare"
            class="stake-list-item__right-section-share-value"
          />
          <span class="stake-list-item__right-section-share-currency">% </span>
        </div>
      </div>
      <EditButton
        v-if="showEditButton"
        data-qa="staking__change-node-button"
        @click="clickHandler(item)"
      >
        {{ $t(buttonText) }}
      </EditButton>
    </div>
  </div>
</template>

<script>
import { markRaw, ref, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';
import { WALLET_TYPES } from '@/config/walletType';
import EditButton from '@/components/UI/EditButton.vue';
import Label from '@/components/UI/Label.vue';
import Tooltip from '@/components/UI/Tooltip.vue';
import { colors } from './config';

export default {
  name: 'StakeListItem',
  components: {
    EditButton,
    Label,
    Tooltip,
  },
  props: {
    titleMaxWidth: {
      type: String,
      default: '',
    },
    redelegationNodeTo: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    index: {
      type: Number,
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    balance: {
      type: Object,
      default: () => ({}),
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
    },
    buttonText: {
      type: String,
      default: 'edit',
    },
  },
  emits: ['editClick'],
  setup(props, { emit }) {
    const nodeIconRef = ref(null);
    const currentIcon = ref();
    const hasLogo = ref(false);

    if (props.icon) {
      import(`@/assets/icons/token/${props.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const onLoadLogo = () => {
      hasLogo.value = true;
    };

    const fee = computed(() => props.item.fee || 0);

    const { t } = useI18n();
    const title = computed(() =>
      props.type === 'frozen'
        ? t('balanceTooltipInfo.frozenBalance')
        : props.type === 'avaliable'
        ? t('balanceTooltipInfo.availableBalance')
        : props.type === 'withoutDelegation'
        ? t('withoutDelegation')
        : props.item.name
    );
    const amount = computed(() =>
      props.type === 'frozen'
        ? props.balance.frozenBalance
        : props.type === 'avaliable'
        ? props.balance.mainBalance
        : props.type === 'withoutDelegation'
        ? BigNumber(props.balance.stake)
            .minus(props.balance.delegatedBalance)
            .toNumber()
        : props.item.value
    );

    const showAmount = computed(() => {
      if (props.type && !amount.value) {
        return true;
      } else if (!props.type && !amount.value) {
        return false;
      }

      return true;
    });

    const updateSelectedNode = inject('updateSelectedNode');
    const activeTab = inject('activeTab');
    const selectedNode = inject('selectedNode');
    const updateShowChooseNode = inject('updateShowChooseNode');
    const updateShowNodesList = inject('updateShowNodesList');
    const updateShowModal = inject('updateShowModal');
    const updateEditMode = inject('updateEditMode');
    const editMode = inject('editMode');
    const updateIsWithoutDelegation = inject('updateIsWithoutDelegation');
    const getDelegationFee = inject('getDelegationFee');

    const clickHandler = async (item) => {
      emit('editClick');

      if (selectedNode.value) {
        updateShowChooseNode(false);
        updateShowNodesList(true);
      } else if (props.type === 'withoutDelegation') {
        updateIsWithoutDelegation(true);
        await getDelegationFee(activeTab.value);
        updateShowModal(true);
        updateShowChooseNode(true);
      } else {
        updateEditMode(true);
        await updateSelectedNode(item);
        updateShowModal(true);
        updateShowChooseNode(true);
      }
    };

    const showEditButton = computed(() => {
      if (editMode.value && !props.redelegationNodeTo) {
        return false;
      } else if (
        (editMode.value && props.redelegationNodeTo) ||
        (props.type === 'withoutDelegation' &&
          props.currentWallet.type !== WALLET_TYPES.PUBLIC_KEY)
      ) {
        return true;
      } else if (
        props.currentWallet.type !== WALLET_TYPES.PUBLIC_KEY &&
        !props.type
      ) {
        return true;
      }

      return false;
    });

    return {
      nodeIconRef,
      currentIcon,
      hasLogo,
      WALLET_TYPES,
      fee,
      colors,
      title,
      amount,
      clickHandler,
      onLoadLogo,
      showAmount,
      showEditButton,
    };
  },
};
</script>

<style lang="scss" scoped>
.stake-list-item {
  width: 100%;
  border: 1px solid $too-ligth-blue;
  border-radius: 8px;
  height: 68px;
  display: flex;
  align-items: center;
  padding: 0 12px 0 17px;
  justify-content: space-between;

  @include md {
    height: 56px;
  }

  &--avaliable {
    background: $ghostwhite1;

    .stake-list-item__title-title {
      margin-bottom: 0;
    }

    .stake-list-item__icon {
      & svg {
        fill: $mid-gray;
      }
    }

    .stake-list-item__ring-left {
      border-color: $mid-gray;
    }

    .stake-list-item__ring-right {
      border-color: $mid-gray;
    }
  }

  &--withoutDelegation {
    background: $snow;
    border: 1px solid $mid-blue;

    .stake-list-item__title-title {
      margin-bottom: 0;
    }

    .stake-list-item__right-section-amount {
      color: $mid-blue;
    }
  }

  &--frozen {
    background: $whitesmoke;

    & svg {
      fill: $mid-blue;
    }

    .stake-list-item__title-title {
      margin-bottom: 0;
    }

    .stake-list-item__ring-left {
      border-color: $mid-blue;
    }

    .stake-list-item__ring-right {
      border-color: $mid-blue;
    }
  }

  &__left-section {
    display: flex;
    align-items: center;
  }

  &__icon-wrapper {
    font-size: 48px;
    height: 48px;
    width: 48px;
    float: left;
    position: relative;
    margin-right: 3px;

    @include md {
      width: 36px;
      height: 36px;
      margin-right: 5px;
    }
  }

  &__icon {
    border-radius: 50%;
    top: 7px;
    right: 7px;
    width: 34px;
    height: 34px;
    cursor: default;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white center;
    background-size: cover;
    z-index: 1;
    box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
      0 10px 15px rgba(80, 100, 124, 0.16);

    @include md {
      top: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
    }

    & svg {
      max-width: 21px;
      max-height: 21px;
      //fill: #3498db;
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 50%;
    }
  }

  &__ring {
    width: 48px;
    height: 48px;
    clip: rect(auto, auto, auto, auto);
    left: 0;
    position: absolute;
    top: 0;

    @include md {
      width: 36px;
      height: 36px;
    }
  }

  &__ring-left,
  &__ring-right {
    transform: rotate(326deg);
    border: 8px solid #3498db;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    clip: rect(0, 0.5em, 1em, 0);
    left: 0;
    position: absolute;
    top: 0;

    @include md {
      width: 36px;
      height: 36px;
    }
  }

  &__ring-right {
    transform: rotate(371deg);
  }

  &__title {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__title-title {
    display: block;
    align-items: center;
    font-size: 17px;
    line-height: 20px;
    font-family: 'Panton_Bold';
    margin-bottom: 7px;
    max-width: 268px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    @include xs-lg {
      max-width: 280px;
    }
    @include md {
      max-width: 360px;
      font-size: 14px;
    }
  }

  &__title-title-info {
    display: flex;
    align-items: center;
  }

  &__title-line {
    display: flex;
    align-items: center;
    margin-right: 20px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__title-line-title,
  &__title-line-value,
  &__fee-line-value,
  &__title-line-currency,
  &__right-section-share,
  &__right-section-share-value,
  &__right-section-share-currency {
    font-size: 12px;
    line-height: 14px;
    color: $mid-gray;
  }

  &__title-line-title {
    margin-right: 8px;
  }

  &__title-line-value,
  &__fee-line-value,
  &__right-section-share-value {
    color: $ligth-blue;
    margin-right: 1px;
    font-family: 'Panton_Bold';
  }

  &__tooltip {
    color: $mid-blue;
    font-size: 14px;
    line-height: 15px;
  }

  &__fee-line-value {
    color: $red;
  }

  &__right-section-share-value {
    color: $ligth-blue;
    margin-right: 5px;
    font-family: 'Panton_Bold' !important;
  }

  &__title-line-currency,
  &__right-section-share-currency {
    color: $black;
  }

  &__right-section {
    display: flex;
    align-items: center;

    & button {
      margin-left: 16px;

      @include md {
        margin-left: 8px;
      }
    }
  }

  &__right-section-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__right-section-line {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    justify-content: flex-end;

    @include md {
      margin-bottom: 2px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__right-section-amount,
  &__right-section-amount-currency {
    font-size: 17px;
    line-height: 20px;
    color: $dark-blue;

    @include md {
      font-size: 14px;
      line-height: 16px;
    }
  }

  &__right-section-amount {
    margin-right: 5px;
    font-family: 'Panton_Bold' !important;
  }

  &__right-section-amount-currency {
    font-family: 'Panton_SemiBold';
    color: $black;
  }

  &__right-section-share {
    margin-right: 8px;
  }

  &__right-section-share-value {
  }

  &__right-section-share-currency {
  }
}
</style>

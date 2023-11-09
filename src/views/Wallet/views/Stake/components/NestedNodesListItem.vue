<template>
  <div class="nodes-list-item">
    <div @click="toggleNodeList" class="nodes-list-item__wrapper">
      <div
        class="nodes-list-item__section"
        :class="{ 'nodes-list-item--chosen': chosen }"
      >
        <Checkbox
          :id="item.address"
          :value="isObjectsChecked"
          :disabled="isNodeDisabled"
          @change="toggleNodeList"
        />
        <div class="nodes-list-item__icon">
          <img
            v-show="hasLogo"
            :src="item.imageSource"
            class=""
            @load="onLoadLogo"
          />
          <keep-alive v-if="!hasLogo">
            <component :is="currentIcon" />
          </keep-alive>
        </div>
        <div class="nodes-list-item__info">
          <div class="nodes-list-item__info-section">
            <Tooltip>
              <template #content>
                <div
                  class="nodes-list-item-tooltip"
                  :class="{
                    'nodes-list-item-tooltip--status--active': item.isActive,
                  }"
                >
                  <div class="nodes-list-item-tooltip__status">
                    {{ $t('status') }}:
                    <span>{{
                      $t(`${item.isActive ? 'active' : 'noactive'}`)
                    }}</span>
                  </div>
                  <div
                    v-if="!item.isActive"
                    class="nodes-list-item-tooltip__status-hint"
                  >
                    {{ $t('staking.nodeIsNotActive') }}
                  </div>
                  <div
                    v-if="item.description"
                    class="nodes-list-item-tooltip__description"
                  >
                    {{ item.description }}
                  </div>
                </div>
              </template>
              <template #default>
                <span class="nodes-list-item__info-title">{{ item.name }}</span>
              </template>
            </Tooltip>
            <el-tooltip
              v-if="item?.providerWebsite"
              effect="rewards-list-tooltip"
              placement="top"
            >
              <span
                class="nodes-list-item__info-verified"
                @click.stop="toValidatorPage(item?.providerWebsite)"
              >
                <srIsVerified v-if="item?.isVerified" />
                <srIsNotVerified v-else />
              </span>
              <template #content>
                <div
                  class="rewards-list-tooltip__content"
                  v-if="item?.isVerified"
                >
                  <span> Staking Rewards </span>
                  <span> Verified Provider </span>
                </div>
                <div class="rewards-list-tooltip__content" v-else>
                  <span> Staking Rewards </span>
                  <span> Provider </span>
                </div>
              </template>
            </el-tooltip>
          </div>

          <div class="nodes-list-item__info-section">
            <span class="nodes-list-item__info-fee">
              {{ $t('fee') }}:
              <span class="nodes-list-item__info-fee-value">
                {{ fee }}
                <span class="nodes-list-item__info-fee-currency">%</span>
              </span>
            </span>
            <span class="nodes-list-item__info-uptime">
              {{ $t('uptime') }}:
              <span class="nodes-list-item__info-uptime-value">
                {{ item.uptime }}
                <span class="nodes-list-item__info-uptime-currency">%</span>
              </span>
            </span>

            <span v-if="showTag" class="nodes-list-item__tags">
              <Label
                v-for="(tag, index) of item.tags"
                :key="`${tag.name}${index}`"
                type="tag"
                :color="tag.color"
              >
                {{ tag.name }}
              </Label>
            </span>
          </div>
        </div>
      </div>
      <div class="nodes-list-item__section --right">
        <div v-if="item.value" class="nodes-list-item__value">
          <span
            v-pretty-number="{
              value: item.value,
              currency: currentWallet.code,
            }"
            class="nodes-list-item__value-value"
          />
          <span class="nodes-list-item__value-currency">
            {{ currentWallet.code }}
          </span>
        </div>
        <div v-if="item.stakeShare" class="nodes-list-item__share">
          <span class="nodes-list-item__share-label">Stake share</span>
          <span
            v-pretty-number="item.stakeShare"
            class="nodes-list-item__share-value"
          />
          <span class="nodes-list-item__share-currency">% </span>
        </div>
      </div>
    </div>

    <div v-if="item.objects.length" class="nodes-list-item__list">
      <el-tooltip
        v-for="object in item.objects"
        :key="object.stakedSuiObjectId"
        effect="light"
        :content="$t('nodeObjectStatusNote')"
        :disabled="isObjectActive(object)"
        placement="top"
      >
        <div
          @click="toggleNode(object)"
          :class="{ notAllowed: !isObjectActive(object) }"
          class="nodes-list-item__list-item"
        >
          <div class="nodes-list-item__list-item-info">
            <Checkbox
              :disabled="!isObjectActive(object)"
              :id="object.stakedSuiObjectId"
              :value="isItemChecked(object.stakedSuiObjectId)"
              @change="toggleNode(object)"
            />
            <span class="nodes-list-item__list-item-id">
              {{ shortTitle(object.stakedSuiObjectId) }}
            </span>
          </div>
          <div class="nodes-list-item__value">
            <div class="nodes-list-item__list-item-value">
              <span
                class="nodes-list-item__list-item-amount"
                v-pretty-number="{
                  value: object.value,
                  currency: currentWallet.code,
                }"
              >
              </span>
              <span class="nodes-list-item__list-item-currency">
                {{ currentWallet.code }}
              </span>
            </div>
            /
            <div class="nodes-list-item__list-item-value">
              <span
                class="nodes-list-item__list-item-amount --reward"
                v-pretty-number="{
                  value: object.estimatedReward,
                  currency: currentWallet.code,
                }"
              >
              </span>
              <span class="nodes-list-item__list-item-currency">
                {{ currentWallet.code }}
              </span>
            </div>
            <span class="nodes-list-item__share --rewards">
              {{ $t('rewards') }}
            </span>
          </div>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { getMiddleCutText } from '@/helpers';
import Checkbox from '@/components/UI/Checkbox';
import srIsNotVerified from '@/assets/icons/sr-isNotVerified.svg';
import srIsVerified from '@/assets/icons/sr-isVerified.svg';
import Tooltip from '@/components/UI/Tooltip.vue';
import Label from '@/components/UI/Label.vue';
import { ref, computed, markRaw } from 'vue';
import tick from '@/assets/icons/tick.svg';

export default {
  name: 'NestedNodesListItem',
  components: {
    Tooltip,
    Label,
    tick,
    srIsNotVerified,
    srIsVerified,
    Checkbox,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    icon: {
      type: String,
      default: '',
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    selectedItems: {
      type: Array,
      default: () => [],
    },
    chosen: {
      type: Boolean,
      default: false,
    },
    showTag: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggleNode', 'toggleNodeList'],
  setup(props, { emit }) {
    const nodeIconRef = ref(null);
    const currentIcon = ref();
    const hasLogo = ref(false);
    import(`@/assets/icons/networks/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const isObjectsChecked = computed(() => {
      const fliteredList = props.item.objects.filter((object) =>
        isObjectActive(object)
      );
      if (!fliteredList.length) return false;
      return fliteredList.every((object) =>
        props.selectedItems.some(
          (node) => node.stakedSuiObjectId === object.stakedSuiObjectId
        )
      );
    });
    const isNodeDisabled = computed(() =>
      props.item.objects.every((object) => !isObjectActive(object))
    );
    const isItemChecked = (id) =>
      props.selectedItems.some((node) => node.stakedSuiObjectId === id);

    const toggleNodeList = () => {
      emit(
        'toggleNodeList',
        props.item.objects.filter((object) => isObjectActive(object)),
        isObjectsChecked.value
      );
    };

    const isObjectActive = (object) => object.status.toLowerCase() === 'active';

    const toggleNode = (object) => {
      if (isObjectActive(object)) emit('toggleNode', [object]);
    };

    const shortTitle = (title) => getMiddleCutText(title, 24);

    const toValidatorPage = (url) => {
      window.open(url, '_blank');
    };

    const onLoadLogo = () => {
      hasLogo.value = true;
    };

    const fee = computed(() => props.item.fee || 0);

    return {
      isNodeDisabled,
      isObjectActive,
      toggleNode,
      toggleNodeList,
      isItemChecked,
      isObjectsChecked,
      shortTitle,
      nodeIconRef,
      currentIcon,
      hasLogo,
      fee,
      onLoadLogo,
      toValidatorPage,
    };
  },
};
</script>

<style lang="scss" scoped>
.nodes-list-item {
  cursor: pointer;
  border-bottom: 1px solid $too-ligth-blue;
  display: flex;
  flex-direction: column;
  &__value {
    display: flex;
    gap: 5px;
  }
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
    &:hover {
      background: $too-ligth-gray;

      .nodes-list-item__info-title {
        color: $blue;
      }

      .nodes-list-item__icon {
        background: $blue center;
        background-size: cover;
      }
    }
  }
  &__list {
    border-top: 1px dashed $too-ligth-blue;
    padding-top: 16px;
    padding-bottom: 17px;
    margin-left: 40px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  &__list-item {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  &__list-item-info {
    display: flex;
    align-items: center;
  }
  &__list-item-id {
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    color: #4b4c63;
  }
  &__list-item-value {
    font-size: 16px;
    line-height: 19px;
  }
  &__list-item-amount {
    font-weight: 700;
    margin-right: 3px;
    &.--reward {
      color: $waitingStatus;
    }
  }
  &__list-item-currency {
    font-weight: 400;
  }

  &__section {
    display: flex;
    &.--right {
      flex-direction: column;
    }
  }
  &__icon {
    width: 34px;
    height: 34px;
    border-radius: $round;
    background: $darkgray center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;

    & svg {
      fill: $white;
      max-width: 21px;
      max-height: 21px;
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 50%;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__info-title {
    font-size: 16px;
    line-height: 19px;
    color: $mid-blue;
    font-family: 'Panton_Bold';
    margin-bottom: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 290px;
  }
  &__info-verified {
    margin-left: 8px;
    cursor: pointer;
  }

  &__info-section {
    display: flex;
    align-items: center;
  }

  &__info-fee,
  &__info-uptime,
  &__share {
    display: flex;
    align-items: center;
    font-size: 12px;
    line-height: 14px;
    color: $mid-gray;
    margin-right: 20px;
  }
  &__share {
    margin-right: 0;
    margin-top: 4px;
  }

  &__info-fee-value,
  &__info-uptime-value,
  &__share-currency,
  &__share-value {
    color: $red;
    font-family: 'Panton_Bold';
    margin-left: 5px;
  }

  &__info-fee-currency,
  &__info-uptime-currency,
  &__share-currency {
    color: $black;
  }

  &__info-uptime-value,
  &__share-value {
    color: $ligth-blue;
  }

  &__tags {
    display: flex;
    margin-top: -1px;
  }

  &__value {
    display: flex;
    align-self: flex-end;
  }

  &__value-value,
  &__value-currency {
    font-size: 14px;
    line-height: 17px;
    color: $mid-blue;
    font-family: 'Panton_Bold' !important;
  }

  &__value-currency {
    color: $mid-gray;
    font-family: 'Panton_Regular' !important;
    margin-left: 3px;
  }

  &__tick {
    width: 30px;
  }

  &--chosen {
    .nodes-list-item__icon {
      background: $dark-blue;
    }
    .nodes-list-item__info-title {
      color: $black;
    }
  }

  &-tooltip {
    &__status {
      margin-bottom: 3px;
      font-size: 14px;
      font-family: 'Panton_SemiBold';
      color: $black;

      span {
        color: $mid-blue;
        padding-left: 2px;
      }
    }

    &__status-hint {
      margin-bottom: 8px;
      font-size: 12px;
      font-family: 'Panton_SemiBold';
      color: $red;
    }

    &__description {
      color: $mid-blue;
      font-size: 12px;
      line-height: 15px;
    }

    &--status {
      &--active {
        .nodes-list-item-tooltip {
          &__status span {
            color: $green;
          }
        }
      }
    }
  }
}
.rewards-list-tooltip__content {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
}

body.dark {
  .rewards-list-tooltip {
    &__content {
      color: $white;
    }
  }
  .nodes-list-item {
    &:hover {
      background: none;
      opacity: 0.8;
    }

    &__value {
      color: $white;
    }

    &__list-item-id {
      color: #afbccb;
    }

    &__list-item-amount,
    &__list-item-currency,
    &__share-currency {
      color: #6b93c0;
    }

    &__wrapper {
      &:hover {
        background: transparent;
      }
    }
    &__info-fee-currency,
    &__info-uptime-currency {
      color: #8b9bc7;
    }
  }
}
</style>

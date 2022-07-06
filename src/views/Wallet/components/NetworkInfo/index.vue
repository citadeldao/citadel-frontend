<template>
  <div class="network-info">
    <div class="network-info__header">
      <div class="network-info__title">
        <div class="network-info__title-icon">
          <div v-if="isCurrentToken" class="network-info__title-logo">
            <div
              v-if="showIconPlaceholder"
              class="network-info__title-logo-icon-placeholder"
            >
              <span>{{ iconPlaceholder[0] }}</span>
              <span>{{ iconPlaceholder[1] }}</span>
            </div>
            <img
              v-else
              :src="getTokenIcon(currentWallet?.code.toLowerCase())"
              alt=""
              @error="showIconPlaceholder = true"
            />
          </div>
          <keep-alive v-else>
            <component :is="currentIcon" />
          </keep-alive>
        </div>

        <span>{{ currentWallet.shortName || currentWallet.name }}</span>
      </div>
      <div class="network-info__social-toggle-wrapper">
        <!-- Ссылки на соцсети сеток для 1280 px -->

        <div v-if="socials" class="network-info__social-lg">
          <a
            v-if="socials.web"
            :title="socials.web.title"
            :href="socials.web.href"
            target="_blank"
            rel="nofollow noopener"
          >
            <web />
          </a>
          <a
            v-if="socials.twitter"
            :title="socials.twitter.title"
            :href="`https://twitter.com/${socials?.twitter.href}`"
            target="_blank"
            rel="nofollow noopener"
          >
            <twitter />
          </a>
          <a
            v-if="socials.landing"
            class="network-info__link-icon"
            :title="socials.landing.title"
            :href="socials.landing.href"
            target="_blank"
            rel="nofollow noopener"
          >
            <linkIcon />
          </a>
        </div>
        <div
          class="network-info__title-toggle-info"
          data-qa="wallet__network-info__expand-button"
          @click="showExpand"
        >
          <expand />
          <expandHover id="hover" />
        </div>
      </div>
    </div>
    <!-- Ссылки на соцсети сеток для 1920 px -->
    <div v-if="socials" class="network-info__social">
      <a
        v-if="socials.web"
        class="network-info__social-block"
        :title="socials.web.title"
        :href="socials.web.href"
        target="_blank"
        rel="nofollow noopener"
      >
        <web />
        <span>{{ socials?.web.title }}</span>
      </a>
      <a
        v-if="socials.twitter"
        class="network-info__social-block"
        :title="socials.twitter.title"
        :href="`https://twitter.com/${socials?.twitter.href}`"
        target="_blank"
        rel="nofollow noopener"
      >
        <twitter />
        <span>{{ socials.twitter.title }}</span>
      </a>
      <a
        v-if="socials.landing"
        class="network-info__social-block network-info__link-icon"
        :title="socials.landing.title"
        :href="socials.landing.href"
        target="_blank"
        rel="nofollow noopener"
      >
        <linkIcon />
        <span>{{ socials.landing.title }}</span>
      </a>
    </div>
    <!-- Информация по сетке(цены на бирже) -->
    <div class="network-info__info">
      <span class="network-info__info-title"> {{ $t('tokenPrice') }} </span>
      <div class="network-info__info-price">
        <div class="network-info__info-usd-price">
          <span class="network-info__usd-prise">
            <span class="network-info__usd-currency">$</span>
            <span
              v-pretty-number="{ value: marketcap?.priceUsd, currency: 'USD' }"
            />
          </span>
          <div class="network-info__info-price-change">
            <span
              class="network-info__info-price-change-value"
              :class="{ decrease: usdDecriase }"
              ><span
                v-pretty-number="{
                  value: marketcap?.priceUsdDelta24pct,
                  currency: '%',
                }"
              />
              <span class="network-info__info-price-change-percent">%</span>
            </span>
            <priceDown v-if="usdDecriase" />
            <priceUp v-else />
          </div>
        </div>
        <div class="network-info__info-btc-price">
          <span class="network-info__btc-prise">
            <span
              v-pretty-number="{ value: marketcap?.priceBtc, currency: 'BTC' }"
            />
            <span class="network-info__btc-currency">BTC</span>
          </span>
          <div class="network-info__info-price-change">
            <span
              class="network-info__info-price-change-value"
              :class="{ decrease: btcDecriase }"
              ><span
                v-pretty-number="{
                  value: marketcap?.priceBtcDelta24pct,
                  currency: '%',
                }"
              />
              <span class="network-info__info-price-change-percent">%</span>
            </span>
            <priceDown v-if="btcDecriase" />
            <priceUp v-else />
          </div>
        </div>
      </div>
    </div>
    <!-- Дополнительная информация по сетке -->
    <div class="network-info__additional">
      <div v-if="apy" class="network-info__additional-info-line">
        <span class="network-info__additional-info-title">
          APY
          <Tooltip>
            <template #content>
              <span :style="{ maxWidth: '200px', display: 'flex' }">
                {{ $t('netInfoGeneral.apyTooltip') }}
              </span>
            </template>
            <template #default>
              <info />
            </template>
          </Tooltip>
        </span>
        <div class="network-info__additional-info-white-space" />
        <span class="network-info__additional-info-value">
          <span v-pretty-number="{ value: apy, currency: '%' }" />
          <span class="network-info__additional-info-percent"> % </span>
        </span>
      </div>
      <div v-if="inflation" class="network-info__additional-info-line">
        <span class="network-info__additional-info-title">
          {{ $t('netInfoGeneral.inflation') }}
          <Tooltip>
            <template #content>
              <span :style="{ maxWidth: '200px', display: 'flex' }">
                {{ $t('netInfoGeneral.inflationTooltip') }}
              </span>
            </template>
            <template #default>
              <info />
            </template>
          </Tooltip>
        </span>
        <div class="network-info__additional-info-white-space" />
        <span class="network-info__additional-info-value">
          <span v-pretty-number="{ value: inflation, currency: '%' }" />
          <span class="network-info__additional-info-percent"> % </span>
        </span>
      </div>
      <div v-if="stakingRatio" class="network-info__additional-info-line">
        <span class="network-info__additional-info-title">
          {{ $t('netInfoGeneral.staked') }}
          <Tooltip>
            <template #content>
              <span :style="{ maxWidth: '200px', display: 'flex' }">
                {{ $t('netInfoGeneral.stakingRatioTooltip') }}
              </span>
            </template>
            <template #default>
              <info />
            </template>
          </Tooltip>
        </span>
        <div class="network-info__additional-info-white-space" />
        <span class="network-info__additional-info-value">
          <span v-pretty-number="{ value: stakingRatio, currency: '%' }" />
          <span class="network-info__additional-info-percent"> % </span>
        </span>
      </div>
    </div>
    <div class="network-info__note">
      <p>
        {{ tokenDescription }}
      </p>
    </div>
    <teleport v-if="showModal" to="body">
      <Modal>
        <NetworkInfoExpand
          v-click-away="modalCloseHandler"
          :socials="socials"
          :current-wallet="currentWallet"
          :marketcap="marketcap"
          :is-current-token="isCurrentToken"
          @close="modalCloseHandler"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import info from '@/assets/icons/info.svg';
import priceDown from '@/assets/icons/priceDown.svg';
import priceUp from '@/assets/icons/priceUp.svg';
import web from '@/assets/icons/web.svg';
import twitter from '@/assets/icons/twitter.svg';
import linkIcon from '@/assets/icons/link.svg';
import expand from '@/assets/icons/network-info/expand.svg';
import expandHover from '@/assets/icons/network-info/expand-hover.svg';
import socialLinks from './socials';
import NetworkInfoExpand from './components/NetworkInfoExpand';
import Modal from '@/components/Modal';
import { markRaw, ref, watch, computed } from 'vue';
import { prettyNumber } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';
import Tooltip from '@/components/UI/Tooltip';
import { getTokenIcon, tokenIconPlaceholder } from '@/helpers';
import { useI18n } from 'vue-i18n';

export default {
  name: 'NetworkInfo',
  components: {
    Tooltip,
    expand,
    expandHover,
    web,
    linkIcon,
    twitter,
    priceDown,
    priceUp,
    info,
    NetworkInfoExpand,
    socialLinks,
    Modal,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    isCurrentToken: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const currentIcon = ref();
    const { t, te } = useI18n();
    const store = useStore();

    const tokenDescription = computed(() => {
      return props.isCurrentToken ||
        !te(`netInfo.${props.currentWallet.net}.shortDescription`)
        ? ''
        : t(`netInfo.${props.currentWallet.net}.shortDescription`);
    });

    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() =>
      tokenIconPlaceholder(props.currentWallet?.name)
    );

    const setIcon = (icon) => {
      props.currentWallet.net &&
        !props.isCurrentToken &&
        import(`@/assets/icons/networks/${icon}.svg`).then((val) => {
          currentIcon.value = markRaw(val.default);
        });
    };

    setIcon(props.currentWallet.net);

    const getWalletMarketcap = async () => {
      const { data } = await props.currentWallet.getMarketcap();
      store.dispatch('profile/setCurrentWalletMarketcap', {
        ...data,
        net: props.currentWallet.net,
      });
    };
    getWalletMarketcap();

    const marketcap = computed(
      () => store.getters['profile/currentWalletMarketcap']
    );
    const apy = computed(() => {
      const currencyYield = marketcap.value?.yield;

      if (!currencyYield) {
        return 0;
      }

      return typeof currencyYield === 'number'
        ? +currencyYield.toFixed(2)
        : currencyYield;
    });
    const inflation = computed(() => marketcap.value?.inflation);
    const stakingRatio = computed(() => marketcap.value?.stakingRate);

    const usdDecriase = computed(() => marketcap.value?.priceUsdDelta24pct < 0);
    const btcDecriase = computed(() => marketcap.value?.priceBtcDelta24pct < 0);

    const socials = computed(() => socialLinks[props.currentWallet.net]);

    watch(
      () => props.currentWallet.net,
      (newVal) => {
        setIcon(newVal);
        showIconPlaceholder.value = false;
        getWalletMarketcap();
      }
    );

    const showModal = ref(false);
    const modalCloseHandler = () => (showModal.value = false);
    const showExpand = () => (showModal.value = true);

    return {
      currentIcon,
      prettyNumber,
      marketcap,
      usdDecriase,
      btcDecriase,
      apy,
      inflation,
      stakingRatio,
      socials,
      showModal,
      modalCloseHandler,
      showExpand,
      showIconPlaceholder,
      iconPlaceholder,
      getTokenIcon,
      tokenDescription,
    };
  },
};
</script>

<style lang="scss" scoped>
.network-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: 16px;
  padding: 25px;

  @include lg {
    padding: 30px 25px;
  }
  @include md {
    padding: 16px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 24px;
    border-bottom: 1px solid $too-ligth-blue;
    margin-bottom: 16px;
    @include lg {
      align-items: center;
      padding-bottom: 16px;
      margin-bottom: 10px;
    }
    @include md {
      padding-bottom: 16px;
      margin-bottom: 13px;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    width: 100%;

    & span {
      font-size: 24px;
      line-height: 29px;
      @include lg {
        margin-right: 20px;
        font-size: 18px;
        flex: 1 1 auto;
      }
      @include md {
        font-size: 14px;
        line-height: 17px;
      }
    }
  }

  &__title-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $dark-blue;
    border-radius: 8px;
    margin-right: 8px;

    & svg {
      fill: $white;
      max-width: 18px;
      max-height: 22px;
    }

    @include lg {
      margin-right: 9px;
    }
    @include md {
      width: 30px;
      height: 30px;
      border-radius: 4px;
    }

    @include xl {
      margin-right: 16px;
    }
  }

  &__title-logo {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;

    & img {
      filter: brightness(0) invert(1);
      max-width: 18px;
      max-height: 22px;
    }
  }

  &__title-logo-icon-placeholder {
    position: relative;
    width: 100%;
    height: 100%;

    & span {
      position: absolute;
      color: $white;
      font-family: 'Panton_Bold';
      font-size: 14px;
      line-height: 17px;
      top: 8px;
      left: 8px;
      @include md {
        top: 2px;
        left: 5px;
      }

      &:last-child {
        top: 15px;
        left: 22px;
        @include md {
          top: 11px;
          left: 17px;
        }
      }
    }
  }

  &__title-toggle-info {
    cursor: pointer;

    svg {
      display: block;
    }

    svg + #hover {
      display: none;
    }

    &:hover {
      svg:not(#hover) {
        display: none;
      }

      svg + #hover {
        display: block;
      }
    }
  }

  &__social {
    display: none;
    justify-content: space-between;
    padding-bottom: 17px;
    border-bottom: 1px solid $too-ligth-blue;
    margin-bottom: 21px;
    @include xl {
      display: flex;
    }
  }

  &__social-toggle-wrapper {
    flex-basis: 120px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @include lg {
      justify-content: flex-end;
    }
  }

  &__social-lg {
    display: none;

    & a {
      margin-right: 14px;
      display: flex;
      align-items: center;

      &:last-child {
        margin-right: 0;
      }
    }

    @include lg {
      display: flex;
      margin-right: 15px;
      justify-content: flex-end;
    }
  }

  &__social-block {
    display: flex;
    align-items: center;
    text-decoration: none;

    & span {
      font-size: 12px;
      line-height: 14px;
      color: $mid-blue;
      font-family: 'Panton_SemiBold';
    }

    & svg {
      margin-right: 7px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__info-title {
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 7px;
    @include lg {
      font-size: 18px;
      line-height: 30px;
      margin-bottom: 0;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
      margin-bottom: 5px;
    }
  }

  &__info-price {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    @include lg {
      margin-bottom: 12px;
    }
  }

  &__info-usd-price,
  &__info-btc-price {
    display: flex;
    justify-content: space-between;
  }

  &__usd-prise {
    font-size: 18px;
    line-height: 27px;
    font-family: 'Panton_Bold';
    color: $blue;
  }

  &__usd-currency {
    color: $black;
    font-family: 'Panton_SemiBold';
  }

  &__info-price-change {
    display: flex;
    align-items: center;
    @include md {
      display: none;
    }

    & svg {
      margin-left: 8px;
    }
  }

  &__info-price-change-value {
    font-size: 14px;
    line-height: 27px;
    color: $green;
    font-family: 'Panton_Bold';

    &.decrease {
      color: $red;
    }
  }

  &__info-price-change-percent {
    font-family: 'Panton_SemiBold';
    color: $black;
  }

  &__btc-prise {
    font-size: 14px;
    line-height: 27px;
    color: $ligth-blue;
    font-family: 'Panton_Bold';
  }

  &__btc-currency {
    font-family: 'Panton_SemiBold';
    color: $black;
  }

  &__additional {
    display: flex;
    flex-direction: column;
    // margin-bottom: 13px;
    @include md {
      display: none;
    }
  }

  &__additional-info-line {
    display: flex;
    width: 100%;
    margin-bottom: 11px;
  }

  &__additional-info-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 19px;

    & svg {
      margin-left: 3px;
    }
  }

  &__additional-info-white-space {
    flex-grow: 1;
    border-bottom: 1px dashed $gainsboro;
  }

  &__additional-info-value {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_Bold';
    color: $ligth-blue;
  }

  &__additional-info-percent {
    font-family: 'Panton_Bold';
    color: $black;
  }

  &__note {
    // display: none;
    margin-top: -5px;

    & p {
      margin: 7px 0 0;
      font-size: 14px;
      line-height: 22px;
      color: $fieldName;
      font-family: 'Panton_SemiBold';

      @include lg {
        margin-bottom: 0;
      }
    }

    @include xl {
      display: initial;
    }
  }

  &__link-icon {
    & svg {
      width: 17px;
      height: 15px;
    }
  }
}
</style>

<template>
  <div class="cat-page" :class="{ noCat: data.length > 2 }">
    <div class="cat-page__header" />
    <div class="cat-page__content">
      <closeIcon class="cat-page__close-icon" @click="$emit('close')" />
      <div class="cat-page__section">
        <div class="cat-page__cat-icon" v-if="data.length <= 1">
          <catIcon />
        </div>
        <div class="cat-page__info">
          <span class="cat-page__title">
            {{ $t('catPage.congratulations') }}!
          </span>
          <p class="cat-page__message">
            {{ $t('catPage.message') }}
          </p>
        </div>
      </div>
      <div v-if="data" class="cat-page__addresses">
        <template
          v-for="(wallet, index) in data"
          :key="`${wallet.address}_${wallet.net}`"
        >
          <div class="cat-page__address">
            <span class="cat-page__add-address">
              {{ $t('catPage.addedAddress') }}
            </span>
            <div class="cat-page__new-address">
              <div class="cat-page__icon">
                <component :is="icons[wallet.net]" />
              </div>
              <span class="cat-page__address-line">
                {{ wallet?.address }}
              </span>
            </div>
          </div>
          <div class="cat-page__input">
            <Input
              :id="`name-${index}`"
              v-model.trim="aliases[`${wallet.net}_${wallet.address}`]"
              :label="$t('catPage.inputLabel')"
              type="text"
              :icon="inputTypeIcon"
              :placeholder="walletTypePlaceholder"
              :data-qa="dataQa && `${dataQa}__cat-modal__alias-field`"
            />
          </div>
        </template>
      </div>
      <PrimaryButton :disabled="disabled" data-qa="Ok" @click="clickHandler">
        {{ $t('ok') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import { reactive, markRaw, ref } from 'vue';
import { useStore } from 'vuex';
import closeIcon from '@/assets/icons/close-icon.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import catIcon from '@/assets/icons/cat-icon.svg';
import { INPUT_TYPE_ICON } from '@/config/newWallets';
import { findAddressWithNet } from '@/helpers';

export default {
  name: 'CatPage',
  components: { catIcon, Input, PrimaryButton, closeIcon },
  props: {
    showModal: {
      type: Boolean,
    },
    data: {
      type: Array,
      default: () => [],
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
    walletTypePlaceholder: {
      type: String,
      default: 'Citadel One-Seed',
    },
    inputTypeIcon: {
      type: String,
      default: INPUT_TYPE_ICON.SEED,
    },
  },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const disabled = ref(false);
    const store = useStore();
    const aliases = reactive({});
    const icons = reactive({});
    props.data.map((wallet) => {
      aliases[`${wallet.net}_${wallet.address}`] = '';
      import(`@/assets/icons/token/${wallet?.net}.svg`).then((val) => {
        icons[wallet?.net] = markRaw(val.default);
      });
    });

    const clickHandler = async () => {
      disabled.value = true;
      await Promise.all(
        props.data.map(async (wallet) => {
          if (!aliases[`${wallet.net}_${wallet.address}`]?.length) {
            return false;
          }
          await store.dispatch('wallets/renameWalletTitle', {
            walletId: findAddressWithNet(store.getters['wallets/wallets'], {
              address: wallet.address,
              net: wallet.net,
            })?.id,
            title: aliases[`${wallet.net}_${wallet.address}`],
          });
          return true;
        })
      );
      // if (renamed.filter((w) => w).length) {
      //   store.dispatch('wallets/getNewWallets','lazy');
      // }
      emit('buttonClick');
      disabled.value = false;
    };

    return { aliases, disabled, clickHandler, icons };
  },
};
</script>

<style lang="scss" scoped>
.noCat {
  max-height: 85%;
  @include lg {
    .cat-page__section {
      padding-bottom: 19px;
    }
    .cat-page__cat-icon {
      display: none;
    }
    .cat-page__title {
      font-size: 20px;
      margin-bottom: 2px;
    }
    .cat-page__content {
      padding: 26px 40px 40px 38px;
    }
    .cat-page__addresses {
      max-height: 332px;
    }
  }
}

.cat-page {
  width: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  background: $white;

  &__header {
    min-height: 16px;
    background: $ligth-blue;
    border-radius: 16px 16px 0 0;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 64px 40px 40px 38px;
    align-items: center;
    position: relative;
    overflow: hidden;
    @include lg {
      padding: 37px 40px 40px 38px;
    }
    @include md {
      padding: 39px 44px 40px 34px;
    }
  }

  &__close-icon {
    position: absolute;
    right: 39px;
    top: 30px;
    cursor: pointer;
    width: 16px;
    height: 16px;

    &:hover {
      fill: $dark-blue;
    }
  }

  &__cat-icon {
    margin-right: 26px;

    & svg {
      width: 154px;
      height: 160px;
    }

    @include lg {
      & svg {
        width: 92px;
        height: 96px;
      }
    }

    @include md {
      & svg {
        width: 80px;
        height: 80px;
      }
    }
  }

  &__section {
    display: flex;
    border-bottom: 1px dashed $lightsteelblue;
    padding-bottom: 44px;
    margin-bottom: 15px;
    align-items: center;

    @include lg {
      padding-bottom: 25px;
    }

    @include md {
      padding-bottom: 19px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__title {
    font-size: 30px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include lg {
      margin-bottom: 10px;
    }
    @include md {
      font-size: 20px;
    }
  }

  &__message {
    font-size: 14px;
    line-height: 22px;
    color: $mid-blue;
    margin: 0;
  }

  &__addresses {
    width: calc(100% + 40px);
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 20px;
    margin-bottom: 20px;
    max-height: 292px;
    @include lg {
      max-height: 292px;
    }
    @include md {
      max-height: 261px;
    }
  }

  &__address {
    display: flex;
    width: 100%;
  }

  &__add-address {
    font-family: 'Panton_Light';
    font-size: 14px;
    line-height: 30px;
    color: $gray;
    margin-right: 20px;
  }

  &__new-address {
    flex-grow: 1;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  &__icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $dark-blue;
    border-radius: 5px;
    margin-right: 18px;

    & svg {
      fill: $white;
    }
  }

  &__address-line {
    font-size: 14px;
    line-height: 25px;
    font-family: 'Panton_Light';
  }

  &__input {
    width: 100%;
    height: 68px;
    margin-bottom: 32px;
    @include lg {
      margin-bottom: 16px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }
}
</style>

<template>
  <div class="subscriptions">
    <div class="subscriptions__info">
      <div class="subscriptions__title">
        {{ $t('settings.subscriptions.title') }}
      </div>
      <div class="subscriptions__desc">
        {{ $t('settings.subscriptions.description') }}
      </div>
      <div class="subscriptions__select">
        <Checkbox
          id="rewardDigest"
          :value="profileInfo.subscribe_rewards"
          :label="$t('settings.subscriptions.rewardsDigest')"
          :info="$t('settings.subscriptions.rewardsDigestTooltip')"
          :disabled="isRewardDisabled"
          @change="changeSubscriptionState"
        />
      </div>
      <SyncExtension
        v-if="global.citadel && isPasswordHash"
        class="subscriptions__sync"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import Checkbox from '@/components/UI/Checkbox';
import notify from '@/plugins/notify';
import SyncExtension from './SyncExtension';

const FREEZE_DURATION = 5000;

export default {
  name: 'Subscriptions',
  components: { Checkbox, SyncExtension },
  props: {},
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const profileInfo = computed(() => store.getters['profile/info']);
    const isPasswordHash = computed(() => store.getters['crypto/passwordHash']);
    const isRewardDisabled = ref(false);

    const global = computed(() => window);

    const changeSubscriptionState = async (newValue) => {
      isRewardDisabled.value = true;

      await store.dispatch('profile/changeSubscribeRewards', newValue);

      setTimeout(() => {
        isRewardDisabled.value = false;
      }, FREEZE_DURATION);

      const type = newValue ? 'success': 'info';
      const text = newValue
        ? t('settings.subscriptions.addRewardsNotification')
        : t('settings.subscriptions.removeRewardsNotification');

      notify({
        type,
        text,
        duration: FREEZE_DURATION,
      });
    };

    return {
      global,
      isPasswordHash,
      profileInfo,
      isRewardDisabled,
      changeSubscriptionState,
    };
  },
};
</script>

<style lang="scss" scoped>
.subscriptions {
  height: 100%;
  min-width: 150px;
  padding: 40px 45px;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  @include lg {
    padding: 30px 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 22px 29px 30px;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include md {
      margin-bottom: 4px;
    }
  }

  &__sync {
    width: 100%;
  }

  &__desc {
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    margin-bottom: 16px;
    @include lg {
      font-size: 14px;
      line-height: 24px;
    }
    @include md {
      font-size: 14px;
      line-height: 24px;
    }
  }
}
</style>

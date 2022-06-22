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

        <Checkbox
          id="newsletter"
          :value="profileInfo.subscribe_newsletter"
          :label="$t('settings.subscriptions.newsletter')"
          :info="$t('settings.subscriptions.newsletterTooltip')"
          :disabled="true"
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

      const type = newValue ? 'success' : 'info';
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
  min-width: 150px;
  padding: $card-padding;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: $card-border-radius;

  &__title {
    @include title-default;
  }

  &__sync {
    width: 100%;
  }

  &__desc {
    @include text-default;
    margin-bottom: 16px;
  }
  &__select {
    display: flex;
    flex-direction: column;
    & > div:not(:last-child) {
      margin-bottom: 15px;
    }
  }
}
</style>

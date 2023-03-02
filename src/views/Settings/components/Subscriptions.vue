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
          :value="subscriptions.rewardsDigest"
          :label="$t('settings.subscriptions.rewardsDigest')"
          :info="$t('settings.subscriptions.rewardsDigestTooltip')"
          :disabled="profileInfo.login ? isDisabled.rewardsDigest : true"
          @change="changeSubscriptionState('rewardsDigest')"
        />

        <Checkbox
          id="newsletter"
          :value="subscriptions.newsletter"
          :label="$t('settings.subscriptions.newsletter')"
          :info="$t('settings.subscriptions.newsletterTooltip')"
          :disabled="profileInfo.login ? isDisabled.newsletter : true"
          @change="changeSubscriptionState('newsletter')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import Checkbox from '@/components/UI/Checkbox';
import notify from '@/plugins/notify';

const FREEZE_DURATION = 5000;

export default {
  name: 'Subscriptions',
  components: { Checkbox },
  props: {},
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const subscriptions = ref({
      rewardsDigest: false,
      newsletter: false,
    });

    const isDisabled = ref({
      rewardsDigest: false,
      newsletter: false,
    });

    const profileInfo = computed(() => store.getters['profile/info']);

    if (profileInfo.value.login) {
      store.dispatch('subscriptions/getSubscriptions').then(() => {
        subscriptions.value = store.getters['subscriptions/subscriptions'];
      });
    }

    const changeSubscriptionState = async (key) => {
      const msg = key == 'rewardsDigest' ? 'Rewards' : 'Newsletter';

      subscriptions.value[key] = !subscriptions.value[key];
      isDisabled.value[key] = true;

      await store.dispatch('subscriptions/updateSubscriptions', {
        ...subscriptions.value,
      });

      setTimeout(() => {
        isDisabled.value[key] = false;
      }, FREEZE_DURATION);

      const type = subscriptions.value[key] ? 'success' : 'info';

      const text = subscriptions.value[key]
        ? t(`settings.subscriptions.add${msg}Notification`)
        : t(`settings.subscriptions.remove${msg}Notification`);

      notify({
        type,
        text,
        duration: FREEZE_DURATION,
      });
    };

    return {
      profileInfo,
      subscriptions,
      isDisabled,
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

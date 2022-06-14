<template>
  <div class="app-info">
    <div class="main-info">
      <div class="column">
        <div class="rows">
          <div class="column">
            <div class="title">
              {{ $t('extensions.networks') }}
            </div>
            <Networks :coins="app.networks" />
          </div>
          <div class="column mt-20">
            <div class="title">
              {{ $t('extensions.description') }}
            </div>
            <div
              class="description"
              v-html="app.description.replaceAll('\n', '<br>')"
            />
          </div>
        </div>
      </div>
      <div v-if="app.url_video" class="column mt-20">
        <div class="title">
          {{ $t('extensions.guide') }}
        </div>
        <div class="video">
          <iframe
            :src="app.url_video"
            frameBorder="0"
            width="100%"
            height="450"
            align="left"
            class="extensions__frame"
          />
        </div>
      </div>
    </div>
    <div v-if="app.what_you_can" class="main-info mt-15">
      <div class="column">
        <div class="title">
          {{ $t('extensions.youCan') }}
        </div>
        <YouCan :items="[app.what_you_can]" />
      </div>
    </div>
    <PrimaryButton
      class="launch-btn"
      :style="{ marginTop: '20px' }"
      @click="$emit('launchApp', { app })"
    >
      {{ $t('extensions.launch') }}
    </PrimaryButton>
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';
import Networks from './Networks';
import YouCan from './YouCan';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'AppInfo',
  components: { Networks, YouCan, PrimaryButton },
  props: {
    app: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: '#00A3FF',
    },
  },
  setup() {
    const successIcon = ref();

    import(`@/assets/icons/extensions/success.svg`).then((val) => {
      successIcon.value = markRaw(val.default);
    });

    return {
      successIcon,
    };
  },
};
</script>
<style scoped lang="scss">
.app-info {
  width: 900px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 25px 40px 0;
  box-sizing: border-box;

  .launch-btn {
    margin: 0 auto;
  }

  .main-info {
    display: flex;
    flex-direction: column; // SOMETIMES
    justify-content: space-between;

    .extensions__frame {
      border-radius: 12px;
    }

    &.mt-15 {
      margin-top: 15px;
    }

    .column {
      display: flex;
      flex-direction: column;

      &.mt-20 {
        margin-top: 20px;
        margin-bottom: 20px;
      }

      .rows {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
      }

      .title {
        margin-bottom: 15px;
        font-family: 'Panton_SemiBold';
        font-size: 20px;
        color: $black;
      }

      .description {
        width: 100%;
        font-family: 'Panton_Regular';
        line-height: 24px;
        font-size: 14px;
        color: #6b758e;
      }
    }
  }
}
</style>

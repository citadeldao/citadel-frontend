<template>
  <div class="app-info">
    <div class="main-info">
      <div class="column">
        <div class="rows">
          <div class="column">
            <div class="title">
              <div v-if="showAllNetworks" class="networks-wrap">
                <div
                  v-for="(network, ndx) in app.networks.slice(6)"
                  :key="ndx"
                  class="network-item"
                >
                  {{
                    $store.getters['networks/configByNet'](
                      network.toLowerCase()
                    ).name
                  }}
                </div>
              </div>
              <div class="label">{{ $t('extensions.networks') }}</div>
              <span
                v-if="app.networks.length > 6"
                class="showmore"
                @mouseover="onMouseOver"
                @mouseleave="onMouseLeave"
              >
                {{ $t('extensions.showMore') }}
              </span>
            </div>
            <Networks :coins="app.networks" />
          </div>
          <div class="column mt-20">
            <div class="title">
              <div class="label">{{ $t('extensions.description') }}</div>
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
          <div class="label">{{ $t('extensions.guide') }}</div>
        </div>
        <div class="video">
          <iframe
            :src="app.url_video"
            frameBorder="0"
            width="100%"
            height="350"
            align="left"
            class="extensions__frame"
          />
        </div>
      </div>
    </div>
    <div v-if="app.what_you_can" class="main-info mt-15">
      <div class="column">
        <div class="title">
          <div class="label">{{ $t('extensions.youCan') }}</div>
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
    const showAllNetworks = ref(false);

    import(`@/assets/icons/extensions/success.svg`).then((val) => {
      successIcon.value = markRaw(val.default);
    });

    const onMouseOver = () => {
      showAllNetworks.value = true;
    };

    const onMouseLeave = () => {
      showAllNetworks.value = false;
    };

    return {
      successIcon,
      showAllNetworks,
      onMouseOver,
      onMouseLeave,
    };
  },
};
</script>
<style scoped lang="scss">
.app-info {
  width: 600px;
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
        position: relative;
        width: 500px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;

        .networks-wrap {
          position: absolute;
          z-index: 10;
          right: 0;
          top: 30px;
          background: #ffffff;
          box-shadow: 0px 4px 25px rgba(63, 54, 137, 0.25);
          border-radius: 6px;
          width: 287px;
          display: flex;
          flex-wrap: wrap;
          min-height: 135px;
          max-height: 320px;
          padding: 10px;
          box-sizing: border-box;

          .network-item {
            width: 130px;
            color: #0a2778;
            font-size: 12px;
            display: flex;
            align-items: center;
            margin: 5px 0;

            &:before {
              content: '';
              display: inline-block;
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background: #0a2778;
              margin: 0 10px;
            }
          }
        }

        .label {
          font-family: 'Panton_SemiBold';
          font-size: 20px;
          color: $black;
        }

        .showmore {
          color: #54478f;
          font-size: 14px;
          border-bottom: 1px dashed #54478f;
          cursor: pointer;
        }
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

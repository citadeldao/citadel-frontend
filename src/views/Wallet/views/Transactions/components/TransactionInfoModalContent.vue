<template>
  <div class="transaction-info-modal-content">
    <TxStatuses :info="info" :current-wallet="currentWallet" />
    <InfoBlock :current-wallet="currentWallet" :info="info" />
    <div v-if="info.view" class="inner-tx">
      <!-- MAIN STRUCTURE AND INNER, WHEN COMPONENTS IN CHILD -->
      <!-- [, innerTxs] -->
      <div
        v-for="(struct, indexStruct) in [info.view.filter(filterTypeMethod)]"
        :key="indexStruct"
      >
        <!-- <div v-if="indexStruct > 0 && struct.length" class="nested">
          Nested transactions:
        </div> -->
        <div
          v-for="(item, ndx) in struct"
          :key="ndx"
          :class="{ empty: !item.components?.length }"
          class="inner-tx__view-item"
        >
          <template v-if="item.components">
            <div
              :class="{
                empty: !item.components?.length,
                last: info.view.length - 1 === ndx,
              }"
              class="icon-type"
            >
              <img width="32" height="32" :src="item.icon" />
              <div>{{ item.type }}</div>
            </div>
            <div
              v-for="(component, n) in item.components"
              :key="n"
              :class="{ included: component.type === 'included_tx' }"
              class="inner-tx__view-item-component"
            >
              <div
                v-if="
                  !['amount_collection', 'text_collection'].includes(
                    component.type
                  )
                "
                class="title"
              >
                {{ component.title }}
              </div>
              <div
                v-if="
                  !['amount_collection', 'text_collection'].includes(
                    component.type
                  )
                "
                class="line"
              />
              <div v-if="component.type === 'amount'" class="value">
                <div class="value-amount">{{ component.value.text }}</div>
                <div class="value-symbol">{{ component.value.symbol }}</div>
              </div>
              <div v-if="component.type === 'text'" class="value">
                <div class="value-amount">{{ component.value }}</div>
              </div>
              <div v-if="component.type === 'dateTime'" class="value">
                <div class="value-amount">
                  {{ format(new Date(component.value), 'yyyy/MM/dd hh:mm:ss') }}
                </div>
              </div>
              <div v-if="component.type === 'textWithURL'" class="value">
                <a target="_blank" :href="component.value.url">{{
                  component.value.text
                }}</a>
              </div>
              <!-- structure in type -->
              <div
                v-if="component.type === 'amount_collection'"
                class="flex-value"
              >
                <div
                  v-for="(componentInner, key) in component.value"
                  :key="key"
                  class="inner-tx__view-item-component-flex"
                >
                  <div class="value">
                    <div class="value-symbol">
                      {{ componentInner.symbol }}
                    </div>
                    <div class="title">{{ componentInner.text }}</div>
                  </div>
                </div>
              </div>
              <!-- text_collection -->
              <div
                v-if="component.type === 'text_collection'"
                class="flex-value"
              >
                <div
                  v-for="(componentInner, key) in component.value"
                  :key="key"
                  class="inner-tx__view-item-component-flex"
                >
                  <div class="value">
                    <div class="value-symbol">
                      {{ componentInner.text }}
                    </div>
                    <div class="title">{{ componentInner.weight }}</div>
                  </div>
                </div>
              </div>
              <!-- included_tx -->
              <div v-if="component.type === 'included_tx'" class="included_tx">
                <div
                  v-for="(componentInner, key) in component.value"
                  :key="key"
                  class="inner-tx__view-item-component-flex included"
                >
                  <!-- icon -->
                  <div
                    :class="{
                      empty: !componentInner.components?.length,
                    }"
                    class="icon-type-included"
                  >
                    <img width="32" height="32" :src="componentInner.icon" />
                    <div>{{ componentInner.type }}</div>
                  </div>
                  <div
                    v-for="(includedItem, ndx) in componentInner.components"
                    :key="ndx"
                    class="included-components"
                  >
                    <div class="included-components__row">
                      <div class="label">{{ includedItem.title }}</div>
                      <div class="line" />
                      <div v-if="includedItem.type === 'textWithURL'">
                        <a target="_blank" :href="includedItem.value.url">
                          {{ includedItem.value.text }}
                        </a>
                      </div>
                      <div
                        v-if="includedItem.type === 'amount'"
                        class="value-hint"
                      >
                        <span
                          v-pretty-number="{
                            value: includedItem.value.text,
                            currency: includedItem.value.symbol,
                          }"
                          class="value-amount"
                        />
                        <span class="value-symbol">
                          {{ formatedValueSymbol || currentWallet?.code }}
                        </span>
                        <!-- <div class="value-amount">
                          {{ includedItem.value.text }}
                        </div>
                        <div class="value-symbol">
                          {{ includedItem.value.symbol }}
                        </div>-->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import InfoBlock from './InfoBlock.vue';
import TxStatuses from './TxStatuses';
import { format } from 'date-fns';

export default {
  namae: 'TransactionInfoModalContent',
  components: {
    InfoBlock,
    TxStatuses,
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    txComment: {
      type: String,
    },
  },
  setup(props) {
    const showPlaceholder = ref(!props.info.note);
    const innerTxs = ref([]);
    const innerTxsTypes = ['included_tx'];

    const togleShowPlaceholder = () => {
      showPlaceholder.value = false;
    };

    const filterTypeMethod = (view) =>
      !view?.type.toLowerCase().includes('acknowledgement');

    props.info?.view?.forEach((view) => {
      view.components.forEach((component) => {
        if (innerTxsTypes.includes(component.type)) {
          innerTxs.value = innerTxs.value.concat(component.value);
        }
      });
    });

    onMounted(() => {
      togleShowPlaceholder();
    });

    return {
      filterTypeMethod,
      showPlaceholder,
      togleShowPlaceholder,
      format,
      innerTxs,
    };
  },
};
</script>

<style lang="scss" scoped>
$blue-dark: #262b61;

.transaction-info-modal-content {
  padding-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .included_tx {
    width: 100%;

    .value-hint {
      display: flex;
      align-items: center;
      margin-bottom: 0;

      .value-amount {
        font-size: 13px;
        margin-right: 5px;
        color: $dark-blue;
        font-family: 'Panton_Bold';
        word-break: break-all;
        text-align: right;
        padding-left: 1px;
      }

      .value-symbol {
        font-size: 13px;
        color: $blue-dark;
      }
    }

    a {
      color: $blue-dark;
      text-decoration: none;
      font-size: 13px;

      &:hover {
        color: $blue-dark;
        cursor: pointer;
      }
    }
  }

  .inner-tx {
    margin-top: 25px;

    .nested {
      display: inline-block;
      margin-bottom: 5px;
      border-bottom: 1px dashed $black;
      font-weight: 700;
    }

    &__view {
      margin-top: 10px;
    }

    &__view-item {
      position: relative;
      margin-top: 50px;
      margin-bottom: 15px;
      background: #f0f3fd;
      border-radius: 8px;
      padding: 16px;
      box-sizing: border-box;

      &.empty {
        min-height: 40px;
        background: transparent;
      }

      .icon-type-included {
        align-items: center;
        display: flex;

        div {
          margin-left: 10px;
        }
      }

      .icon-type {
        display: flex;
        align-items: center;
        position: absolute;
        left: 0;
        top: -44px;

        &.empty {
          top: 0;

          &.last {
            top: -5px;
          }
        }

        img {
          // margin-bottom: 10px;
        }

        div {
          margin-left: 10px;
        }
      }

      &.empty {
        border: none;
        padding: 0;
        margin: 10px 0;
      }

      .title {
        color: #6b93c0;
      }

      .flex-value {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }

      .value {
        display: flex;
        align-items: flex-start;
        margin-bottom: 7px;

        .value-amount {
          font-size: 13px;
          margin-right: 5px;
          color: $dark-blue;
          font-family: 'Panton_Bold';
          word-break: break-all;
          text-align: right;
          padding-left: 1px;
          min-width: 40px;
        }

        .value-symbol {
          font-size: 13px;
          color: $blue-dark;
          text-align: right;
          max-width: 95%;
          word-break: break-word;
        }

        a {
          color: $blue-dark;
          text-decoration: none;
          font-size: 13px;

          &:hover {
            color: $blue-dark;
            cursor: pointer;
          }
        }
      }
    }

    &__view-item-component {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      align-items: center;

      &.included {
        flex-direction: column;
        align-items: flex-start;
      }

      .title {
        font-size: 14px;
        margin-bottom: 7px;
      }

      .line {
        flex-grow: 1;
        border: 0.01rem dashed #c3ceeb;
        height: 1px;
      }

      .inner-tx__view-item-component-flex {
        flex-direction: column;
        display: flex;

        .included-components {
          display: flex;
          flex-direction: column;

          &__row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 5px;
          }

          box-sizing: border-box;
          padding-left: 25px;

          .line {
            flex-grow: 1;
            border: 0.01rem dashed #c3ceeb;
            height: 1px;
          }

          .label {
            color: #6b93c0;
            font-size: 14px;
          }
        }

        .value {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .value-symbol {
            font-size: 11px;
          }
        }
      }
    }
  }

  &__textarea {
    padding-top: 17px;
  }
  &__textarea-placeholder {
    cursor: pointer;
    padding-top: 41px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 180px;
    border: 1px dashed $too-ligth-blue;
    box-sizing: border-box;
    border-radius: 8px;
  }
  &__textarea-title {
    font-size: 18px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin-top: 13px;
    margin-bottom: 2px;
  }
  &__textarea-subtitle {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: $ligth-blue;
    font-family: 'Panton_SemiBold';
  }
  &__textarea-textarea {
    height: 120px;
  }
}
</style>

<template>
  <div
    class="member-item"
    :class="{ edited, active }"
    @click="$emit('editMember', member)"
  >
    <div :class="{ active }" class="member-item__name">
      {{ num }}) {{ member.name }}
    </div>
    <div class="member-item__amount">
      {{ member.amount.toFixed(4) }}
    </div>
    <div v-if="rateUsd && rateUsd != 0" class="member-item__amount">
      ~{{ (member.amount / rateUsd).toFixed(4) }}
      <span>{{ symbol }}</span>
    </div>
    <div class="member-item__address" @click.stop="() => {}">
      <a
        :href="`https://bscscan.com/address/${member.address}`"
        target="_blank"
        >{{ `${member.address.slice(0, 5)}...${member.address.slice(-5)}` }}</a
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'MemberItem',
  props: {
    member: {
      default: {},
      required: true,
    },
    edited: {
      type: Boolean,
    },
    active: {
      type: Boolean,
    },
    symbol: {
      required: true,
    },
    rateUsd: {
      required: true,
    },
    num: {
      type: Number,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 25px;
  border-radius: 4px;
  border-bottom: 1px dashed #c3ceeb47;
  box-sizing: border-box;
  padding: 4px 10px;
  width: 100%;
  margin-bottom: 1px;

  &.active {
    background: linear-gradient(255.4deg, #f0f2fc 0%, #edf2fc 100%);
    border-bottom: 1px dashed #edf2fc;
  }

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    width: 35%;
    color: #6d7885;

    &.active {
      // color: #20ab20;
    }
  }

  &__amount {
    font-size: 14px;
    width: 30%;
    color: $dark-blue;

    span {
      color: $mid-blue;
      font-weight: 700;
    }
  }

  &__address {
    font-size: 12px;
    width: 30%;
    text-align: right;

    a {
      text-decoration: none;
      color: $mid-blue;
    }
  }
}
</style>

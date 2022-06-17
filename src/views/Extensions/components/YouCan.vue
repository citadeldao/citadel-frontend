<template>
  <div class="youcan-items">
    <div v-for="(item, ndx) in items" :key="ndx" class="item">
      <div class="point" />
      {{ item }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'YouCan',
  props: {
    items: {
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.youcan-items {
  display: flex;
  flex-direction: column;

  .item {
    display: flex;
    align-items: center;
    color: #6b758e;
    font-size: 14px;
    font-family: 'Panton_Regular';
    margin-bottom: 13px;

    .point {
      margin-right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgb(224, 101, 50);
    }
  }
}
</style>

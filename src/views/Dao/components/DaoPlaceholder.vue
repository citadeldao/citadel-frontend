<template>
  <div class="dao-placeholder">
    <h2 class="dao-placeholder__title">
      {{ $t("DAO.placeholderTitle") }}
    </h2>
    <p class="dao-placeholder__info">
      {{ $t("DAO.placeholderInfo") }}
    </p>
    <daoPlaceholderIcon />
  </div>
</template>

<script>
import daoPlaceholderIcon from '@/assets/icons/daoPlaceholderIcon.svg';
export default {
  name: 'DaoPlaceholder',
  components: { daoPlaceholderIcon },
  setup() {},
};
</script>

<style lang="scss" scoped>
.dao-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__title {
    margin: 0;
    font-family: "Panton_Bold";
    font-size: 30px;
    line-height: 30px;
    margin-top: 104px;
    margin-bottom: 17px;
  }
  &__info {
    margin: 0;
    font-size: 18px;
    line-height: 30px;
    color: $mid-blue;
    width: 617px;
    text-align: center;
    margin-bottom: 29px;
  }
}
</style>
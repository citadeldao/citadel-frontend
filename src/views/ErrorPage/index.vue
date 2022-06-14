<template>
  <div class="error-page">
    <error404 />
    <span>{{ $t('errorPage.pageNotFound') }}</span>
    <PrimaryButton @click="toHomepage">
      {{ $t('errorPage.toHomePage') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import error404 from '@/assets/icons/error-404.svg';
import { useRouter } from 'vue-router';
export default {
  name: 'ErrorPage',
  components: { error404, PrimaryButton },
  setup() {
    const router = useRouter();
    const toHomepage = () => {
      router.push({ name: 'HomePage' });
    };

    return { toHomepage };
  },
};
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100vh;
  background: $gray-gradient;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & svg {
    margin-bottom: 47px;
  }
  & span {
    font-size: 55px;
    line-height: 66px;
    text-align: center;
    font-family: 'Panton_Bold';
    margin-bottom: 42px;
  }
}
</style>

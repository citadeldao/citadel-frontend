<template>
  <div
    v-if="socials"
    class="links"
  >
    <a
      v-if="socials.web"
      class="links__item"
      :title="socials.web.title"
      :href="socials.web.href"
      target="_blank"
    >
      <web />
      <span>{{ socials.web.title }}</span>
    </a>
    <a
      v-if="socials.twitter"
      class="links__item"
      :title="socials.twitter.title"
      :href="`https://twitter.com/${socials.twitter.href}`"
      target="_blank"
    >
      <twitter />
      <span>{{ socials.twitter.title }}</span>
    </a>
    <a
      v-if="socials.landing"
      class="links__item"
      :title="socials.landing.title"
      :href="socials.landing.href"
      target="_blank"
    >
      <linkIcon class="link-icon" />
      <span>{{ socials.landing.title }}</span>
    </a>
  </div>
</template>

<script>
import web from '@/assets/icons/web.svg';
import twitter from '@/assets/icons/twitter.svg';
import linkIcon from '@/assets/icons/link.svg';

export default {
  name: 'NetworkInfoExpand',
  components: {
    web,
    twitter,
    linkIcon,
  },
  props: {
    socials: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.links {
  display: flex;
  justify-content: space-between;
  padding: 17px 0;
  border-bottom: 1px solid $too-ligth-blue;
  border-top: 1px solid $too-ligth-blue;
  margin-bottom: 29px;
  @include lg {
    padding: 0;
    margin-bottom: 0;
    border-bottom: none;
    border-top: none;
  }
  @include md {
    padding: 0;
    margin-bottom: 0;
    border-bottom: none;
    border-top: none;
  }
  &__item {
    display: flex !important;
    align-items: center;
    text-decoration: none;

    @include lg {
      margin-right: 25px;
    }
    @include md {
      margin-right: 25px;
    }
    & span {
      font-size: 12px;
      line-height: 14px;
      color: $mid-blue;
      font-family: 'Panton_SemiBold';
    }
    & svg {
      margin-right: 7px;
    }
  }
}
.link-icon{
  width: 17px;
  height: 15px;
}
</style>

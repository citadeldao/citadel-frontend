<template>
  <teleport to="body">
    <Modal>
      <ModalContent
        v-click-away="onClose"
        :submit-button="false"
        @close="onClose"
      >
        <div class="container">
          <div class="container__title">
            {{ $t('login.whyEmailTitle') }}
          </div>
          <div class="container__description">
            {{ $t('login.whyEmailDescription') }}
          </div>
          <div class="container__description bold m-tb-10">
            {{ $t('login.whyEmailDescription1') }}
          </div>
          <div class="container__description">
            <span>1.</span> {{ $t('login.whyEmailMarker1') }}
          </div>
          <div class="container__description">
            <span>2.</span> {{ $t('login.whyEmailMarker2') }}
          </div>
          <div class="container__description bold m-tb-10">
            {{ $t('login.whyEmailDescription3') }}
            <a
              target="_blank"
              href="https://medium.com/citadel-one/how-to-log-in-to-citadel-one-anonymously-d1e0ce1d16a3?source=social.tw&_branch_match_id=1039967211630176618&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXz8nMy9bLTU3JLM3VS87P1TdxTc8wNy038c9PAgD5YVioIwAAAA%3D%3D"
              ><span class="guide">{{ $t('login.guide') }}</span></a
            >
          </div>
        </div>
      </ModalContent>
    </Modal>
  </teleport>
</template>
<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';

export default {
  name: 'WhyCitadel',
  components: { Modal, ModalContent },
  emits: ['close'],
  setup(_, { emit }) {
    const onClose = () => {
      emit('close');
    };

    return {
      onClose,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  &__title {
    color: $black;
    font-size: 20px;
    font-family: Panton_SemiBold;
    text-align: left;
    margin-bottom: 10px;
  }

  &__description {
    font-size: 15px;
    font-family: Panton_Regular;
    color: $mid-blue;
    line-height: 30px;

    a {
      text-decoration: none;
    }

    span {
      font-family: Panton_SemiBold;
      color: $dark-blue;

      &.guide {
        font-family: Panton_Bold;
        color: rgb(69, 152, 235);

        &:hover {
          cursor: pointer;
        }
      }
    }

    &.bold {
      font-family: Panton_Bold;
    }
  }

  .m-tb-10 {
    margin: 10px 0;
  }
}

body.dark {
  .container {
    &__title {
      color: $white;
    }
  }
}
</style>

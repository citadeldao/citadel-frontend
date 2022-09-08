<template>
  <div class="add-address">
    <div class="add-address__head">
      <BackButton
        class="back-btn"
        @click="$router.push({ name: 'AddAddress' })"
      />
      <div class="add-address__title">
        {{ $t('walletsAdding.importMenuTitle') }}
      </div>
      <div class="add-address__description">
        {{ $t('walletsAdding.mainMenuDescription') }}
      </div>
    </div>
    <div class="add-address__card-wrapper">
      <div class="add-address__card-type">
        <div class="head">
          <div class="title">
            {{ $t('walletsAdding.menuTypes.restoreTitle') }}
          </div>
          <div class="description">
            {{ $t('walletsAdding.menuTypes.restoreDescription') }}
          </div>
        </div>
        <div class="items">
          <AddressMenuItem
            v-if="!isUserMnemonic"
            :title="$t('walletsAdding.menuTypes.restoreOneSeed')"
            :description="
              $t('walletsAdding.menuTypes.restoreOneSeedDescription')
            "
            data-qa="Restore-one-seed"
            icon="restore"
            class="mb-20"
            @click="$router.push({ name: 'RestoreOneSeed' })"
          />
          <AddressMenuItem
            :title="$t('walletsAdding.menuTypes.importFile')"
            :description="$t('walletsAdding.menuTypes.importFileDescription')"
            data-qa="Import-file"
            icon="import"
            @click="$router.push({ name: 'ImportFile' })"
          />
        </div>
      </div>
      <div class="add-address__card-type">
        <div class="head">
          <div class="title">
            {{ $t('walletsAdding.menuTypes.importWallet') }}
          </div>
          <div class="description">
            {{ $t('walletsAdding.menuTypes.importDescription') }}
          </div>
        </div>
        <div class="items">
          <AddressMenuItem
            :title="$t('walletsAdding.menuTypes.seedPhrase')"
            :description="$t('walletsAdding.menuTypes.seedPhraseDescription')"
            data-qa="Seed-phrase"
            icon="seedphrase"
            @click="$router.push({ name: 'ImportSeedPhrase' })"
          />
          <AddressMenuItem
            :title="$t('walletsAdding.menuTypes.privateKey')"
            :description="$t('walletsAdding.menuTypes.privateKeyDescription')"
            data-qa="Private-key"
            icon="privatekey"
            class="mt-20"
            @click="$router.push({ name: 'ImportPrivateKey' })"
          />
        </div>
      </div>
      <div class="add-address__card-type">
        <div class="head">
          <div class="title">
            {{ $t('walletsAdding.menuTypes.externalWallet') }}
          </div>
          <div class="description">
            {{ $t('walletsAdding.menuTypes.externalDescription') }}
          </div>
        </div>
        <div class="items">
          <AddressMenuItem
            :title="$t('walletsAdding.menuTypes.metamaskKeplr')"
            :description="
              $t('walletsAdding.menuTypes.metamaskKeplrDescription')
            "
            data-qa="Metamask-Keplr"
            icon="metamaskkeplr"
            @click="$router.push({ name: 'MetamaskKeplr' })"
          />
          <AddressMenuItem
            :title="$t('walletsAdding.menuTypes.hardware')"
            :description="$t('walletsAdding.menuTypes.hardwareDescription')"
            data-qa="Hardware"
            icon="hardware"
            class="mt-20"
            @click="$router.push({ name: 'ImportHardwareWallet' })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddressMenuItem from './components/AddressMenuItem';
import useCreateWallets from '@/compositions/useCreateWallets';
import BackButton from '@/components/UI/BackButton';

export default {
  name: 'AddAddress',
  components: {
    AddressMenuItem,
    BackButton,
  },
  setup() {
    const { isUserMnemonic } = useCreateWallets();

    return { isUserMnemonic };
  },
};
</script>

<style lang="scss" scoped>
.add-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1140px;
  height: 100vh;
  position: relative;

  @include md {
    width: 100%;
  }

  &__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    .back-btn {
      position: absolute;
      left: 10px;
      top: 80px;
    }
  }

  &__title {
    margin-top: 70px;
    font-size: 34px;
    font-family: Panton_SemiBold;
    color: $black;
  }

  &__description {
    font-size: 14px;
    font-family: Panton_SemiBold;
    color: #6b93c0;
  }

  &__card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    // align-items: center;
    justify-content: space-between;
    margin-top: 31px;
    @include lg {
      margin-top: 30px;
    }
    @include md {
      margin-top: 16px;
    }
  }

  &__card-type {
    width: 30%;
    height: 511px;
    box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
    border-radius: 25px;
    background: $white;
    display: flex;
    flex-direction: column;
    align-content: center;
    box-sizing: border-box;
    padding: 36px 24px;

    .head {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 25px;

      .title {
        font-family: 'Panton_Bold';
        font-size: 28px;
        color: $dark-blue;
      }

      .description {
        margin-top: 5px;
        font-size: 15px;
      }
    }

    .items {
      .mt-20 {
        margin-top: 20px;
      }

      .mb-20 {
        margin-bottom: 20px;
      }
    }
  }
}

// @media (max-width: 1200px) {
//   .add-address {
//     .add-address__card-wrapper {
//       flex-wrap: wrap;
//       justify-content: flex-start;
//     }

//     .add-address__card-type {
//       width: 35%;
//       margin: 20px;
//     }
//   }
// }
</style>

<template>
  <div class="salary-report">
    <div class="field">
      <!-- <Input
        id="reportJson"
        v-model="reportJson"
        label="Report JSON"
        placeholder="Paste report json here"
        type="text"
        class="report-input"
        @input="onPasteJSON"
      /> -->
      <PrimaryButton>UPLOAD FILE</PrimaryButton>
      <input
        v-if="!file"
        data-qa="file-input"
        type="file"
        name="file-input"
        accept=".json"
        class="upload-input"
        @change="handleFileInput"
      />
    </div>
    <div class="salary-report__list">
      <div
        v-for="(report, ndx) in reportData"
        :key="ndx"
        class="salary-report__list-item"
      >
        <div
          v-for="(field, ndxreport) in Object.keys(report)"
          :key="ndxreport"
          class="field-item"
        >
          <div>
            <div v-if="ndx === 0" class="field-name">{{ field }}:</div>
            <div v-if="field === 'address'">
              {{ `${report[field].slice(0, 5)}...${report[field].slice(-5)}` }}
            </div>
            <div v-if="field === 'tx'">
              <a :href="report[field]" target="_blank">TX LINK</a>
            </div>
            <div v-if="!['address', 'tx'].includes(field)">
              {{ report[field] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="reportData?.length" class="salary-report__stat">
      Total: <span>{{ totalSum }} {{ tokenReport }}</span>
    </div>
  </div>
</template>
<script>
// import Input from '@/components/UI/Input';
import { ref, watch } from 'vue';
import notify from '@/plugins/notify';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'SalaryReportPreview',
  components: {
    // Input,
    PrimaryButton,
  },
  setup() {
    const reportJson = ref('');
    const reportData = ref(null);
    const file = ref(null);
    const totalSum = ref(0);
    const tokenReport = ref('');

    const removeFile = () => {
      file.value = null;
    };

    const onPasteJSON = (jsonStr) => {
      try {
        reportData.value = JSON.parse(jsonStr);
        console.log('reportData', reportData.value);
        if (
          reportData.value &&
          reportData.value.length &&
          reportData.value[0].rate
        ) {
          totalSum.value = reportData.value.reduce((prev, item) => {
            const values = (item.salary || item.sum).split(' ');
            tokenReport.value = values[1];
            return (prev += +values[0]);
          }, 0);
        } else {
          reportData.value = [];
          notify({
            type: 'warning',
            text: 'Incorrect json format',
          });
          removeFile();
          return;
        }
        removeFile();
      } catch (err) {
        reportData.value = [];
        notify({
          type: 'warning',
          text: 'Incorrect json format',
        });
        removeFile();
      }
    };

    const handleFileInput = (e) => {
      const [payload] = e.target.files;

      if (!payload?.name?.match(/.json$/)) {
        file.value = null;

        return;
      }

      file.value = payload;
    };

    const readFile = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        onPasteJSON(event.target.result);
      };

      reader.readAsText(file);
    };

    watch(
      () => file.value,
      (file) => {
        if (file) {
          readFile(file);
        }
      }
    );

    return {
      reportJson,
      reportData,
      onPasteJSON,
      handleFileInput,
      file,
      totalSum,
      tokenReport,
    };
  },
};
</script>
<style lang="scss" scoped>
.salary-report {
  display: flex;
  flex-direction: column;

  &__stat {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 700;

    span {
      color: $mid-blue;
    }
  }

  &__list {
    margin-top: 20px;
    overflow-y: auto;
    height: 320px;
  }

  &__list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 33px;
    font-size: 13px;

    &:first-child {
      margin-bottom: 12px;
    }

    .field-name {
      color: $black;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 5px;
      text-transform: capitalize;
    }

    .field-item {
      width: 100%;
      color: $mid-blue;

      a {
        text-decoration: none;
        border-bottom: 1px dashed $dark-blue;
        color: $dark-blue;
        width: 100%;
      }
    }
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 68px;
    margin-top: 15px;
    position: relative;

    .report-input {
      width: 80%;
      margin-right: 10px;
    }

    .upload-input {
      width: 20%;
      height: 68px;
      position: absolute;
      right: 0;
      top: 0;
      opacity: 0;
      z-index: 10;
      cursor: pointer;
    }
  }
}
</style>

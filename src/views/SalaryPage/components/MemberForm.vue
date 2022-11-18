<template>
  <div class="member-form">
    <div class="field">
      <Input
        id="memberName"
        :disabled="!!memberToEdit"
        v-model="name"
        label="Member"
        placeholder="Member name"
        type="text"
        @input="$emit('updateFormData', { name, amount, address })"
      />
    </div>
    <div class="field">
      <Input
        id="memberAmount"
        v-model="amount"
        label="Amount"
        placeholder="Amount"
        type="number"
        @input="$emit('updateFormData', { name, amount, address })"
      />
    </div>
    <div class="field">
      <Input
        id="memberAddress"
        v-model="address"
        label="Address"
        placeholder="BSC Address"
        type="text"
        @input="$emit('updateFormData', { name, amount, address })"
      />
    </div>
  </div>
</template>
<script>
import Input from '@/components/UI/Input';
import { ref, onMounted } from 'vue';

export default {
  name: 'MemberForm',
  props: {
    memberToEdit: {
      type: [Object, null],
      required: true,
    },
  },
  components: {
    Input,
  },
  setup(props, { emit }) {
    const name = ref('');
    const amount = ref('');
    const address = ref('');

    onMounted(() => {
      if (props.memberToEdit) {
        name.value = props.memberToEdit.name;
        amount.value = props.memberToEdit.amount;
        address.value = props.memberToEdit.address;
        emit('updateFormData', {
          name: name.value,
          amount: amount.value,
          address: address.value,
        });
      }
    });

    return {
      name,
      amount,
      address,
    };
  },
};
</script>
<style lang="scss" scoped>
.member-form {
  display: flex;
  flex-direction: column;
  width: 100%;

  .field {
    width: 100%;
    height: 68px;
    margin-top: 15px;
  }
}
</style>

<template>
    {{ ownerDetailsDialog }}
    <Dialog v-model:visible="ownerDetailsDialog" :style="{ width: '450px' }" header="Owner Details" :modal="true" class="p-fluid">
      <div class="field">
        <label htmlFor="name">Name</label>
        <InputText id="name" type="text" v-model="ownerDetails.name" autoFocus required :class="{ 'p-invalid': submitted && !ownerDetails.name }" />
      </div>
      <div class="field">
        <label htmlFor="contactnumber">Contact Number</label>
        <InputText id="contactnumber" type="text" v-model="ownerDetails.contactnumber" autoFocus required :class="{ 'p-invalid': submitted && !ownerDetails.contactnumber }" />
      </div>
      <div class="field">
        <label htmlFor="email">Email</label>
        <InputText id="email" type="text" v-model="ownerDetails.email" autoFocus required :class="{ 'p-invalid': submitted && !ownerDetails.email }" />
      </div>
      <div class="field">
        <label htmlFor="icno">IC no</label>
        <InputText id="icno" type="text" v-model="ownerDetails.icno" autoFocus required :class="{ 'p-invalid': submitted && !ownerDetails.icno }" />
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="$emit('hideDialog')" />
        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="$emit('saveOwnerDetails')" />
      </template>
    </Dialog>
    <Dialog v-model:visible="deleteOwnerDetailsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
      <div class="flex align-items-center justify-content-center">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="ownerDetails">Are you sure you want to delete <b>{{ ownerDetails.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="$emit('hideDeleteDialog')" />
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="$emit('delOwnerDetails')" />
      </template>
    </Dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const ownerDetailsDialog = ref(false);
  const deleteOwnerDetailsDialog = ref(false);
  const ownerDetails = ref({});
  const submitted = ref(false);
  </script>
  
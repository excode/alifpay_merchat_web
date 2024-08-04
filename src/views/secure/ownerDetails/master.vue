<template>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <TableList
            :ownerDetailss="ownerDetailss"
            :totalRecords="totalRecords"
            :totalpages="totalpages"
            :loading="loading"
            :row="row"
            :filters="filters"
            @openNew="openNew"
            @exportCSV="exportCSV"
            @getNewData="getNewData"
            @editOwnerDetails="editOwnerDetails"
            @confirmDeleteOwnerDetails="confirmDeleteOwnerDetails"
          />
          <OwnerDetailsForm
          v-model:ownerDetailsDialog="ownerDetailsDialog"
          v-model:deleteOwnerDetailsDialog="deleteOwnerDetailsDialog"
           
            :ownerDetails="ownerDetails"
            :submitted="submitted"
         
            @hideDialog="hideDialog"
            @saveOwnerDetails="saveOwnerDetails"
            @hideDeleteDialog="hideDeleteDialog"
            @delOwnerDetails="delOwnerDetails"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeMount } from 'vue';
  import { storeToRefs } from 'pinia';
  import { FilterMatchMode ,FilterOperator} from 'primevue/api';
  import { useOwnerDetailsStore } from '@/stores/modules/OwnerDetails';
  import { useLoginStore } from '@/stores/modules/Login';
  import TableList from './list.vue';
  import OwnerDetailsForm from './form.vue';
  
  const { ownerDetailss, error, curdLoading, loading, totalpages, page, totalRecords } = storeToRefs(useOwnerDetailsStore());
  const { getOwnerDetails, updateOwnerDetailsValue, addOwnerDetails, updateOwnerDetails, deleteOwnerDetails } = useOwnerDetailsStore();
  const { userInfo } = storeToRefs(useLoginStore());
  const { getUserInfo } = useLoginStore();
  
  const ownerDetailsDialog = ref(false);
  const deleteOwnerDetailsDialog = ref(false);
  const ownerDetails = ref({});
  const submitted = ref(false);
  const filters = ref({});
  const row = ref(10);
  
  onBeforeMount(() => {
    initFilters();
  });
  onMounted(async () => {
    await getOwnerDetails();
    getUserInfo();
  });
  
  const openNew = () => {
    alert(ownerDetailsDialog.value)
    let emptyOwnerDetails = {
      name: '',
      contactnumber: '',
      email: '',
      icno: '',
    };
    ownerDetails.value = emptyOwnerDetails;
    submitted.value = false;
    ownerDetailsDialog.value = true;
  };
  
  const hideDialog = () => {
    ownerDetailsDialog.value = false;
    submitted.value = false;
  };
  
  const saveOwnerDetails = async () => {
    submitted.value = true;
    const validationErrors = validateForm(ownerDetails.value, validation);
    if (validationErrors.length == 0) {
      if (ownerDetails.value.id) {
        await updateOwnerDetails(ownerDetails.value);
        if (!error.value) {
          toast.add({ severity: 'success', summary: 'Successful', detail: 'Owner Details Updated', life: 3000 });
        }
      } else {
        await addOwnerDetails({ ...ownerDetails.value, createdby: userInfo.value.username });
        if (!error.value) {
          toast.add({ severity: 'success', summary: 'Successful', detail: 'Owner Details Created', life: 3000 });
        }
      }
      hideDialog();
    }
  };
  
  const editOwnerDetails = ownerDetailsData => {
    ownerDetails.value = { ...ownerDetailsData };
    ownerDetailsDialog.value = true;
  };
  
  const confirmDeleteOwnerDetails = ownerDetailsData => {
    ownerDetails.value = ownerDetailsData;
    deleteOwnerDetailsDialog.value = true;
  };
  
  const hideDeleteDialog = () => {
    deleteOwnerDetailsDialog.value = false;
  };
  
  const delOwnerDetails = async () => {
    await deleteOwnerDetails(ownerDetails.value.id);
    if (!error.value) {
      deleteOwnerDetailsDialog.value = false;
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Owner Details Deleted', life: 3000 });
    }
  };
  
  const getNewData = async (event, type) => {
    await updateOwnerDetailsValue(event, type);
    await getOwnerDetails();
  };
  
  const exportCSV = () => {
    dt.value.exportCSV();
  };
  
  const initFilters = () => {
    filters.value = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
      // Add other filter fields here
    };
  };
  </script>
  
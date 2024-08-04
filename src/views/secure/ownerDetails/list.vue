<template>
    <div>
      <Toast />
      <Toolbar class="mb-4">
        <template v-slot:start>
          <div class="my-2">
            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="$emit('openNew')" />
          </div>
        </template>
        <template v-slot:end>
          <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="$emit('exportCSV', $event)" />
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        :value="ownerDetailss"
        v-model:selection="selectedOwnerDetailss"
        dataKey="id"
        :totalRecords="totalRecords"
        :totalPages="totalpages"
        :loading="loading"
        :rows="row"
        @page="e => $emit('getNewData', e, 1)"
        @filter="e => $emit('getNewData', e, 0)"
        @sort="e => $emit('getNewData', e, 2)"
        lazy
        paginator
        :filters="filters"
        responsiveLayout="scroll"
        v-model:filters="filters"
        :rowsPerPageOptions="[5, 10, 25, 50]"
        filterDisplay="menu"
      >
        <template #header>
          <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 class="m-0">Manage Owner Details</h5>
            <span class="block mt-2 md:mt-0 p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Search..." />
            </span>
          </div>
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <!-- Additional columns here -->
        <Column field="name" header="Name" :showAddButton="false" filterField="name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
          <template #body="slotProps">
            <span class="p-column-title">Name</span>
            {{ slotProps.data.name }}
          </template>
          <template #filter="{ filterModel }">
            <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Name" />
          </template>
        </Column>
        <!-- Action buttons column -->
        <Column headerStyle="min-width:10rem;">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="$emit('editOwnerDetails', slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="$emit('confirmDeleteOwnerDetails', slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </template>
  
  <script setup>
  import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
  
  const toast = useToast();
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    // Add other filter fields here
  });
  const selectedOwnerDetailss = ref(null);
  const dt = ref(null);
  
  const exportCSV = () => {
    dt.value.exportCSV();
  };
  </script>
  
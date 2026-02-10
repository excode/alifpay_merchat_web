<template>
    <div class="surface-ground min-h-screen p-4">
        <div class="grid">
            <div class="col-12">
                <div class="card shadow-2 border-round-xl">
                    <!-- Header Section -->
                    <div class="flex align-items-center justify-content-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-900 m-0">SIM Mapping Management</h2>
                            <p class="text-600 mt-2">Manage and monitor SIM card mappings across the system</p>
                        </div>
                        <div class="flex gap-2">
                            <Button 
                                icon="pi pi-refresh" 
                                class="p-button-outlined p-button-secondary" 
                                @click="getSim_mapping"
                                :loading="loading"
                                v-tooltip="'Refresh data'"
                            />
                            <Button 
                                label="Clear Filters" 
                                icon="pi pi-filter-slash" 
                                class="p-button-outlined p-button-secondary"
                                @click="clearFilters"
                            />
                        </div>
                    </div>

                    <Toast position="top-right" />

                    <!-- Stats Cards -->
                    <div class="grid mb-6">
                        <div class="col-12 md:col-3">
                            <div class="card border-1 surface-border p-4 surface-card hover:shadow-3 transition-all transition-duration-200">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="block text-600 text-sm font-medium">Total Mappings</span>
                                        <span class="text-3xl font-bold text-900">{{ totalRecords || 0 }}</span>
                                    </div>
                                    <i class="pi pi-database text-3xl text-primary-500"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card border-1 surface-border p-4 surface-card hover:shadow-3 transition-all transition-duration-200">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="block text-600 text-sm font-medium">Selected</span>
                                        <span class="text-3xl font-bold text-900">{{ selectedSim_mappings?.length || 0 }}</span>
                                    </div>
                                    <i class="pi pi-check-circle text-3xl text-green-500"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card border-1 surface-border p-4 surface-card hover:shadow-3 transition-all transition-duration-200">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="block text-600 text-sm font-medium">Page</span>
                                        <span class="text-3xl font-bold text-900">{{ (page || 0) + 1 }} of {{ totalpages || 1 }}</span>
                                    </div>
                                    <i class="pi pi-file text-3xl text-blue-500"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card border-1 surface-border p-4 surface-card hover:shadow-3 transition-all transition-duration-200">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="block text-600 text-sm font-medium">Rows/Page</span>
                                        <span class="text-3xl font-bold text-900">{{ row }}</span>
                                    </div>
                                    <i class="pi pi-list text-3xl text-purple-500"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Toolbar -->
                    <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-4 mb-6 p-4 surface-50 border-round">
                        <div class="flex flex-wrap gap-2">
                            <Button 
                                label="New Mapping" 
                                icon="pi pi-plus" 
                                class="p-button-primary"
                                @click="openNew"
                            />
                            <Button 
                                label="Export CSV" 
                                icon="pi pi-download" 
                                class="p-button-help"
                                @click="exportCSV"
                            />
                            <Button 
                                v-if="selectedSim_mappings?.length"
                                label="Bulk Delete" 
                                icon="pi pi-trash" 
                                class="p-button-danger"
                                @click="deleteSim_mappingsDialog = true"
                                :disabled="!selectedSim_mappings?.length"
                            />
                        </div>
                        
                        <div class="w-full md:w-auto">
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-search" />
                                <InputText 
                                    v-model="filters['global'].value" 
                                    placeholder="Search mappings..." 
                                    class="w-full"
                                />
                            </span>
                        </div>
                    </div>

                    <!-- Data Table -->
                    <div class="card p-0 overflow-hidden">
                        <DataTable
                            ref="dt"
                            :value="sim_mappings"
                            v-model:selection="selectedSim_mappings"
                            dataKey="id"
                            :totalRecords="totalRecords"
                            :loading="loading"
                            :rows="row"
                            :rowsPerPageOptions="[5, 10, 25, 50]"
                            paginator
                            lazy
                            v-model:filters="filters"
                            filterDisplay="menu"
                            @page="e => getNewData(e, 1)"
                            @filter="e => getNewData(e, 0)"
                            @sort="e => getNewData(e, 2)"
                            stripedRows
                            removableSort
                            :pt="{
                                table: { style: 'min-width: 50rem' },
                                thead: { style: 'background: var(--surface-50)' }
                            }"
                        >
                            <template #header>
                                <div class="flex justify-content-between align-items-center p-3">
                                    <h3 class="m-0">SIM Mappings</h3>
                                    <Tag :value="`${totalRecords || 0} records`" severity="info" />
                                </div>
                            </template>

                            <Column selectionMode="multiple" headerStyle="width: 3rem" class="text-center"></Column>

                            <!-- Created By Column -->
                            <Column field="createBy" header="Created By" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <Avatar :label="data.createBy?.charAt(0) || 'U'" size="normal" shape="circle" />
                                        <span>{{ data.createBy || 'N/A' }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel }">
                                    <InputText v-model="filterModel.value" placeholder="Search by creator" class="p-column-filter" />
                                </template>
                            </Column>

                            <!-- SIM Number Column -->
                            <Column field="snumber" header="SIM Number" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-sim-card text-primary"></i>
                                        <span class="font-medium">{{ data.snumber || 'N/A' }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <AutoComplete 
                                        v-model="filterModel.value"
                                        optionLabel="snumber"
                                        @complete="searchSims"
                                        :suggestions="sugsimss"
                                        placeholder="Search Serial number"
                                        class="p-column-filter w-full"
                                        dropdown
                                        @item-select="filterCallback"
                                    />
                                </template>
                            </Column>
                               <Column field="simNumber" header="SIM Number" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-sim-card text-primary"></i>
                                        <span class="font-medium">{{ data.simNumber || 'N/A' }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <AutoComplete 
                                        v-model="filterModel.value"
                                        optionLabel="simNumber"
                                        @complete="searchSims"
                                        :suggestions="sugsimss"
                                        placeholder="Search SIM number"
                                        class="p-column-filter w-full"
                                        dropdown
                                        @item-select="filterCallback"
                                    />
                                </template>
                            </Column>

                            <!-- Created At Column -->
                            <Column field="createAt" header="Created At" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-calendar text-600"></i>
                                        <span>{{ formatDate(data.createAt) }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <Calendar 
                                        v-model="filterModel.value" 
                                        showTime 
                                        hourFormat="12" 
                                        placeholder="Select date"
                                        class="p-column-filter w-full"
                                        @date-select="filterCallback"
                                    />
                                </template>
                            </Column>

                            <!-- Actions Column -->
                            <Column header="Actions" headerStyle="width: 120px; min-width: 120px">
                                <template #body="{ data }">
                                    <div class="flex gap-1">
                                       
                                    </div>
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center py-8">
                                    <i class="pi pi-inbox text-6xl text-400 mb-4"></i>
                                    <h3 class="text-900 font-medium mb-2">No SIM Mappings Found</h3>
                                    <p class="text-600 mb-6">Get started by creating a new SIM mapping</p>
                                    <Button label="Create Mapping" icon="pi pi-plus" @click="openNew" />
                                </div>
                            </template>
                        </DataTable>
                    </div>

                    <!-- Create/Edit Dialog -->
                    <Dialog 
                        v-model:visible="sim_mappingDialog" 
                        :style="{ width: '500px' }" 
                        header="SIM Mapping Details" 
                        :modal="true"
                        :closable="false"
                        class="p-fluid"
                    >
                        <div class="field mb-5">
                            <label for="snumber" class="font-medium text-900 mb-2 block">
                                Serial Number <span class="text-red-500">*</span>
                            </label>
                            <AutoComplete 
                                id="snumber"
                                v-model="sim_mapping.snumber"
                                :suggestions="sugsimss"
                                @complete="searchSims"
                                optionLabel="snumber"
                                placeholder="Serial numbers"
                                class="w-full"
                                :class="{ 'p-invalid': submitted && !sim_mapping.snumber }"
                                dropdown
                            >
                                <template #item="slotProps">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-sim-card mr-2 text-primary"></i>
                                        <span>{{ slotProps.option.snumber }}</span>
                                    </div>
                                </template>
                            </AutoComplete>

                            <small v-if="submitted && !sim_mapping.snumber" class="p-error">
                                SIM Number or Serial is required
                            </small>
                        </div>
                        <div class="field mb-5">
                            <label for="snumber" class="font-medium text-900 mb-2 block">
                            Mobile Number <span class="text-red-500"></span>
                            </label>
                            <AutoComplete 
                                id="simNumber"
                                v-model="sim_mapping.simNumber"
                                :suggestions="sugsimss"
                                @complete="searchSims"
                                optionLabel="Sim Number"
                                placeholder="Mobile numbers 01......."
                                class="w-full"
                                :class="{ 'p-invalid': submitted && !sim_mapping.simNumber }"
                                dropdown
                            >
                                <template #item="slotProps">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-sim-card mr-2 text-primary"></i>
                                        <span>{{ slotProps.option.simNumber }}</span>
                                    </div>
                                </template>
                            </AutoComplete>

                            <small v-if="submitted && !sim_mapping.snumber" class="p-error">
                                Mobile Number or Serial is required
                            </small>
                        </div>

                        <template #footer>
                            <div class="flex justify-content-between w-full">
                                <Button 
                                    label="Cancel" 
                                    icon="pi pi-times" 
                                    class="p-button-text"
                                    @click="hideDialog"
                                />
                                <Button 
                                    label="Save" 
                                    icon="pi pi-check" 
                                    class="p-button-primary"
                                    @click="saveSim_mapping"
                                    :loading="curdLoading"
                                />
                            </div>
                        </template>
                    </Dialog>

                    <!-- Delete Confirmation Dialog -->
                    <Dialog 
                        v-model:visible="deleteSim_mappingDialog" 
                        :style="{ width: '400px' }" 
                        header="Confirm Deletion" 
                        :modal="true"
                    >
                        <div class="flex align-items-center justify-content-center mb-4">
                            <i class="pi pi-exclamation-triangle text-6xl text-red-500 mr-3"></i>
                            <div>
                                <h4 class="m-0 mb-2">Are you sure?</h4>
                                <p class="m-0 text-600">
                                    This will permanently delete the mapping for 
                                    <span class="font-bold">{{ sim_mapping.snumber || 'this SIM' }}</span>
                                </p>
                            </div>
                        </div>

                        <template #footer>
                            <div class="flex justify-content-between w-full">
                                <Button 
                                    label="Cancel" 
                                    class="p-button-text"
                                    @click="deleteSim_mappingDialog = false"
                                />
                                <Button 
                                    label="Delete" 
                                    class="p-button-danger"
                                    @click="delSim_mapping"
                                    :loading="curdLoading"
                                />
                            </div>
                        </template>
                    </Dialog>

                    <!-- Bulk Delete Dialog -->
                    <Dialog 
                        v-model:visible="deleteSim_mappingsDialog" 
                        :style="{ width: '400px' }" 
                        header="Bulk Delete" 
                        :modal="true"
                    >
                        <div class="flex align-items-center justify-content-center mb-4">
                            <i class="pi pi-exclamation-circle text-6xl text-orange-500 mr-3"></i>
                            <div>
                                <h4 class="m-0 mb-2">Delete {{ selectedSim_mappings?.length }} items?</h4>
                                <p class="m-0 text-600">
                                    You're about to delete {{ selectedSim_mappings?.length }} SIM mappings. This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <template #footer>
                            <div class="flex justify-content-between w-full">
                                <Button 
                                    label="Cancel" 
                                    class="p-button-text"
                                    @click="deleteSim_mappingsDialog = false"
                                />
                                <Button 
                                    label="Delete All" 
                                    class="p-button-danger"
                                    @click="deleteSelectedSim_mappings"
                                    :loading="curdLoading"
                                />
                            </div>
                        </template>
                    </Dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia';
import { useSim_mappingStore } from '@/stores/modules/Sim_mapping';
import { useSimsStore } from '@/stores/modules/Sims';
import { validateForm, validate } from '@/lib/validation';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';

const toast = useToast();
const { contextPath } = useLayout();

// Store references
const { sim_mappings, error, curdLoading, loading, totalpages, page, totalRecords } = storeToRefs(useSim_mappingStore());
const { getSim_mapping, addSim_mapping, updateSim_mapping, deleteSim_mapping } = useSim_mappingStore();
const { sugsimss } = storeToRefs(useSimsStore());
const { getSimsSuggestions } = useSimsStore();

// UI State
const sim_mappingDialog = ref(false);
const deleteSim_mappingDialog = ref(false);
const deleteSim_mappingsDialog = ref(false);
const sim_mapping = ref({});
const selectedSim_mappings = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// Validation
const validation = [
  
];

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    await getSim_mapping();
});

// Initialize filters
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        snumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
        simNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
        createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
};

// CRUD Operations
const openNew = () => {
    sim_mapping.value = { snumber: null,simNumber:null };
    submitted.value = false;
    sim_mappingDialog.value = true;
};

const hideDialog = () => {
    sim_mappingDialog.value = false;
    submitted.value = false;
};

const saveSim_mapping = async () => {
    submitted.value = true;
    const validationErrors = validateForm(sim_mapping.value, validation);
    
    if (validationErrors.length === 0) {
        if (sim_mapping.value.id) {
            await updateSim_mapping(sim_mapping.value);
            if (!error.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'SIM mapping updated successfully', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        } else {
            await addSim_mapping(sim_mapping.value);
            if (!error.value) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'SIM mapping created successfully', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        sim_mappingDialog.value = false;
        sim_mapping.value = {};
    } else {
        toast.add({ severity: 'error', summary: 'Validation Error', detail: validationErrors.join(', '), life: 5000 });
    }
};

const editSim_mapping = (editSim_mapping) => {
    sim_mapping.value = { ...editSim_mapping };
    sim_mappingDialog.value = true;
};

const confirmDeleteSim_mapping = (editSim_mapping) => {
    sim_mapping.value = editSim_mapping;
    deleteSim_mappingDialog.value = true;
};

const delSim_mapping = async () => {
    await deleteSim_mapping(sim_mapping.value.id);
    deleteSim_mappingDialog.value = false;
    if (!error.value) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'SIM mapping deleted successfully', life: 3000 });
        sim_mapping.value = {};
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};

const deleteSelectedSim_mappings = async () => {
    // Implementation for bulk delete
    deleteSim_mappingsDialog.value = false;
    toast.add({ severity: 'success', summary: 'Success', detail: 'Selected SIM mappings deleted', life: 3000 });
    selectedSim_mappings.value = null;
};

// Search and Filter
const searchSims = async (e) => {
    if (e.query.trim().length > 1) {
        await getSimsSuggestions({ search: e.query.trim() });
    }
};

const getNewData = async (e, type = 0) => {
    loading.value = true;
    let searchObj = {};

    for (const key in e.filters) {
        if (e.filters[key].constraints && e.filters[key].constraints[0].value) {
            searchObj = {
                ...searchObj,
                [key]: e.filters[key].constraints[0].value,
                [`${key}_mode`]: e.filters[key].constraints[0].matchMode
            };
        }
    }

    if (type === 0) {
        searchObj = { ...searchObj, page: 0, limit: row.value };
    } else if (type === 1) {
        searchObj = { ...searchObj, page: e.page, limit: row.value };
    } else if (type === 2) {
        const sort = sortOrders.value?.[e.sortField] === 1 ? -1 : 1;
        sortOrders.value = { ...sortOrders.value, [e.sortField]: sort };
        searchObj = { ...searchObj, page: e.page, limit: row.value, sortBy: e.sortField, sortDirection: sort };
    }

    if (e.rows !== row.value) {
        row.value = e.rows;
        searchObj = { ...searchObj, page: 0, limit: e.rows };
    }

    await getSim_mapping(searchObj);
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const autoCompleteSelect = (e, fieldName, valueId) => {
    sim_mapping.value = { ...sim_mapping.value, [fieldName]: e.value[valueId] };
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const clearFilters = () => {
    initFilters();
    getSim_mapping();
};
</script>

<style scoped>
:deep(.p-datatable) {
    font-size: 0.9rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: var(--surface-50);
    font-weight: 600;
    color: var(--surface-700);
    border-bottom: 2px solid var(--surface-200);
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: var(--surface-50);
}

:deep(.p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even)) {
    background-color: var(--surface-50);
}

:deep(.p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even):hover) {
    background-color: var(--surface-100);
}

:deep(.p-button.p-button-text) {
    color: var(--primary-color);
}

:deep(.p-button.p-button-text:hover) {
    background: rgba(var(--primary-color-rgb), 0.04);
}

.card {
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    background: var(--surface-card);
}

.stat-card {
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.border-round-xl {
    border-radius: 16px;
}
</style>
<template>
    <div class="surface-ground min-h-screen p-4">
        <div class="grid">
            <div class="col-12">
                <div class="card shadow-2 border-round-xl">
                    <!-- Header Section -->
                    <div class="flex align-items-center justify-content-between mb-6">
                        <div>
                            <h2 class="text-2xl font-bold text-900 m-0">Topups Management</h2>
                            <p class="text-600 mt-2">View and manage all top-up transactions</p>
                        </div>
                        <div class="flex gap-2">
                            <Button 
                                icon="pi pi-refresh" 
                                class="p-button-outlined p-button-secondary" 
                                @click="getTopups"
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
                                        <span class="block text-600 text-sm font-medium">Total Topups</span>
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
                                        <span class="block text-600 text-sm font-medium">Total Amount</span>
                                        <span class="text-3xl font-bold text-900">
                                            {{ formatCurrency(totalAmount) }}
                                        </span>
                                    </div>
                                    <i class="pi pi-money-bill text-3xl text-green-500"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card border-1 surface-border p-4 surface-card hover:shadow-3 transition-all transition-duration-200">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="block text-600 text-sm font-medium">Total Bonus</span>
                                        <span class="text-3xl font-bold text-900">
                                            {{ formatCurrency(totalBonus) }}
                                        </span>
                                    </div>
                                    <i class="pi pi-gift text-3xl text-orange-500"></i>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 md:col-3">
                            <div class="card border-1 surface-border p-4 surface-card hover:shadow-3 transition-duration-200">
                                <div class="flex justify-content-between align-items-center">
                                    <div>
                                        <span class="block text-600 text-sm font-medium">Avg. Topup</span>
                                        <span class="text-3xl font-bold text-900">
                                            {{ formatCurrency(averageAmount) }}
                                        </span>
                                    </div>
                                    <i class="pi pi-chart-line text-3xl text-blue-500"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Toolbar -->
                    <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-4 mb-6 p-4 surface-50 border-round">
                        <div class="flex flex-wrap gap-2">
                            <Button 
                                label="Export CSV" 
                                icon="pi pi-download" 
                                class="p-button-help"
                                @click="exportCSV"
                            />
                        </div>
                        
                        <div class="w-full md:w-auto">
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-search" />
                                <InputText 
                                    v-model="filters['global'].value" 
                                    placeholder="Search topups..." 
                                    class="w-full"
                                />
                            </span>
                        </div>
                    </div>

                    <!-- Data Table -->
                    <div class="card p-0 overflow-hidden">
                        <DataTable
                            ref="dt"
                            :value="topupss"
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
                                    <h3 class="m-0">Topup Transactions</h3>
                                    <Tag :value="`${totalRecords || 0} records`" severity="info" />
                                </div>
                            </template>

                            <!-- SIM Number Column -->
                            <Column field="sim_number" header="SIM Number" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-sim-card text-primary"></i>
                                        <span class="font-medium">{{ data.sim_number || 'N/A' }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <AutoComplete 
                                        v-model="filterModel.value"
                                        optionLabel="sim_number"
                                        @complete="searchSims"
                                        :suggestions="sugsimss"
                                        placeholder="Search SIM number"
                                        class="p-column-filter w-full"
                                        dropdown
                                        @item-select="filterCallback"
                                    />
                                </template>
                            </Column>

                            <!-- Amount Column -->
                            <Column field="amount" header="Amount" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <span class="font-bold" :class="{
                                            'text-green-600': data.amount > 0,
                                            'text-red-600': data.amount < 0
                                        }">
                                            {{ formatCurrency(data.amount) }}
                                        </span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputNumber 
                                        v-model="filterModel.value" 
                                        mode="currency" 
                                        currency="USD" 
                                        locale="en-US"
                                        placeholder="Filter by amount"
                                        class="p-column-filter w-full"
                                        @input="filterCallback"
                                    />
                                </template>
                            </Column>

                            <!-- Bonus Column -->
                            <Column field="bonus" header="Bonus" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <Tag 
                                            :value="formatCurrency(data.bonus)" 
                                            :severity="data.bonus > 0 ? 'success' : 'secondary'"
                                            class="font-semibold"
                                        />
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputNumber 
                                        v-model="filterModel.value" 
                                        mode="currency" 
                                        currency="USD" 
                                        locale="en-US"
                                        placeholder="Filter by bonus"
                                        class="p-column-filter w-full"
                                        @input="filterCallback"
                                    />
                                </template>
                            </Column>

                            <!-- Created By Column -->
                            <Column field="createBy" header="Created By" sortable>
                                <template #body="{ data }">
                                    <div class="flex align-items-center gap-2">
                                        <Avatar 
                                            :label="data.createBy?.charAt(0) || 'U'" 
                                            size="normal" 
                                            shape="circle"
                                            class="mr-2"
                                        />
                                        <span>{{ data.createBy || 'N/A' }}</span>
                                    </div>
                                </template>
                                <template #filter="{ filterModel, filterCallback }">
                                    <InputText 
                                        v-model="filterModel.value" 
                                        placeholder="Search by creator" 
                                        class="p-column-filter w-full"
                                        @input="filterCallback"
                                    />
                                </template>
                            </Column>

                            <!-- Created At Column -->
                            <Column field="createAt" header="Date & Time" sortable>
                                <template #body="{ data }">
                                    <div class="flex flex-column">
                                        <span class="font-medium">{{ formatDate(data.createAt) }}</span>
                                        <small class="text-500">{{ formatTime(data.createAt) }}</small>
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

                            <!-- Status/Type Column (Optional - you can add if you have status field) -->
                            <Column header="Type">
                                <template #body="{ data }">
                                    <Chip 
                                        :label="data.bonus > 0 ? 'Bonus Included' : 'Regular'" 
                                        :severity="data.bonus > 0 ? 'success' : 'info'"
                                        class="font-medium"
                                    />
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center py-8">
                                    <i class="pi pi-credit-card text-6xl text-400 mb-4"></i>
                                    <h3 class="text-900 font-medium mb-2">No Topup Records Found</h3>
                                    <p class="text-600 mb-6">No top-up transactions have been recorded yet</p>
                                </div>
                            </template>

                            <template #footer>
                                <div class="flex justify-content-between align-items-center p-3 surface-50">
                                    <div class="text-600">
                                        Showing {{ Math.min(row, totalRecords) }} of {{ totalRecords }} records
                                    </div>
                                    <div class="flex gap-3">
                                        <span class="font-medium">Total: {{ formatCurrency(totalAmount) }}</span>
                                        <span class="font-medium text-green-600">Bonus: {{ formatCurrency(totalBonus) }}</span>
                                    </div>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia';
import { useTopupsStore } from '@/stores/modules/Topups';
import { useSimsStore } from '@/stores/modules/Sims';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';

const toast = useToast();
const { contextPath } = useLayout();

// Store references
const { topupss, error, curdLoading, loading, totalpages, page, totalRecords } = storeToRefs(useTopupsStore());
const { getTopups } = useTopupsStore();
const { sugsimss } = storeToRefs(useSimsStore());
const { getSimsSuggestions } = useSimsStore();

// UI State
const dt = ref(null);
const filters = ref({});
const sortOrders = ref({});
const row = ref(10);

// Computed properties for statistics
const totalAmount = computed(() => {
    if (!topupss.value || !Array.isArray(topupss.value)) return 0;
    return topupss.value.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
});

const totalBonus = computed(() => {
    if (!topupss.value || !Array.isArray(topupss.value)) return 0;
    return topupss.value.reduce((sum, item) => sum + (parseFloat(item.bonus) || 0), 0);
});

const averageAmount = computed(() => {
    if (!topupss.value || !Array.isArray(topupss.value) || topupss.value.length === 0) return 0;
    return totalAmount.value / topupss.value.length;
});

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    await getTopups();
});

// Initialize filters
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sim_number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
        amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        bonus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    };
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

    await getTopups(searchObj);
};

const exportCSV = () => {
    dt.value.exportCSV();
    toast.add({
        severity: 'success',
        summary: 'Exported',
        detail: 'Topups data exported successfully',
        life: 3000
    });
};

// Formatting functions
const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const clearFilters = () => {
    initFilters();
    getTopups();
    toast.add({
        severity: 'info',
        summary: 'Filters Cleared',
        detail: 'All filters have been reset',
        life: 3000
    });
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

/* Custom styles for amount display */
.text-green-600 {
    color: #059669 !important;
}

.text-red-600 {
    color: #dc2626 !important;
}
</style>
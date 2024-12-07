<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import config from '@/config/index'
import { useInsuranceCompanyStore } from '@/stores/modules/InsuranceCompany'
import moment from 'moment'
const { insuranceCompanys, error, loading,totalpages,page,totalRecords} = storeToRefs(useInsuranceCompanyStore())
const {  
getInsuranceCompany
} = useInsuranceCompanyStore()

const layout = ref('grid');
const rows = ref(9)
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([

    { label: 'Old to New', value: '!id' },
    { label: 'New to Old', value: 'id' }
]);
onMounted(() => {
    getInsuranceCompany({limit:rows.value})
});

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};
const newData=async(e,type)=>{
    let request={limit:e.rows,page:e.page}
    if(type==2)  request={limit:e.rows,page:0}
     await getInsuranceCompany(request)
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
              
                <h5>InsuranceCompany</h5>
                <DataView 
                :lazy="true"
                :value="insuranceCompanys" 
                :totalRecords="totalRecords"
                :pageCount="totalpages"
                :layout="layout" 
                @page="$e=>newData($e)" 
                @sort="e=>newData(e,2)"
                :paginator="true" 
                :rows="rows" 
                :rowsPerPageOptions=[9,12,15,21,27]
                :sortOrder="sortOrder" 
                :sortField="sortField">
                    <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By " @change="onSortChange($event)" />
                            </div>
                            <div class="col-6 text-right">
                                <DataViewLayoutOptions v-model="layout" />
                            </div>
                        </div>
                    </template>
                    <template #list="slotProps">
                        <div class="col-12">
                            <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                                <img v-if="slotProps.data.logo!=undefined" :src="config.serverURI+'/' + slotProps.data.logo" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                                <img v-else src="/photo_na.png" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-bold text-2xl">{{ slotProps.data.createBy }}</div>
                                    <div class="mb-3">{{ slotProps.data.companyName }}</div>
                                    <Rating :modelValue="Math.floor(Math.random() * 5)" :readonly="true" :cancel="false" class="mb-2"></Rating>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-tag mr-2"></i>
                                        <span class="font-semibold">{{ slotProps.data.updateBy }}</span>
                                    </div>
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <span class="text-2xl font-semibold mb-2 align-self-center md:align-self-end">{{ slotProps.data.regDate }}</span>
                                    <Button icon="pi pi-shopping-cart" label="Add to Cart" :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'" class="mb-2"></Button>
                                    <span :class="'product-badge status-' + slotProps.data.name.toLowerCase()">{{ slotProps.data.test1 }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="col-12 md:col-4">
                            <div class="card m-3 border-1 surface-border">
                                <div class="flex align-items-center justify-content-between">
                                    <div class="flex align-items-center">
                                        <i class="pi pi-tag mr-2"></i>
                                        <span class="font-semibold">{{ slotProps.updateBy }}</span>
                                    </div>
                                    <span :class="'product-badge status-' + slotProps.data.id.toLowerCase()">{{ slotProps.data.createBy }}</span>
                                </div>
                                <div class="text-center">

                                    <img v-if="slotProps.data.logo!=undefined" :src="config.serverURI+'/' + slotProps.data.logo" :alt="slotProps.data.name" class="w-9 shadow-2 my-3 mx-0" />
                                   <img v-else src="/photo_na.png" :alt="slotProps.data.createBy" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                                    <div class="text-2xl font-bold">{{ slotProps.data.createBy }}</div>
                                    <div class="mb-3">{{ slotProps.data.updateBy }}</div>
                                    <Rating :modelValue="Math.floor(Math.random() * 5)" :readonly="true" :cancel="false"></Rating>
                                </div>
                                <div class="flex align-items-center justify-content-between">
                                    <span class="text-2xl font-semibold">{{ slotProps.data.id }}</span>
                                    <Button icon="pi pi-shopping-cart" :disabled="slotProps.data.createBy === 'OUTOFSTOCK'"></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>

        
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>

    
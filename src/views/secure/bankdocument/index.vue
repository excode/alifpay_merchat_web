
<script setup>
import { FilterMatchMode ,FilterOperator} from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia'
import config from '@/config/index'
import { useBankdocumentStore } from '@/stores/modules/Bankdocument'
import moment from 'moment'
import { convertArray, fixDate } from '@/lib/functions';

import {validateForm,validate} from '@/lib/validation'
    const { bankdocuments, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useBankdocumentStore())
    const {  
    getBankdocument,
    updateBankdocumentValue ,
    addBankdocument,
    updateBankdocument,
    deleteBankdocument
    } = useBankdocumentStore()


const toast = useToast();
const { contextPath } = useLayout();
const bankdocumentDialog = ref(false);
const deleteBankdocumentDialog = ref(false);
const deleteBankdocumentsDialog = ref(false);
const bankdocument = ref({});
const selectedBankdocuments = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// THE VALIDATION RULES
const validation=[
    {id:'acc_no',type:validate.text,max:0,min:0,required:true},
{id:'bankimgname',type:validate.text,max:0,min:0,required:true},
{id:'bankimgstring',type:validate.text,max:0,min:0,required:true},
{id:'uid',type:validate.text,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getBankdocument()
    

});


const openNew = () => {
    let emptyBankdocument = {
        acc_no:'',
bankimgname:'',
bankimgstring:'',
uid:''
    };
    bankdocument.value = emptyBankdocument;
    submitted.value = false;
    bankdocumentDialog.value = true;
};

const hideDialog = () => {
    bankdocumentDialog.value = false;
    submitted.value = false;
};

const saveBankdocument = async() => {
    submitted.value = true;
    const validationErrors=validateForm(bankdocument.value,validation)
    if (validationErrors.length==0) {
    
        if (bankdocument.value.id) {
            await updateBankdocument(bankdocument.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankdocument Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addBankdocument(bankdocument.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankdocument Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        bankdocumentDialog.value = false;
        bankdocument.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editBankdocument = (editBankdocument) => {
    
    bankdocument.value = { ...editBankdocument };
    bankdocumentDialog.value = true;
};

const confirmDeleteBankdocument = (editBankdocument) => {
    bankdocument.value = { ...editBankdocument };
    deleteBankdocumentDialog.value = true;
};

const delBankdocument = async() => {
    await deleteBankdocument(bankdocument.value.id);
    deleteBankdocumentDialog.value = false;
    if(error.value==undefined || error.value==null){
    bankdocument.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankdocument Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    bankdocument.value =  {...bankdocument.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < bankdocuments.value.length; i++) {
        if (bankdocuments.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};


const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteBankdocumentsDialog.value = true;
};
const deleteSelectedBankdocuments = () => {
    bankdocuments.value = bankdocuments.value.filter((val) => !selectedBankdocuments.value.includes(val));
    deleteBankdocumentsDialog.value = false;
    selectedBankdocuments.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Bankdocuments Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        acc_no: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
bankimgname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
bankimgstring: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
uid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
    };
};
const getNewData =async(e,type=0)=>{
    loading.value = true;
    let searchObj={}
    
    for (const key in e.filters) {  

        if(e.filters[key].constraints){
         
            if(e.filters[key].constraints[0].value){
                searchObj={...searchObj,[key]:e.filters[key].constraints[0].value,[key+'_mode']:e.filters[key].constraints[0].matchMode}
            }
        }
        }
        if(type==0){ // FILTER Data and start with page 0
            searchObj={...searchObj,page:0,limit:row.value}
        }else if(type==1){ // Change page number
            searchObj={...searchObj,page:e.page,limit:row.value}
        }else if(type==2){ // Change sortOrder number
            let sort={}
            if(sortOrders){
                let currentSortOrder = sortOrders.value[e.sortField]==1?-1:1
                sort={...sortOrders.value,[e.sortField]:currentSortOrder}
            
            }else{
                sort={[e.sortField]:1}
            }
        
            sortOrders.value=sort;

            searchObj={...searchObj,page:e.page,limit:row.value,sortBy:e.sortField,sortDirection:sortOrders.value[e.sortField]}
        }
        if(e.rows!==row.value){
        row.value =e.rows
        searchObj={...searchObj,page:0,limit:e.rows}
        }
        
        await getBankdocument(searchObj);
}     
       

        </script>
        
        <template>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Toast />
                        <Toolbar class="mb-4">
                            <template v-slot:start>
                                <div class="my-2">
                                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                                    
                                </div>
                            </template>
        
                            <template v-slot:end>
                               
                                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                            </template>
                        </Toolbar>
        
                        <DataTable
                            ref="dt"
                            :value="bankdocuments"
                            v-model:selection="selectedBankdocuments"
                            dataKey="id"
                            :totalRecords="totalRecords"
                            :totalPages="totalpages"
                            :loading="loading"
                            :rows="row"
                            @page="e=>getNewData(e,1)"
                            @filter="e=>getNewData(e,0)"
                            @sort="e=>getNewData(e,2)"
                            lazy 
                            paginator
                            :filters="filters"
                            responsiveLayout="scroll"
                            v-model:filters="filters"
                            :rowsPerPageOptions="[5, 10, 25,50]"
                            filterDisplay="menu"
                        >
        
                            <template #header>
                                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                    <h5 class="m-0">Manage Bankdocuments</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="acc_no"  header="Account No" :showAddButton="false"  filterField="acc_no"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Account No</span>
        {{slotProps.data.acc_no}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Acc_no" />
                
    </template>
</Column>
            
            

          
         
<Column field="bankimgname"  header="Bank Img Name" :showAddButton="false"  filterField="bankimgname"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank Img Name</span>
        {{slotProps.data.bankimgname}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Bankimgname" />
                
    </template>
</Column>
            
            

          
         
<Column field="bankimgstring"  header="Bank Img String" :showAddButton="false"  filterField="bankimgstring"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Bank Img String</span>
        {{slotProps.data.bankimgstring}}
    </template>
    <template #filter="{ filterModel }">
    
            <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Bankimgstring" />
                   
    </template>
</Column>
            
            

          
         
<Column field="uid"  header="UID" :showAddButton="false"  filterField="uid"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">UID</span>
        {{slotProps.data.uid}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Uid" />
                
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editBankdocument(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteBankdocument(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/bankdocument/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="bankdocumentDialog" :style="{ width: '450px' }" header="Bankdocument Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="acc_no">Account No</label>
         <InputText id="acc_no" type="text" v-model="bankdocument.acc_no"  autoFocus  required :class="{ 'p-invalid': submitted && !bankdocument.acc_no }" />
    </div>
            

    <div class="field">
        <label htmlFor="bankimgname">Bank Img Name</label>
         <InputText id="bankimgname" type="text" v-model="bankdocument.bankimgname"  autoFocus  required :class="{ 'p-invalid': submitted && !bankdocument.bankimgname }" />
    </div>
            

    <div class="field">
        <label htmlFor="bankimgstring">Bank Img String</label>
         <Textarea id="bankimgstring" v-model="bankdocument.bankimgstring"  autosize rows="5" cols="30"    required :class="{ 'p-invalid': submitted && !bankdocument.bankimgstring }" />
    </div>
            

    <div class="field">
        <label htmlFor="uid">UID</label>
         <InputText id="uid" type="text" v-model="bankdocument.uid"  autoFocus  required :class="{ 'p-invalid': submitted && !bankdocument.uid }" />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveBankdocument" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteBankdocumentDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="bankdocument"
                                    >Are you sure you want to delete <b>{{ bankdocument.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBankdocumentDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delBankdocument" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteBankdocumentsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="bankdocument">Are you sure you want to delete the selected bankdocuments?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteBankdocumentsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedBankdocuments" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
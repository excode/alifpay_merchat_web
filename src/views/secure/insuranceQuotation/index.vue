
<script setup>
import { FilterMatchMode ,FilterOperator} from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia'
import config from '@/config/index'
import { useInsuranceQuotationStore } from '@/stores/modules/InsuranceQuotation'
import moment from 'moment'
import { convertArray, fixDate } from '@/lib/functions';
import { useInsuranceCompanyStore } from '@/stores/modules/InsuranceCompany';
import {validateForm,validate} from '@/lib/validation'
    const { insuranceQuotations, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useInsuranceQuotationStore())
    const {  
    getInsuranceQuotation,
    updateInsuranceQuotationValue ,
    addInsuranceQuotation,
    updateInsuranceQuotation,
    deleteInsuranceQuotation
    } = useInsuranceQuotationStore()


const toast = useToast();
const { contextPath } = useLayout();
const insuranceQuotationDialog = ref(false);
const deleteInsuranceQuotationDialog = ref(false);
const deleteInsuranceQuotationsDialog = ref(false);
const insuranceQuotation = ref({});
const selectedInsuranceQuotations = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

const { insuranceCompanys} = storeToRefs(useInsuranceCompanyStore())
const {  
getInsuranceCompanyAll
} = useInsuranceCompanyStore()
                
// THE VALIDATION RULES
const validation=[
    {id:'numberPlate',type:validate.text,max:0,min:0,required:true},
{id:'owneric',type:validate.text,max:0,min:0,required:true},
{id:'companyName',type:validate.text,required:true},
{id:'status',type:validate.text,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getInsuranceQuotation()
             
    await getInsuranceCompanyAll({});
          

});


const openNew = () => {
    let emptyInsuranceQuotation = {
        numberPlate:'',
owneric:'',
companyName:null,
status:null
    };
    insuranceQuotation.value = emptyInsuranceQuotation;
    submitted.value = false;
    insuranceQuotationDialog.value = true;
};

const hideDialog = () => {
    insuranceQuotationDialog.value = false;
    submitted.value = false;
};

const saveInsuranceQuotation = async() => {
    submitted.value = true;
    const validationErrors=validateForm(insuranceQuotation.value,validation)
    if (validationErrors.length==0) {
    
        if (insuranceQuotation.value.id) {
            await updateInsuranceQuotation(insuranceQuotation.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceQuotation Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addInsuranceQuotation(insuranceQuotation.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceQuotation Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        insuranceQuotationDialog.value = false;
        insuranceQuotation.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editInsuranceQuotation = (editInsuranceQuotation) => {
    
    insuranceQuotation.value = { ...editInsuranceQuotation };
    insuranceQuotationDialog.value = true;
};

const confirmDeleteInsuranceQuotation = (editInsuranceQuotation) => {
    insuranceQuotation.value = { ...editInsuranceQuotation };
    deleteInsuranceQuotationDialog.value = true;
};

const delInsuranceQuotation = async() => {
    await deleteInsuranceQuotation(insuranceQuotation.value.id);
    deleteInsuranceQuotationDialog.value = false;
    if(error.value==undefined || error.value==null){
    insuranceQuotation.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceQuotation Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    insuranceQuotation.value =  {...insuranceQuotation.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < insuranceQuotations.value.length; i++) {
        if (insuranceQuotations.value[i].id === id) {
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
    deleteInsuranceQuotationsDialog.value = true;
};
const deleteSelectedInsuranceQuotations = () => {
    insuranceQuotations.value = insuranceQuotations.value.filter((val) => !selectedInsuranceQuotations.value.includes(val));
    deleteInsuranceQuotationsDialog.value = false;
    selectedInsuranceQuotations.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceQuotations Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        numberPlate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
owneric: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
companyName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
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
        
        await getInsuranceQuotation(searchObj);
}     
       

    const statuss =[
	{value:"pending",name:"pending"},
	{value:" review",name:" review"},
	{value:" quotation-sent",name:" quotation-sent"},
	{value:" quotation-Accept",name:" quotation-Accept"},
	{value:" Payment-Done",name:" Payment-Done"},
	{value:" in-progress",name:" in-progress"},
	{value:"completed",name:"completed"}
]
                
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
                            :value="insuranceQuotations"
                            v-model:selection="selectedInsuranceQuotations"
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
                                    <h5 class="m-0">Manage InsuranceQuotations</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="numberPlate"  header="numberPlate" :showAddButton="false"  filterField="numberPlate"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">numberPlate</span>
        {{slotProps.data.numberPlate}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by NumberPlate" />
                
    </template>
</Column>
            
            

          
         
<Column field="owneric"  header="Owner IC/Passport" :showAddButton="false"  filterField="owneric"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Owner IC/Passport</span>
        {{slotProps.data.owneric}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Owneric" />
                
    </template>
</Column>
            
            

          
         
<Column field="companyName"   header="Company" :showAddButton="false"  filterField="companyName"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Company</span>
        {{slotProps.data.companyName}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="insuranceCompanys"   optionLabel="companyName" optionValue="companyName" placeholder="Search by companyName" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="status"   header="Status" :showAddButton="false"  filterField="status"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Status</span>
        {{slotProps.data.status}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="statuss"   optionLabel="name" optionValue="value" placeholder="Search by status" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="createBy"  header="Created By" :showAddButton="false"  filterField="createBy"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Created By</span>
        {{slotProps.data.createBy}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by CreateBy" />
                
    </template>
</Column>
            
            

          
         
<Column field="createAt"  dataType="date" header="Created At" :showAddButton="false"  filterField="createAt"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Created At</span>
        {{slotProps.data.createAt}}
    </template>
    <template #filter="{ filterModel }">
    
<Calendar v-model="filterModel.value"  showTime hourFormat="12" />

            
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editInsuranceQuotation(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteInsuranceQuotation(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/insuranceQuotation/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="insuranceQuotationDialog" :style="{ width: '450px' }" header="InsuranceQuotation Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="numberPlate">numberPlate</label>
         <InputText id="numberPlate" type="text" v-model="insuranceQuotation.numberPlate"  autoFocus  required :class="{ 'p-invalid': submitted && !insuranceQuotation.numberPlate }" />
    </div>
            

    <div class="field">
        <label htmlFor="owneric">Owner IC/Passport</label>
         <InputText id="owneric" type="text" v-model="insuranceQuotation.owneric"  autoFocus  required :class="{ 'p-invalid': submitted && !insuranceQuotation.owneric }" />
    </div>
            

    <div class="field">
        <label htmlFor="companyName">Company</label>
         <Dropdown   id="companyName"  optionLabel="companyName" optionValue="companyName"  v-model="insuranceQuotation.companyName" :options="insuranceCompanys"   />
    </div>
            

    <div class="field">
        <label htmlFor="status">Status</label>
         <Dropdown   id="status" optionLabel="name" optionValue="value"  v-model="insuranceQuotation.status" :options="statuss"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveInsuranceQuotation" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteInsuranceQuotationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="insuranceQuotation"
                                    >Are you sure you want to delete <b>{{ insuranceQuotation.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteInsuranceQuotationDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delInsuranceQuotation" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteInsuranceQuotationsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="insuranceQuotation">Are you sure you want to delete the selected insuranceQuotations?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteInsuranceQuotationsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedInsuranceQuotations" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
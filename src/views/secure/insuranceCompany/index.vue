
<script setup>
import { FilterMatchMode ,FilterOperator} from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia'
import config from '@/config/index'
import { useInsuranceCompanyStore } from '@/stores/modules/InsuranceCompany'
import moment from 'moment'
import { convertArray, fixDate } from '@/lib/functions';


import { useLoginStore } from '@/stores/modules/Login'
            

import {validateForm,validate} from '@/lib/validation'
    const { insuranceCompanys, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useInsuranceCompanyStore())
    const {  
    getInsuranceCompany,
    updateInsuranceCompanyValue ,
    addInsuranceCompany,
    updateInsuranceCompany,
    deleteInsuranceCompany
    } = useInsuranceCompanyStore()


const toast = useToast();
const { contextPath } = useLayout();
const insuranceCompanyDialog = ref(false);
const deleteInsuranceCompanyDialog = ref(false);
const deleteInsuranceCompanysDialog = ref(false);
const insuranceCompany = ref({});
const selectedInsuranceCompanys = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

const { userInfo} = storeToRefs(useLoginStore())
const {  
    getUserInfo,
  } = useLoginStore()
const uploadDialog = ref(false);
const currentImage = ref('');
const uploadInfo = ref(null);


// THE VALIDATION RULES
const validation=[
    {id:'companyName',type:validate.text,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getInsuranceCompany()
    
//GET THE USER TOEKN           
getUserInfo()


});


const openNew = () => {
    let emptyInsuranceCompany = {
        companyName:''
    };
    insuranceCompany.value = emptyInsuranceCompany;
    submitted.value = false;
    insuranceCompanyDialog.value = true;
};

const hideDialog = () => {
    insuranceCompanyDialog.value = false;
    submitted.value = false;
};

const saveInsuranceCompany = async() => {
    submitted.value = true;
    const validationErrors=validateForm(insuranceCompany.value,validation)
    if (validationErrors.length==0) {
    
        if (insuranceCompany.value.id) {
            await updateInsuranceCompany(insuranceCompany.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceCompany Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addInsuranceCompany(insuranceCompany.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceCompany Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        insuranceCompanyDialog.value = false;
        insuranceCompany.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editInsuranceCompany = (editInsuranceCompany) => {
    
    insuranceCompany.value = { ...editInsuranceCompany };
    insuranceCompanyDialog.value = true;
};

const confirmDeleteInsuranceCompany = (editInsuranceCompany) => {
    insuranceCompany.value = { ...editInsuranceCompany };
    deleteInsuranceCompanyDialog.value = true;
};

const delInsuranceCompany = async() => {
    await deleteInsuranceCompany(insuranceCompany.value.id);
    deleteInsuranceCompanyDialog.value = false;
    if(error.value==undefined || error.value==null){
    insuranceCompany.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceCompany Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    insuranceCompany.value =  {...insuranceCompany.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < insuranceCompanys.value.length; i++) {
        if (insuranceCompanys.value[i].id === id) {
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
    deleteInsuranceCompanysDialog.value = true;
};
const deleteSelectedInsuranceCompanys = () => {
    insuranceCompanys.value = insuranceCompanys.value.filter((val) => !selectedInsuranceCompanys.value.includes(val));
    deleteInsuranceCompanysDialog.value = false;
    selectedInsuranceCompanys.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'InsuranceCompanys Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        companyName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
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
        
        await getInsuranceCompany(searchObj);
}     
       
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateInsuranceCompanyValue(insuranceCompany.value.id,newUploadedFileName,colName)         
    };
    const downloadFile=(e,data,dbColName) => {
        e.stopPropagation();
        let fileLink = config.serverURI+"/"+data[dbColName];
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();

    }
    const showUploadDialog = (e,data,dbColName,accept="image/*") => {
        e.stopPropagation();
        insuranceCompany.value={ ...data };
        let uploadData =  {url:config.serverURI,dbColName:dbColName,accept:accept}
        uploadInfo.value = uploadData;
        uploadDialog.value = true;
        
    };
    const hideUploadDialog = () => {
        uploadDialog.value = false;
    
    };
    
              
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
                            :value="insuranceCompanys"
                            v-model:selection="selectedInsuranceCompanys"
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
                                    <h5 class="m-0">Manage InsuranceCompanys</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="logo"  header="Logo" :showAddButton="false"  filterField="logo"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Logo</span>
        
    <Image v-if="slotProps.data.logo!='' && slotProps.data.logo!=undefined" preview  alt="Image" width="250"  :src="config.serverURI+'/' + slotProps.data.logo">
        <template #indicatoricon>
            
            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
        
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'logo')" />
        </template>
    </Image>
    
    <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
           <template #indicatoricon>
               <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'logo')" />
           </template>
    </Image>
        
    </template>
    <template #filter="{ filterModel }">
    
    </template>
</Column>
            
            

          
         
<Column field="companyName"  header="Company Name" :showAddButton="false"  filterField="companyName"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Company Name</span>
        {{slotProps.data.companyName}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by CompanyName" />
                
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
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editInsuranceCompany(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteInsuranceCompany(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/insuranceCompany/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="insuranceCompanyDialog" :style="{ width: '450px' }" header="InsuranceCompany Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="companyName">Company Name</label>
         <InputText id="companyName" type="text" v-model="insuranceCompany.companyName"  autoFocus  required :class="{ 'p-invalid': submitted && !insuranceCompany.companyName }" />
    </div>
            

                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveInsuranceCompany" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteInsuranceCompanyDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="insuranceCompany"
                                    >Are you sure you want to delete <b>{{ insuranceCompany.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteInsuranceCompanyDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delInsuranceCompany" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteInsuranceCompanysDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="insuranceCompany">Are you sure you want to delete the selected insuranceCompanys?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteInsuranceCompanysDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedInsuranceCompanys" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="insuranceCompany" 
        :tableId="insuranceCompany.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
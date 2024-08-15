
<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { countrys } from '@/lib/countrys';
import { states } from '@/lib/states';
import { useMerchantInfoStore } from '@/stores/modules/MerchantInfo';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

import { useLoginStore } from '@/stores/modules/Login';
            

import { validate, validateForm } from '@/lib/validation';
    const { merchantInfos, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useMerchantInfoStore())
    const {  
    getMerchantInfo,
    updateMerchantInfoValue ,
    addMerchantInfo,
    updateMerchantInfo,
    deleteMerchantInfo
    } = useMerchantInfoStore()


const toast = useToast();
const { contextPath } = useLayout();
const merchantInfoDialog = ref(false);
const deleteMerchantInfoDialog = ref(false);
const deleteMerchantInfosDialog = ref(false);
const merchantInfo = ref({});
const selectedMerchantInfos = ref(null);
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
    {id:'contactperson',type:validate.text,max:0,min:0,required:true},
{id:'mobileno',type:validate.phone,max:0,min:0,required:true},
{id:'email',type:validate.email,max:0,min:0,required:true},
{id:'street',type:validate.text,max:0,min:0,required:true},
{id:'address',type:validate.text,max:0,min:0,required:true},
{id:'introducer',type:validate.text,max:0,min:0,required:true},
{id:'city',type:validate.text,max:0,min:0,required:true},
{id:'state',type:validate.text,required:true},
{id:'postcode',type:validate.text,max:0,min:0,required:true},
{id:'country',type:validate.text,required:true},
{id:'avgtransaction',type:validate.number,max:0,min:0,required:true},
{id:'avgmonthlytransaction',type:validate.number,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getMerchantInfo()
    
//GET THE USER TOEKN           
getUserInfo()


});


const openNew = () => {
    let emptyMerchantInfo = {
        contactperson:'',
mobileno:'',
email:'',
street:'',
address:'',
city:'',
state:null,
introducer:'',
postcode:'',
country:null,
avgtransaction:0,
avgmonthlytransaction:0
    };
    merchantInfo.value = emptyMerchantInfo;
    submitted.value = false;
    merchantInfoDialog.value = true;
};

const hideDialog = () => {
    merchantInfoDialog.value = false;
    submitted.value = false;
};

const saveMerchantInfo = async() => {
    submitted.value = true;
    const validationErrors=validateForm(merchantInfo.value,validation)
    if (validationErrors.length==0) {
    
        if (merchantInfo.value.id) {
            await updateMerchantInfo(merchantInfo.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantInfo Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addMerchantInfo(merchantInfo.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantInfo Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        merchantInfoDialog.value = false;
        merchantInfo.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editMerchantInfo = (editMerchantInfo) => {
    
    merchantInfo.value = { ...editMerchantInfo };
    merchantInfoDialog.value = true;
};

const confirmDeleteMerchantInfo = (editMerchantInfo) => {
    merchantInfo.value = { ...editMerchantInfo };
    deleteMerchantInfoDialog.value = true;
};

const delMerchantInfo = async() => {
    await deleteMerchantInfo(merchantInfo.value.id);
    deleteMerchantInfoDialog.value = false;
    if(error.value==undefined || error.value==null){
    merchantInfo.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantInfo Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    merchantInfo.value =  {...merchantInfo.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < merchantInfos.value.length; i++) {
        if (merchantInfos.value[i].id === id) {
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
    deleteMerchantInfosDialog.value = true;
};
const deleteSelectedMerchantInfos = () => {
    merchantInfos.value = merchantInfos.value.filter((val) => !selectedMerchantInfos.value.includes(val));
    deleteMerchantInfosDialog.value = false;
    selectedMerchantInfos.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantInfos Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        contactperson: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
mobileno: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
city: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
street: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
postcode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
country: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
avgtransaction: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
avgmonthlytransaction: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
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
        
        await getMerchantInfo(searchObj);
}     
       

   
                
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateMerchantInfoValue(merchantInfo.value.id,newUploadedFileName,colName)         
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
        merchantInfo.value={ ...data };
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
                            :value="merchantInfos"
                            v-model:selection="selectedMerchantInfos"
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
                                    <h5 class="m-0">Merchant Info</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
                            <Column field="introducer"  header="Introducer" :showAddButton="false"  filterField="introducer"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Introducer</span>
                                    {{slotProps.data.introducer}}
                                </template>
                                <template #filter="{ filterModel }">
                                
                                     <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by introducer" />
                                            
                                </template>
                            </Column>      
         
<Column field="contactperson"  header="Contact Person" :showAddButton="false"  filterField="contactperson"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Contact Person</span>
        {{slotProps.data.contactperson}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Contactperson" />
                
    </template>
</Column>
            
            

          
         
<Column field="mobileno"  header="Mobile no" :showAddButton="false"  filterField="mobileno"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Mobile no</span>
        {{slotProps.data.mobileno}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Mobileno" />
                
    </template>
</Column>
            
            

          
         
<Column field="email"  header="Email" :showAddButton="false"  filterField="email"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Email</span>
        {{slotProps.data.email}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Email" />
                
    </template>
</Column>
            
            

          
         
<Column field="address"  header="Address" :showAddButton="false"  filterField="address"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Address</span>
        {{slotProps.data.address}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Address" />
                
    </template>
</Column>
            
            

          
         
<Column field="city"  header="City" :showAddButton="false"  filterField="city"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">City</span>
        {{slotProps.data.city}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by City" />
                
    </template>
</Column>
            
            

          
         
<Column field="state"   header="State" :showAddButton="false"  filterField="state"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">State</span>
        {{slotProps.data.state}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="states"   optionLabel="State" optionValue="State" placeholder="Search by state" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         

            
            

          
         
<Column field="postcode"  header="Post code" :showAddButton="false"  filterField="postcode"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Post code</span>
        {{slotProps.data.postcode}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Postcode" />
                
    </template>
</Column>
            
            

          
         

            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editMerchantInfo(slotProps.data)" />
                                  
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/merchantInfo/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>

                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Panel header="Attention">
                            <p class="m-0">
                                please click the right-most blue button. It will forward you to the details page, where you can upload all relevant documents required for your merchant application
                            </p>
                        </Panel>
                              
                      
                        <Dialog v-model:visible="merchantInfoDialog" :style="{ width: '450px' }" header="MerchantInfo Details" :modal="true" class="p-fluid">
                            <div class="field">
                                <label htmlFor="introducer">Introducer (Not editable)</label>
                                 <InputText id="introducer" type="text" v-model="merchantInfo.introducer"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.introducer }" />
                            </div>                       
                            
    <div class="field">
        <label htmlFor="contactperson">Contact Person</label>
         <InputText id="contactperson" type="text" v-model="merchantInfo.contactperson"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.contactperson }" />
    </div>
            

    <div class="field">
        <label htmlFor="mobileno">Mobile no</label>
         <InputText id="mobileno" type="text" v-model="merchantInfo.mobileno"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.mobileno }" />
    </div>
            

    <div class="field">
        <label htmlFor="email">Email</label>
         <InputText id="email" type="text" v-model="merchantInfo.email"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.email }" />
    </div>
            

    <div class="field">
        <label htmlFor="street">Street</label>
         <InputText id="street" type="text" v-model="merchantInfo.street"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.street }" />
    </div>
            

    <div class="field">
        <label htmlFor="address">Address</label>
         <InputText id="address" type="text" v-model="merchantInfo.address"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.address }" />
    </div>
            

    <div class="field">
        <label htmlFor="city">City</label>
         <InputText id="city" type="text" v-model="merchantInfo.city"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.city }" />
    </div>
            

    <div class="field">
        <label htmlFor="state">State</label>
         <Dropdown   id="state" optionLabel="State" optionValue="State"  v-model="merchantInfo.state" :options="states"   />
    </div>
            

    <div class="field">
        <label htmlFor="postcode">Post code</label>
         <InputText id="postcode" type="text" v-model="merchantInfo.postcode"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantInfo.postcode }" />
    </div>
            

    <div class="field">
        <label htmlFor="country">Country</label>
         <Dropdown   id="country" optionLabel="Country" optionValue="Country"  v-model="merchantInfo.country" :options="countrys"   />
    </div>
            

    <div class="field">
        <label htmlFor="avgtransaction">Avg Transaction</label>
         <InputNumber id="avgtransaction" v-model="merchantInfo.avgtransaction"   mode="currency" currency="MYR"  />
    </div>
            

    <div class="field">
        <label htmlFor="avgmonthlytransaction">Avg Monthly Transaction</label>
         <InputNumber id="avgmonthlytransaction" v-model="merchantInfo.avgmonthlytransaction"   mode="currency" currency="MYR"  />
    </div>
            










                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMerchantInfo" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantInfoDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantInfo"
                                    >Are you sure you want to delete <b>{{ merchantInfo.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantInfoDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delMerchantInfo" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantInfosDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantInfo">Are you sure you want to delete the selected merchantInfos?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantInfosDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedMerchantInfos" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
        :maxFileSize="1000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />
           
    </Dialog>    
            
            

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantInfo" 
        :tableId="merchantInfo.id" 
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
        
            
           
            
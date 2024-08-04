
<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useOwnerDetailsStore } from '@/stores/modules/OwnerDetails';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';


import { useLoginStore } from '@/stores/modules/Login';
            

import { validate, validateForm } from '@/lib/validation';
    const { ownerDetailss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useOwnerDetailsStore())
    const {  
    getOwnerDetails,
    updateOwnerDetailsValue ,
    addOwnerDetails,
    updateOwnerDetails,
    deleteOwnerDetails
    } = useOwnerDetailsStore()


const toast = useToast();
const { contextPath } = useLayout();
const ownerDetailsDialog = ref(false);
const deleteOwnerDetailsDialog = ref(false);
const deleteOwnerDetailssDialog = ref(false);
const ownerDetails = ref({});
const selectedOwnerDetailss = ref(null);
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
    {id:'name',type:validate.text,max:0,min:0,required:true},
{id:'contactnumber',type:validate.phone,max:0,min:0,required:true},
{id:'email',type:validate.email,max:0,min:0,required:true},
{id:'icno',type:validate.text,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getOwnerDetails()
    
//GET THE USER TOEKN           
getUserInfo()


});


const openNew = () => {
    let emptyOwnerDetails = {
        name:'',
contactnumber:'',
email:'',
icno:''
    };
    ownerDetails.value = emptyOwnerDetails;
    submitted.value = false;
    ownerDetailsDialog.value = true;
};

const hideDialog = () => {
    ownerDetailsDialog.value = false;
    submitted.value = false;
};

const saveOwnerDetails = async() => {
    submitted.value = true;
    const validationErrors=validateForm(ownerDetails.value,validation)
    if (validationErrors.length==0) {
    
        if (ownerDetails.value.id) {
            await updateOwnerDetails(ownerDetails.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'OwnerDetails Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addOwnerDetails(ownerDetails.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'OwnerDetails Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        ownerDetailsDialog.value = false;
        ownerDetails.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editOwnerDetails = (editOwnerDetails) => {
    
    ownerDetails.value = { ...editOwnerDetails };
    ownerDetailsDialog.value = true;
};

const confirmDeleteOwnerDetails = (editOwnerDetails) => {
    ownerDetails.value = { ...editOwnerDetails };
    deleteOwnerDetailsDialog.value = true;
};

const delOwnerDetails = async() => {
    await deleteOwnerDetails(ownerDetails.value.id);
    deleteOwnerDetailsDialog.value = false;
    if(error.value==undefined || error.value==null){
    ownerDetails.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'OwnerDetails Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    ownerDetails.value =  {...ownerDetails.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < ownerDetailss.value.length; i++) {
        if (ownerDetailss.value[i].id === id) {
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
    deleteOwnerDetailssDialog.value = true;
};
const deleteSelectedOwnerDetailss = () => {
    ownerDetailss.value = ownerDetailss.value.filter((val) => !selectedOwnerDetailss.value.includes(val));
    deleteOwnerDetailssDialog.value = false;
    selectedOwnerDetailss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'OwnerDetailss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        contactnumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        icno: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getOwnerDetails(searchObj);
}     
       
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateOwnerDetailsValue(ownerDetails.value.id,newUploadedFileName,colName)         
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
        ownerDetails.value={ ...data };
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
                            :value="ownerDetailss"
                            v-model:selection="selectedOwnerDetailss"
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
                                    <h5 class="m-0">Manage Owner Details</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="icfrontimage"  header="IC  front image" :showAddButton="false"  filterField="icfrontimage"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">IC  front image</span>
        
    <Image v-if="slotProps.data.icfrontimage!='' && slotProps.data.icfrontimage!=undefined" preview  alt="Image" width="250"  :src="config.serverURI+'/' + slotProps.data.icfrontimage">
        <template #indicatoricon>
            
            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
        
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'icfrontimage')" />
        </template>
    </Image>
    
    <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
           <template #indicatoricon>
               <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'icfrontimage')" />
           </template>
    </Image>
        
    </template>
    <template #filter="{ filterModel }">
    
    </template>
</Column>
<Column field="icbackimage"  header="IC Back Image" :showAddButton="false"  filterField="icbackimage"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">IC Back Image</span>
        
    <Image v-if="slotProps.data.icbackimage!='' && slotProps.data.icbackimage!=undefined" preview  alt="Image" width="250"  :src="config.serverURI+'/' + slotProps.data.icbackimage">
        <template #indicatoricon>
            
            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
        
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'icbackimage')" />
        </template>
    </Image>
    
    <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
           <template #indicatoricon>
               <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'icbackimage')" />
           </template>
    </Image>
        
    </template>
    <template #filter="{ filterModel }">
    
    </template>
</Column>  
            

          
         
<Column field="name"  header="Name" :showAddButton="false"  filterField="name"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Name</span>
        {{slotProps.data.name}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Name" />
                
    </template>
</Column>
            
            

          
         
<Column field="contactnumber"  header="Contact Number" :showAddButton="false"  filterField="contactnumber"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Contact Number</span>
        {{slotProps.data.contactnumber}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Contactnumber" />
                
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
            
            

          
         
<Column field="icno"  header="IC no" :showAddButton="false"  filterField="icno"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">IC no</span>
        {{slotProps.data.icno}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Icno" />
                
    </template>
</Column>
            
            

          
         

            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editOwnerDetails(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteOwnerDetails(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/ownerDetails/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="ownerDetailsDialog" :style="{ width: '450px' }" header="OwnerDetails Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="name">Name</label>
         <InputText id="name" type="text" v-model="ownerDetails.name"  autoFocus  required :class="{ 'p-invalid': submitted && !ownerDetails.name }" />
    </div>
            

    <div class="field">
        <label htmlFor="contactnumber">Contact Number</label>
         <InputText id="contactnumber" type="text" v-model="ownerDetails.contactnumber"  autoFocus  required :class="{ 'p-invalid': submitted && !ownerDetails.contactnumber }" />
    </div>
            

    <div class="field">
        <label htmlFor="email">Email</label>
         <InputText id="email" type="text" v-model="ownerDetails.email"  autoFocus  required :class="{ 'p-invalid': submitted && !ownerDetails.email }" />
    </div>
            

    <div class="field">
        <label htmlFor="icno">IC no</label>
         <InputText id="icno" type="text" v-model="ownerDetails.icno"  autoFocus  required :class="{ 'p-invalid': submitted && !ownerDetails.icno }" />
    </div>
            


                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveOwnerDetails" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteOwnerDetailsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="ownerDetails"
                                    >Are you sure you want to delete <b>{{ ownerDetails.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOwnerDetailsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delOwnerDetails" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteOwnerDetailssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="ownerDetails">Are you sure you want to delete the selected ownerDetailss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteOwnerDetailssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedOwnerDetailss" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="ownerDetails" 
        :tableId="ownerDetails.id" 
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
        table="ownerDetails" 
        :tableId="ownerDetails.id" 
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
        
            
           
            
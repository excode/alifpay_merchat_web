
<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useMerchantPhotosStore } from '@/stores/modules/MerchantPhotos';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';


import { useLoginStore } from '@/stores/modules/Login';
            

import { validate, validateForm } from '@/lib/validation';
    const { merchantPhotoss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useMerchantPhotosStore())
    const {  
    getMerchantPhotos,
    updateMerchantPhotosValue ,
    addMerchantPhotos,
    updateMerchantPhotos,
    deleteMerchantPhotos
    } = useMerchantPhotosStore()


const toast = useToast();
const { contextPath } = useLayout();
const merchantPhotosDialog = ref(false);
const deleteMerchantPhotosDialog = ref(false);
const deleteMerchantPhotossDialog = ref(false);
const merchantPhotos = ref({});
const selectedMerchantPhotoss = ref(null);
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
    {id:'title',type:validate.text,max:0,min:0,required:true},
    {id:'approved',type:validate.boolean,required:false}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getMerchantPhotos()
    
//GET THE USER TOEKN           
getUserInfo()


});


const openNew = () => {
    let emptyMerchantPhotos = {
        title:'',
        approved:null
    };
    merchantPhotos.value = emptyMerchantPhotos;
    submitted.value = false;
    merchantPhotosDialog.value = true;
};

const hideDialog = () => {
    merchantPhotosDialog.value = false;
    submitted.value = false;
};

const saveMerchantPhotos = async() => {
    submitted.value = true;
    const validationErrors=validateForm(merchantPhotos.value,validation)
    if (validationErrors.length==0) {
    
        if (merchantPhotos.value.id) {
            await updateMerchantPhotos(merchantPhotos.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantPhotos Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addMerchantPhotos(merchantPhotos.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantPhotos Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        merchantPhotosDialog.value = false;
        merchantPhotos.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editMerchantPhotos = (editMerchantPhotos) => {
    
    merchantPhotos.value = { ...editMerchantPhotos };
    merchantPhotosDialog.value = true;
};

const confirmDeleteMerchantPhotos = (editMerchantPhotos) => {
    merchantPhotos.value = { ...editMerchantPhotos };
    deleteMerchantPhotosDialog.value = true;
};

const delMerchantPhotos = async() => {
    await deleteMerchantPhotos(merchantPhotos.value.id);
    deleteMerchantPhotosDialog.value = false;
    if(error.value==undefined || error.value==null){
    merchantPhotos.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantPhotos Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    merchantPhotos.value =  {...merchantPhotos.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < merchantPhotoss.value.length; i++) {
        if (merchantPhotoss.value[i].id === id) {
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
    deleteMerchantPhotossDialog.value = true;
};
const deleteSelectedMerchantPhotoss = () => {
    merchantPhotoss.value = merchantPhotoss.value.filter((val) => !selectedMerchantPhotoss.value.includes(val));
    deleteMerchantPhotossDialog.value = false;
    selectedMerchantPhotoss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantPhotoss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        approved: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
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
        
        await getMerchantPhotos(searchObj);
}     
       
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateMerchantPhotosValue(merchantPhotos.value.id,newUploadedFileName,colName)         
    };
    const downloadFile=(e,data,dbColName) => {
        e.stopPropagation();
        let fileLink = config.serverURIMer+"/"+data[dbColName];
        var link=document.createElement('a');
        document.body.appendChild(link);
        link.href=fileLink ;
        link.target ="_blank"
        link.click();

    }
    const showUploadDialog = (e,data,dbColName,title,accept="image/*") => {
        e.stopPropagation();
        merchantPhotos.value={ ...data };
        let uploadData =  {url:config.serverURIMer,dbColName:title,accept:accept}
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
                            :value="merchantPhotoss"
                            v-model:selection="selectedMerchantPhotoss"
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
                                    <h5 class="m-0">Manage MerchantPhotoss</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="uploadedPhoto"  header="Uploaded Photo" :showAddButton="false"  filterField="uploadedPhoto"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Uploaded Photo</span>
        <h4>{{slotProps.data.title}}</h4>
    <Image v-if="slotProps.data.uploadedPhoto!='' && slotProps.data.uploadedPhoto!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + slotProps.data.uploadedPhoto">
        <template #indicatoricon>
            
            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
        
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'uploadedPhoto',slotProps.data.title)" />
        </template>
    </Image>
    
    <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
           <template #indicatoricon>
               <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'uploadedPhoto',slotProps.data.title)" />
           </template>
    </Image>
        
    </template>
    <template #filter="{ filterModel }">
    
    </template>
</Column>
            
            

          
         
<Column field="title"  header="Title" :showAddButton="false"  filterField="title"  :sortable="true" headerStyle="width:24%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Title</span>
        {{slotProps.data.title}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by title" />
                
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
            
            

          
         
<Column field="approved"  dataType="boolean"   header="Approved" :showAddButton="false"  filterField="approved"  :sortable="true" headerStyle="width:20%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Approved</span>
        {{slotProps.data.approved}}
    </template>
    <template #filter="{ filterModel }">
    
        <TriStateCheckbox v-model="filterModel.value"   />
            
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editMerchantPhotos(slotProps.data)" />
                                    
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/merchantPhotos/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="merchantPhotosDialog" :style="{ width: '450px' }" header="Merchant Photos" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="title">Title</label>
         <InputText id="title" type="text" v-model="merchantPhotos.title"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantPhotos.title }" />
    </div>
            


    <div class="field">
        <label htmlFor="approved">Approved</label>
         <TriStateCheckbox name="approved" id="approved" v-model="merchantPhotos.approved"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMerchantPhotos" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantPhotosDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantPhotos"
                                    >Are you sure you want to delete <b>{{ merchantPhotos.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantPhotosDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delMerchantPhotos" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantPhotossDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantPhotos">Are you sure you want to delete the selected merchantPhotoss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantPhotossDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedMerchantPhotoss" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="merchantPhotos" 
        :tableId="merchantPhotos.id" 
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
        
            
           
            
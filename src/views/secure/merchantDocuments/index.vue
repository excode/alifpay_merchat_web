
<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useLoginStore } from '@/stores/modules/Login';
import { useMerchantDocumentsStore } from '@/stores/modules/MerchantDocuments';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';
const { userInfo} = storeToRefs(useLoginStore())
    const {  
        getUserInfo,
      } = useLoginStore()         

import { validate, validateForm } from '@/lib/validation';
    const { merchantDocumentss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useMerchantDocumentsStore())
    const {  
    getMerchantDocuments,
    updateMerchantDocumentsValue ,
    addMerchantDocuments,
    updateMerchantDocuments,
    deleteMerchantDocuments
    } = useMerchantDocumentsStore()


const toast = useToast();
const { contextPath } = useLayout();
const merchantDocumentsDialog = ref(false);
const deleteMerchantDocumentsDialog = ref(false);
const deleteMerchantDocumentssDialog = ref(false);
const merchantDocuments = ref({});
const selectedMerchantDocumentss = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// THE VALIDATION RULES
const validation=[
    {id:'acknowledgement',type:validate.boolean,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getMerchantDocuments()
    getUserInfo()

});
///
const uploadDialog = ref(false);
    const currentImage = ref('');
    const uploadInfo = ref(null);
    const updateFileName = (newUploadedFileName,colName) => {
        let _merchantDocuments = {...merchantDocuments.value,[colName]:newUploadedFileName}
        merchantDocuments.value=_merchantDocuments     
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
        merchantDocuments.value={ ...data };
        let uploadData =  {url:config.serverURIMer,dbColName:title,accept:accept}
        uploadInfo.value = uploadData;
        uploadDialog.value = true;
        
    };
    const hideUploadDialog = () => {
        uploadDialog.value = false;
    
    };
    
    ///

const openNew = () => {
    let emptyMerchantDocuments = {
        acknowledgement:null
    };
    merchantDocuments.value = emptyMerchantDocuments;
    submitted.value = false;
    merchantDocumentsDialog.value = true;
};

const hideDialog = () => {
    merchantDocumentsDialog.value = false;
    submitted.value = false;
};

const saveMerchantDocuments = async() => {
    submitted.value = true;
    const validationErrors=validateForm(merchantDocuments.value,validation)
    if (validationErrors.length==0) {
    
        if (merchantDocuments.value.id) {
            await updateMerchantDocuments(merchantDocuments.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDocuments Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addMerchantDocuments(merchantDocuments.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDocuments Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        merchantDocumentsDialog.value = false;
        merchantDocuments.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editMerchantDocuments = (editMerchantDocuments) => {
    
    merchantDocuments.value = { ...editMerchantDocuments };
    merchantDocumentsDialog.value = true;
};

const confirmDeleteMerchantDocuments = (editMerchantDocuments) => {
    merchantDocuments.value = { ...editMerchantDocuments };
    deleteMerchantDocumentsDialog.value = true;
};

const delMerchantDocuments = async() => {
    await deleteMerchantDocuments(merchantDocuments.value.id);
    deleteMerchantDocumentsDialog.value = false;
    if(error.value==undefined || error.value==null){
    merchantDocuments.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDocuments Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    merchantDocuments.value =  {...merchantDocuments.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < merchantDocumentss.value.length; i++) {
        if (merchantDocumentss.value[i].id === id) {
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
    deleteMerchantDocumentssDialog.value = true;
};
const deleteSelectedMerchantDocumentss = () => {
    merchantDocumentss.value = merchantDocumentss.value.filter((val) => !selectedMerchantDocumentss.value.includes(val));
    deleteMerchantDocumentssDialog.value = false;
    selectedMerchantDocumentss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDocumentss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        acknowledgement: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
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
        
        await getMerchantDocuments(searchObj);
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
                            :value="merchantDocumentss"
                            v-model:selection="selectedMerchantDocumentss"
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
                                    <h5 class="m-0">Manage Merchant Documents</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="ssm"  header="Documents" :showAddButton="false"  filterField="ssm"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">{{slotProps.data.title}}</span>
       
        <h4>{{slotProps.data.title}}</h4>
        <Image v-if="slotProps.data.ssm!='' && slotProps.data.ssm!=undefined && slotProps.data.ssm.match(/.(pdf|doc|docx)$/i)" preview   alt="Image" width="250"  src="/file_icon.png">
            <template #indicatoricon>
                
            <Button  icon="pi pi-download" class="p-button-rounded p-button-warning mr-2" @click="$event=>downloadFile($event,slotProps.data,'ssm')"  />
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'ssm',slotProps.data.title,'application/pdf,.pptx,.docx,.doc')" />
            </template>
          </Image>
         
        <Image v-else   alt="Image" width="250" preview  src="/file_icon_na.png">
               <template #indicatoricon>
                   <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'ssm',slotProps.data.title,'application/pdf,.pptx,.docx,.doc')" />
               </template>
        </Image>

    </template>
    <template #filter="{ filterModel }">
    
    </template>
</Column>
            
            

          
         

            
            

          
         
<Column field="acknowledgement"  dataType="boolean"   header="Acknowledgement" :showAddButton="false"  filterField="acknowledgement"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Acknowledgement</span>
        {{slotProps.data.acknowledgement}}
    </template>
    <template #filter="{ filterModel }">
    
        <TriStateCheckbox v-model="filterModel.value"   />
            
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
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editMerchantDocuments(slotProps.data)" />
                                   
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/merchantDocuments/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="merchantDocumentsDialog" :style="{ width: '450px' }" header="MerchantDocuments Details" :modal="true" class="p-fluid">
                            
                            



    <div class="field">
        <label htmlFor="acknowledgement">Acknowledgement</label>
         <TriStateCheckbox name="acknowledgement" id="acknowledgement" v-model="merchantDocuments.acknowledgement"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMerchantDocuments" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantDocumentsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantDocuments"
                                    >Are you sure you want to delete <b>{{ merchantDocuments.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantDocumentsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delMerchantDocuments" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantDocumentssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantDocuments">Are you sure you want to delete the selected merchantDocumentss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantDocumentssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedMerchantDocumentss" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
            <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
                <CustomFileUpload 
                :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
                :url="uploadInfo?.url" 
                table="merchantDocuments" 
                :tableId="merchantDocuments.id" 
                :maxFileSize="10000000" 
                :token="userInfo.token"
                :accept="uploadInfo?.accept" 
                fieldName="uploadFile" 
                :dbColName="uploadInfo?.dbColName" />      
            </Dialog>    
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
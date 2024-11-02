
<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useAccountsStore } from '@/stores/modules/Accounts';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

import { formatDateReadable } from '@/lib/functions';
const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short"
};
            

import { validate, validateForm } from '@/lib/validation';
    const { accountss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useAccountsStore())
    const {  
    getAccounts,
    updateAccountsValue ,
    addAccounts,
    updateAccounts,
    deleteAccounts
    } = useAccountsStore()


const toast = useToast();
const { contextPath } = useLayout();
const accountsDialog = ref(false);
const deleteAccountsDialog = ref(false);
const deleteAccountssDialog = ref(false);
const accounts = ref({});
const selectedAccountss = ref(null);
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


//const { accountTypes} = storeToRefs(useAccountTypeStore())
//const {  
//getAccountTypeAll
//} = useAccountTypeStore()
                
// THE VALIDATION RULES
const validation=[
    {id:'username',type:validate.text,max:0,min:0,required:true},
    {id:'email',type:validate.email,max:250,min:5,required:true},
    {id:'mobileno',type:validate.phone,max:0,min:0,required:true},
    {id:'name',type:validate.text,max:150,min:2,required:true},
    {id:'password',type:validate.password,max:0,min:0,required:true},
   // {id:'address',type:validate.text,max:250,min:2,required:false},
   // {id:'city',type:validate.text,max:0,min:0,required:false},
  //  {id:'state',type:validate.text,required:false},
   // {id:'postcode',type:validate.text,max:0,min:0,required:false},
   // {id:'country',type:validate.text,required:false},
   // {id:'verfricationstatus',type:validate.number,required:true},
   // {id:'acctype',type:validate.text,required:true},
   // {id:'contactnumber',type:validate.phone,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getAccounts()
    
//GET THE USER TOEKN           
    getUserInfo()

         
   // await getAccountTypeAll({});
          

});


const openNew = () => {
    let emptyAccounts = {
        username:'',
email:'',
name:'',
password:'',
address:'',
city:'',
state:null,
postcode:'',
country:null,
verfricationstatus:null,
acctype:null,
mobileno:''
    };
    accounts.value = emptyAccounts;
    submitted.value = false;
    accountsDialog.value = true;
};

const hideDialog = () => {
    accountsDialog.value = false;
    submitted.value = false;
};

const saveAccounts = async() => {
    submitted.value = true;
    const validationErrors=validateForm(accounts.value,validation)
    if (validationErrors.length==0) {
    
        if (accounts.value.id) {
            await updateAccounts(accounts.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Accounts Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addAccounts(accounts.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Accounts Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        accountsDialog.value = false;
        accounts.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editAccounts = (editAccounts) => {
    
    accounts.value = { ...editAccounts };
    accountsDialog.value = true;
};

const confirmDeleteAccounts = (editAccounts) => {
    accounts.value = { ...editAccounts };
    deleteAccountsDialog.value = true;
};

const delAccounts = async() => {
    await deleteAccounts(accounts.value.id);
    deleteAccountsDialog.value = false;
    if(error.value==undefined || error.value==null){
    accounts.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Accounts Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    accounts.value =  {...accounts.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < accountss.value.length; i++) {
        if (accountss.value[i].id === id) {
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
    deleteAccountssDialog.value = true;
};
const deleteSelectedAccountss = () => {
    accountss.value = accountss.value.filter((val) => !selectedAccountss.value.includes(val));
    deleteAccountssDialog.value = false;
    selectedAccountss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Accountss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
walletbalance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
verfricationstatus: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
city: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
postcode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
country: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
acctype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
mobileno: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getAccounts(searchObj);
}     
       

    const states =[
	{value:"Kedha",name:"Kedha"},
	{value:"Kuala Lumpur",name:"Kuala Lumpur"},
	{value:"Selangor",name:"Selangor"}
]
                
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateAccountsValue(accounts.value.id,newUploadedFileName,colName)         
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
        accounts.value={ ...data };
        let uploadData =  {url:config.serverURI,dbColName:dbColName,accept:accept}
        uploadInfo.value = uploadData;
        uploadDialog.value = true;
        
    };
    const hideUploadDialog = () => {
        uploadDialog.value = false;
    
    };
    
              

    const countrys =[
	{value:"Malaysia",name:"Malaysia"},
	{value:"Singapore",name:"Singapore"}
]
                

    const statuss =[
	{value:"Pending",name:"Pending"},
	{value:"Active",name:"Active"},
	{value:"Blocked",name:"Blocked"}
]
                

    const verfricationstatuss =[
	{value:"Pending",name:"Pending"},
	{value:"Submitted",name:"Submitted"},
	{value:"Processing",name:"Processing"},
	{value:"Approved",name:"Approved"},
	{value:"Declined",name:"Declined"}
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
                            :value="accountss"
                            v-model:selection="selectedAccountss"
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
                                    <h5 class="m-0">Manage Accountss</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="username"  header="Username" :showAddButton="false"  filterField="username"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Username</span>
        {{slotProps.data.username}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Username" />
                
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
            
            

          
         
<Column field="name"  header="Name" :showAddButton="false"  filterField="name"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Name</span>
        {{slotProps.data.name}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Name" />
                
    </template>
</Column>
 
<Column field="mobileno"  header="Mobile" :showAddButton="false"  filterField="mobileno"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Mobile</span>
        {{slotProps.data.mobileno}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by mobile" />
                
    </template>
</Column>

<Column field="createby"  header="Reg.By" :showAddButton="false"  filterField="createby"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Create by</span>
        {{slotProps.data.createby}}
    </template>
    
</Column>
<Column field="createat"  header="Reg.Date" :showAddButton="false"  filterField="createat"  :sortable="true" headerStyle="width:14%; min-width:20rem;">
    <template #body="slotProps">
        <span class="p-column-title">Date</span>
        {{ formatDateReadable(slotProps.data.createat)}}
    </template>
    
</Column>

            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                   
                                    
                                    <Tag v-if="slotProps.data.uid=='0'" severity="danger">Pending</Tag>
                                    <Tag v-if="slotProps.data.uid!='0'" severity="success">Wallet created</Tag>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="accountsDialog" :style="{ width: '450px' }" header="Accounts Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="username">Username</label>
         <InputText id="username" type="text" v-model="accounts.username"  autoFocus  required :class="{ 'p-invalid': submitted && !accounts.username }" />
    </div>
            

    <div class="field">
        <label htmlFor="email">Email</label>
         <InputText id="email" type="text" v-model="accounts.email"  autoFocus  required :class="{ 'p-invalid': submitted && !accounts.email }" />
    </div>
            

    <div class="field">
        <label htmlFor="name">Name</label>
         <InputText id="name" type="text" v-model="accounts.name"  autoFocus  required :class="{ 'p-invalid': submitted && !accounts.name }" />
    </div>
            

    <div class="field">
        <label htmlFor="mobileno">Mobile</label>
         <InputText id="mobileno" type="text" v-model="accounts.mobileno"  autoFocus  required :class="{ 'p-invalid': submitted && !accounts.mobileno }" />
    </div>
            
                   
    <div class="field">
        <label htmlFor="password">Password</label>
         <Password id="password" v-model="accounts.password"  toggleMask  required :class="{ 'p-invalid': submitted && !accounts.password }" />
    </div>
            




    
            


   
  

    
            
         <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveAccounts" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteAccountsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="accounts"
                                    >Are you sure you want to delete <b>{{ accounts.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAccountsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delAccounts" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteAccountssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="accounts">Are you sure you want to delete the selected accountss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteAccountssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedAccountss" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="accounts" 
        :tableId="accounts.id" 
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
        
            
           
            
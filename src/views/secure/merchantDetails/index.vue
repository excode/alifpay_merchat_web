
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { fixDate } from '@/lib/functions';
import { useLoginStore } from '@/stores/modules/Login';
import { useMerchantDetailsStore } from '@/stores/modules/MerchantDetails';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';


import { countrys } from '@/lib/countrys';
import { states } from '@/lib/states';
import { validate, validateForm } from '@/lib/validation';
    const { merchantDetailss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useMerchantDetailsStore())
    const {  
    getMerchantDetails,
    sendApplication ,
    addMerchantDetails,
    updateMerchantDetails,
    deleteMerchantDetails
    } = useMerchantDetailsStore()

const { userInfo} = storeToRefs(useLoginStore())
const {  
    getUserInfo
  } = useLoginStore()

const toast = useToast();
const { contextPath } = useLayout();
const merchantDetailsDialog = ref(false);
const deleteMerchantDetailsDialog = ref(false);
const deleteMerchantDetailssDialog = ref(false);
const merchantDetails = ref({});
const selectedMerchantDetailss = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// THE VALIDATION RULES
const validation=[
    {id:'name',type:validate.text,max:0,min:0,required:true},
{id:'email',type:validate.email,max:0,min:0,required:true},
{id:'registeredName',type:validate.text,max:0,min:0,required:true},
{id:'companyRegisteredNo',type:validate.text,max:0,min:0,required:true},
{id:'tradingName',type:validate.text,max:0,min:0,required:true},
{id:'companyType',type:validate.text,required:true},
{id:'dateEstablished',type:validate.date,max:0,min:0,required:true},
{id:'organizationSize',type:validate.text,required:true},
{id:'telOffice',type:validate.phone,max:0,min:0,required:true},
{id:'faxOffice',type:validate.phone,max:0,min:0,required:false},
{id:'contactPerson',type:validate.text,max:0,min:0,required:true},
{id:'mobile',type:validate.phone,max:0,min:0,required:true},
{id:'contactEmail',type:validate.email,max:0,min:0,required:true},
{id:'companyAddress',type:validate.text,max:0,min:0,required:true},
{id:'address',type:validate.text,max:0,min:0,required:true},
{id:'country',type:validate.text,required:true},
{id:'state',type:validate.text,required:true},
{id:'city',type:validate.text,max:0,min:0,required:true},
{id:'postcode',type:validate.text,max:0,min:0,required:true},
{id:'active',type:validate.boolean,required:false}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getMerchantDetails()
    getUserInfo();

});

const sendApplication2 =async()=>{
    await sendApplication();
    if(error.value==undefined || error.value==null){
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Email sent for Merchant verification', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
}
const openNew = () => {
    let emptyMerchantDetails = {
        name:'',
        email:'',
        registeredName:'',
        companyRegisteredNo:'',
        tradingName:'',
        companyType:null,
        dateEstablished:null,
        organizationSize:null,
        telOffice:'',
        faxOffice:'',
        contactPerson:'',
        mobile:'',
        contactEmail:'',
        companyAddress:'',
        address:'',
        country:null,
        state:null,
        city:'',
        postcode:'',
        username:'',
        introducer:'',
        active:false,
        approvedByMPay:null,
        approvedByAlifPay:null
    };
    merchantDetails.value = emptyMerchantDetails;
    submitted.value = false;
    merchantDetailsDialog.value = true;
};

const hideDialog = () => {
    merchantDetailsDialog.value = false;
    submitted.value = false;
};

const saveMerchantDetails = async() => {
    submitted.value = true;
    const validationErrors=validateForm(merchantDetails.value,validation)
    if (validationErrors.length==0) {
    
        if (merchantDetails.value.id) {
            await updateMerchantDetails(merchantDetails.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDetails Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addMerchantDetails(merchantDetails.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDetails Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        merchantDetailsDialog.value = false;
        merchantDetails.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editMerchantDetails = (editMerchantDetails) => {
    editMerchantDetails.dateEstablished =fixDate(editMerchantDetails.dateEstablished)
    merchantDetails.value = { ...editMerchantDetails };
    merchantDetailsDialog.value = true;
};

const confirmDeleteMerchantDetails = (editMerchantDetails) => {
    merchantDetails.value = { ...editMerchantDetails };
    deleteMerchantDetailsDialog.value = true;
};

const delMerchantDetails = async() => {
    await deleteMerchantDetails(merchantDetails.value.id);
    deleteMerchantDetailsDialog.value = false;
    if(error.value==undefined || error.value==null){
    merchantDetails.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDetails Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    merchantDetails.value =  {...merchantDetails.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < merchantDetailss.value.length; i++) {
        if (merchantDetailss.value[i].id === id) {
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
    deleteMerchantDetailssDialog.value = true;
};
const deleteSelectedMerchantDetailss = () => {
    merchantDetailss.value = merchantDetailss.value.filter((val) => !selectedMerchantDetailss.value.includes(val));
    deleteMerchantDetailssDialog.value = false;
    selectedMerchantDetailss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'MerchantDetailss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
introducer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
registeredName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
companyRegisteredNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
postcode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },

approvedByMPay: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
approvedByAlifPay: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
tradingName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
companyType: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
dateEstablished: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
organizationSize: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
telOffice: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
faxOffice: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
contactPerson: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
mobile: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
contactEmail: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
companyAddress: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
country: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
city: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getMerchantDetails(searchObj);
}     
       

    const companyTypes =[
	{value:"Sole proprietorship",name:"Sole proprietorship"},
	{value:"Partnership",name:"Partnership"},
	{value:"Private limited company ",name:"Private limited company "},
	{value:"Public limited company ",name:"Public limited company "},
	{value:"Unlimited",name:"Unlimited"}
]
                

    const organizationSizes =[
	{value:"0-10",name:"0-10"},
	{value:"11-50",name:"11-50"},
	{value:"51-100",name:"51-100"},
	{value:"101+",name:"101+"}
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
                            :value="merchantDetailss"
                            v-model:selection="selectedMerchantDetailss"
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
                                    <h5 class="m-0">Manage Merchant Details</h5>
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
                            <Column field="introducer"  header="Introducer" :showAddButton="false"  filterField="introducer"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <span class="p-column-title">Introducer</span>
                                    {{slotProps.data.introducer}}
                                </template>
                                <template #filter="{ filterModel }">
                                
                                     <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Introducer" />
                                            
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
            
            

          
         
<Column field="email"  header="Email" :showAddButton="false"  filterField="email"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Email</span>
        {{slotProps.data.email}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Email" />
                
    </template>
</Column>
            
            

       
            
            

         
            
            

          
  

          
         

            
            

   
            

        
            
            

       
            
            

          
         

            

  
<Column field="contactPerson"  header="Contact Person" :showAddButton="false"  filterField="contactPerson"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Contact Person</span>
        {{slotProps.data.contactPerson}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by ContactPerson" />
                
    </template>
</Column>
            
            

          
         
<Column field="mobile"  header="Mobile" :showAddButton="false"  filterField="mobile"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Mobile</span>
        {{slotProps.data.mobile}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Mobile" />
                
    </template>
</Column>
            
            

          
         

            


            
            

          
         
<Column field="state"   header="State" :showAddButton="false"  filterField="state"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">State</span>
        {{slotProps.data.state}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="states"   optionLabel="name" optionValue="value" placeholder="Search by state" className="p-column-filter" />           

    </template>
</Column>
            
  

          
         

            
            
                            
                            <Column headerStyle="min-width:15rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editMerchantDetails(slotProps.data)" />
                                   
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/merchantDetails/'+slotProps.data.id)"></Button>

                                    <Button icon="pi pi-send" class="p-button-rounded p-button-warning mt-2" @click="sendApplication2"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="merchantDetailsDialog" :style="{ width: '450px' }" header="Merchant Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="name">Name *</label>
         <InputText id="name" type="text" v-model="merchantDetails.name"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.name }" />
    </div>
            

    <div class="field">
        <label htmlFor="email">Email *</label>
         <InputText id="email" type="text" v-model="merchantDetails.email"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.email }" />
    </div>
            

    <div class="field">
        <label htmlFor="registeredName">Registered Name *</label>
         <InputText id="registeredName" type="text" v-model="merchantDetails.registeredName"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.registeredName }" />
    </div>
            

    <div class="field">
        <label htmlFor="companyRegisteredNo">Company Registered No *</label>
         <InputText id="companyRegisteredNo" type="text" v-model="merchantDetails.companyRegisteredNo"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.companyRegisteredNo }" />
    </div>
            

    <div class="field">
        <label htmlFor="tradingName">Trading Name/ Doing Business as *</label>
         <InputText id="tradingName" type="text" v-model="merchantDetails.tradingName"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.tradingName }" />
    </div>
            

    <div class="field">
        <label htmlFor="companyType">Company Type *</label>
         <Dropdown   id="companyType" optionLabel="name" optionValue="value"  v-model="merchantDetails.companyType" :options="companyTypes"   />
    </div>
            

    <div class="field">
        <label htmlFor="dateEstablished">Date Established *</label>
         <Calendar id="dateEstablished" v-model="merchantDetails.dateEstablished"   dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999"   autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.dateEstablished }" />
    </div>
            

    <div class="field">
        <label htmlFor="organizationSize">Organization Size(Number of staffs) *</label>
         <Dropdown   id="organizationSize" optionLabel="name" optionValue="value"  v-model="merchantDetails.organizationSize" :options="organizationSizes"   />
    </div>
            

    <div class="field">
        <label htmlFor="telOffice">Tel (Office) *</label>
         <InputText id="telOffice" type="text" v-model="merchantDetails.telOffice"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.telOffice }" />
    </div>
            

    <div class="field">
        <label htmlFor="faxOffice">Fax (Office)</label>
         <InputText id="faxOffice" type="text" v-model="merchantDetails.faxOffice"  autoFocus  />
    </div>
            

    <div class="field">
        <label htmlFor="contactPerson">Contact Person *</label>
         <InputText id="contactPerson" type="text" v-model="merchantDetails.contactPerson"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.contactPerson }" />
    </div>
            

    <div class="field">
        <label htmlFor="mobile">Mobile *</label>
         <InputText id="mobile" type="text" v-model="merchantDetails.mobile"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.mobile }" />
    </div>
            

    <div class="field">
        <label htmlFor="contactEmail">Contact Email *</label>
         <InputText id="contactEmail" type="text" v-model="merchantDetails.contactEmail"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.contactEmail }" />
    </div>
            

    <div class="field">
        <label htmlFor="companyAddress">Company Address (Street Number)*</label>
         <InputText id="companyAddress" type="text" v-model="merchantDetails.companyAddress"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.companyAddress }" />
    </div>
            

    <div class="field">
        <label htmlFor="address">Address</label>
         <InputText id="address" type="text" v-model="merchantDetails.address"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.address }" />
    </div>
            

    <div class="field">
        <label htmlFor="country">Country *</label>
         <Dropdown   id="country" optionLabel="Country" filter optionValue="Country"  v-model="merchantDetails.country" :options="countrys"   />
    </div>
            

    <div class="field">
        <label htmlFor="state">State *</label>
         <Dropdown   id="state" optionLabel="State" filter optionValue="State"  v-model="merchantDetails.state" :options="states"   />
    </div>
            

    <div class="field">
        <label htmlFor="city">City *</label>
         <InputText id="city" type="text" v-model="merchantDetails.city"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.city }" />
    </div>
            

    <div class="field">
        <label htmlFor="postcode">Postcode *</label>
         <InputText id="postcode" type="text" v-model="merchantDetails.postcode"  autoFocus  required :class="{ 'p-invalid': submitted && !merchantDetails.postcode }" />
    </div>
            

    
            

    <div class="field" v-if="userInfo.userType<2">
        <label htmlFor="active">Active</label>
         <TriStateCheckbox name="active" id="active" v-model="merchantDetails.active"   />
    </div>
            

    <div class="field" v-if="userInfo.userType<2">
        <label htmlFor="approvedByMPay">Approved By MPay</label>
         <TriStateCheckbox name="approvedByMPay" id="approvedByMPay" v-model="merchantDetails.approvedByMPay"   />
    </div>
            

    <div class="field"  v-if="userInfo.userType<2">
        <label htmlFor="approvedByAlifPay">Approved By AlifPay</label>
         <TriStateCheckbox name="approvedByAlifPay" id="approvedByAlifPay" v-model="merchantDetails.approvedByAlifPay"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveMerchantDetails" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantDetailsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantDetails"
                                    >Are you sure you want to delete <b>{{ merchantDetails.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantDetailsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delMerchantDetails" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteMerchantDetailssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="merchantDetails">Are you sure you want to delete the selected merchantDetailss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMerchantDetailssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedMerchantDetailss" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
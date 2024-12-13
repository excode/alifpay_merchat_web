<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { countrys } from '@/lib/countrys';
import { states } from '@/lib/states';
import { useBusinessCategoryStore } from '@/stores/modules/BusinessCategory';
import { useLoginStore } from '@/stores/modules/Login';
import { useStoresStore } from '@/stores/modules/Stores';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
//import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
//GOOGLE MAP         

const route = useRoute();


const pageName = ref("");

const center = ref({});
const storeWallet = ref({});
const setPlace = (place) => {
    console.log(place)
    /*
      let lat = place.geometry.location.lat()
      let lng = place.geometry.location.lng()
      // Update the location details
     // locationDetails.value.address = place.formatted_address
     // locationDetails.value.url = place.url
      center.value = { lat: lat , lng: lng }
      console.log(center.value)
      console.log(center.value)
      */
    }
    const pageTitle = computed(() => {
    if(route.name=="stores"){
        const namesToRemove = ['Community', 'Insurance', 'Marketplace'];
            const filteredItems = businessCategorys.value.filter(item => !namesToRemove.includes(item.categoryName));
           
        businessCategorys.value=filteredItems
    }

    let val=route.name=="stores"?"Merchant":capitalizeFirstLetter(route.name)

   // await getStores({businessCategory:val})
  return val;

})
const latitude = ref(0);
const longitude = ref(0);
const defaultLat = 3.140853; // Default latitude (San Francisco)
const defaultLng = 101.693207; // Default longitude (San Francisco)
const autocompleteInput = ref(null);

// END GOOGLE MAP
import { validate, validateForm } from '@/lib/validation';
    const { storess, error,curdLoading,loading_otp, loading,totalpages,page,totalRecords} = storeToRefs(useStoresStore())
    const {  
    getStores,
    updateStoresValue ,
    addStores,
    updateStores,
    deleteStores,
    updateStoreWallet,
    sendRequestOTP2
    } = useStoresStore()


const toast = useToast();
const { contextPath } = useLayout();
const storesDialog = ref(false);
const deleteStoresDialog = ref(false);
const deleteStoressDialog = ref(false);
const stores = ref({});
const selectedStoress = ref(null);
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
const { businessCategorys} = storeToRefs(useBusinessCategoryStore())
const {  
getBusinessCategoryAll
} = useBusinessCategoryStore()

// THE VALIDATION RULES
const validation=[
{id:'businessName',type:validate.text,max:0,min:0,required:true},
{id:'description',type:validate.text,max:0,min:0,required:false},
{id:'address',type:validate.text,max:0,min:0,required:true},
{id:'streetName',type:validate.text,max:0,min:0,required:false},
{id:'city',type:validate.text,max:0,min:0,required:true},
{id:'state',type:validate.text,max:0,min:0,required:true},
{id:'postcode',type:validate.text,max:0,min:0,required:false},
{id:'contact',type:validate.text,max:0,min:0,required:false},
{id:'sharingValue',type:validate.number,max:0,min:0,required:false},
{id:'price',type:validate.number,max:0,min:0,required:false},
{id:'businessCategory',type:validate.text,max:0,min:0,required:false},
{id:'halalClassification',type:validate.text,max:0,min:0,required:false},
{id:'country',type:validate.text,required:true},

]
//MAP
const editedItem = reactive({})
const halal =[
	{value:"Halal-Certified",name:"Halal-Certified"},
	{value:"Halal-Self Certified",name:"Halal-Self Certified"},
    {value:"Non-Halal",name:"Non-Halal"},
    {value:"Not-Required",name:"Not-Required"},
]
const map_api_token='AIzaSyBs60YGsJZtaoH-1mJnFoW6-fuqjKiSb6k'

  
//END MAP
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getStores({businessCategory:pageTitle.value})
    await getBusinessCategoryAll();
//GET THE USER TOEKN           
    getUserInfo();
     center.value = { lat: 3.140853, lng: 101.693207 }

    });
   
    function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}


   




const openNew = () => {
    let cat=route.name=="marketplace"?"marketplace":""
   // alert(cat)
    //console.log(cat)
    let emptyStores = {
        businessName:'',
        description:'',
        address:'',
        streetName:'',
        city:'',
        state:'',
        streetName:'',
        contact:'',
        postcode:'',
        halalClassification:"",
        price:0.0,
        sharingValue:0.0,
        businessCategory:cat,
        businessDays:'',
        businessHour:'9:30 AM-10:00 PM',
        country:null,
        location:{type:'Point',coordinates:[latitude.value,longitude.value]}
    };
    stores.value = emptyStores;
    submitted.value = false;
    storesDialog.value = true;
};

const hideDialog = () => {
    storesDialog.value = false;
    submitted.value = false;
};
const days=['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const saveStores = async() => {
    submitted.value = true;
    const validationErrors=validateForm(stores.value,validation)

    if (validationErrors.length==0) {
    
        if (stores.value.id) {
            await updateStores(stores.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Stores Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addStores(stores.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Stores Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        storesDialog.value = false;
        stores.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editStores = (editStores) => {
    
    stores.value = { ...editStores };
    storesDialog.value = true;
};

const confirmDeleteStores = (editStores) => {
    stores.value = { ...editStores };
    deleteStoresDialog.value = true;
};
const updateWallet = (editStores) => {
    stores.value = { ...editStores };
    deleteStoresDialog.value = true;
};
const saveWallet = async(editStores) => {
    storeWallet.value = { ... storeWallet.value,"storeId":editStores.id };
    console.log( stores.value.id)
    console.log( stores.value._id)
    console.log( "***************")
    console.log( storeWallet.value)
    await updateStoreWallet(storeWallet.value);
    if(error.value==undefined || error.value==null){
   
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Merchant wallet has been linked', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};



const delStores = async() => {

    await sendRequestOTP2(storeWallet.value.username);
    //deleteStoresDialog.value = false;
    if(error.value==undefined || error.value==null){
   
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Please request wallet owner to send PIN to wallet link', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};

const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    stores.value =  {...stores.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < storess.value.length; i++) {
        if (storess.value[i].id === id) {
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
    deleteStoressDialog.value = true;
};
const deleteSelectedStoress = () => {
    storess.value = storess.value.filter((val) => !selectedStoress.value.includes(val));
    deleteStoressDialog.value = false;
    selectedStoress.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Storess Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        businessName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        streetName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        city: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        state: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        postcode: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        businessCategory: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        country: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        location: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getStores(searchObj);
}     
       
  
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateStoresValue(stores.value.id,newUploadedFileName,colName)         
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
    const showUploadDialog = (e,data,dbColName,accept="image/*") => {
        e.stopPropagation();
        stores.value={ ...data };
        let uploadData =  {url:config.serverURIMer,dbColName:dbColName,accept:accept}
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
                            :value="storess"
                            v-model:selection="selectedStoress"
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
                                    <h5 class="m-0">Manage {{pageTitle}}</h5>
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
        
    <Image v-if="slotProps.data.logo!='' && slotProps.data.logo!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + slotProps.data.logo">
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
            
            

          
         
<Column field="businessName"  header="Business Name" :showAddButton="false"  filterField="businessName"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Business Name</span>
        {{slotProps.data.businessName}}
        <Tag v-if="!slotProps.data.approved" severity="warn">Pending</Tag><Tag v-if="slotProps.data.approved" severity="success">Approved</Tag><Tag v-if="slotProps.data.approved" severity="success">Approved</Tag><Tag v-if="slotProps.data.disabled" severity="danger">disabled</Tag>
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by BusinessName" />
                
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
            
            

          
         
<Column field="state"  header="State" :showAddButton="false"  filterField="state"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">State</span>
        {{slotProps.data.state}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by State" />
                
    </template>
</Column>
            
            

          
         
<Column field="contact"  header="Contact" :showAddButton="false"  filterField="contact"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Contact</span>
        {{slotProps.data.contact}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by contact" />
                
    </template>
</Column>
            
            

  
            

          
         
<Column field="country"   header="Country" :showAddButton="false"  filterField="country"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Country</span>
        {{slotProps.data.country}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="countrys"   optionLabel="name" optionValue="value" placeholder="Search by country" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         

            
            
                            
                            <Column headerStyle="min-width:15rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editStores(slotProps.data)" />
                                    <Button icon="pi pi-wallet" class="p-button-rounded p-button-info mt-2" @click="updateWallet(slotProps.data)"></Button>
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-warning mr-2" @click="$router.push('/secure/stores/'+slotProps.data.id)"></Button>
                                    <Button icon="pi pi-qrcode" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/stores/qr/'+slotProps.data.id)"></Button>
                                  
                                    
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="storesDialog" :style="{ width: '450px' }" :header="pageTitle+ ' Details'" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="businessName">Business Name/Product</label>
         <InputText id="businessName" type="text" v-model="stores.businessName"  autoFocus  required :class="{ 'p-invalid': submitted && !stores.businessName }" />
    </div>
    <div class="field" v-if="route.name=='stores'">
        <label htmlFor="businessCategory">Business Category</label>
         <Dropdown   id="businessCategory"  optionLabel="categoryName" optionValue="categoryName"  v-model="stores.businessCategory" :options="businessCategorys"   />
    </div>    

    <div class="field">
        <label htmlFor="sharingValue">Sharing Value (%)</label>
        <InputText id="sharingValue" type="text" v-model="stores.sharingValue"  autoFocus  required :class="{ 'p-invalid': submitted && !stores.sharingValue }" />
    </div>    

    <div class="field" v-if="route.name=='marketplace'">
        <label htmlFor="price">Price (RM)</label>
        <InputText id="price" type="text" v-model="stores.price"  autoFocus />
    </div>    
    <div class="field">
        <label htmlFor="businessCategory">Halal Classification</label>
         <Dropdown   id="halalClassification"  optionLabel="value" optionValue="value"  v-model="stores.halalClassification" :options="halal"   />
    </div>       

    <div class="field">
        <label htmlFor="description">Description</label>
         <Textarea id="description" v-model="stores.description"  autosize rows="5" cols="30"    />
    </div>
    <div class="field">
        <label htmlFor="businessHour">Business Hours</label>
         <InputText id="businessHour" v-model="stores.businessHour"     />
    </div>
    <div class="field">
        <label htmlFor="businessDays">Operating days</label>
        
         <MultiSelect v-model="stores.businessDays" :options="days"  placeholder="Select Weekdays"
    :maxSelectedLabels="3" class="w-full md:w-20rem" />
    </div>
            
    <div class="field">
        <label htmlFor="contact">Contact</label>
         <InputText id="contact" type="text" v-model="stores.contact"  autoFocus  required :class="{ 'p-invalid': submitted && !stores.contact }" />
    </div>
    <div class="field">
        <label htmlFor="address">Address</label>
         <InputText id="address" type="text" v-model="stores.address"  autoFocus  required :class="{ 'p-invalid': submitted && !stores.address }" />
    </div>
            

    <div class="field">
        <label htmlFor="streetName">Street Name</label>
         <InputText id="streetName" type="text" v-model="stores.streetName"  autoFocus  />
    </div>
            

    <div class="field">
        <label htmlFor="city">City</label>
         <InputText id="city" type="text" v-model="stores.city"  autoFocus  required :class="{ 'p-invalid': submitted && !stores.city }" />
    </div>
            

   

    <div class="field">
        <label htmlFor="postcode">Postcode</label>
         <InputText id="postcode" type="text" v-model="stores.postcode"  autoFocus  />
    </div>
            

 
    <div class="field">
        <label htmlFor="state">State *</label>
         <Dropdown   id="state" optionLabel="State" filter optionValue="State"  v-model="stores.state" :options="states"   />
    </div>
    <div class="field">
        <label htmlFor="country">Country *</label>
         <Dropdown   id="country" optionLabel="Country" filter optionValue="Country"  v-model="stores.country" :options="countrys"   />
    </div>
            

   
            

    
            

                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveStores" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteStoresDialog" :style="{ width: '450px' }" header="Link with Wallet" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="stores"
                                    >Please request the wallet owner of <b>{{stores.businessName}}</b> to share the Authorization PIN, which can be generated from the Alif-Pay wallet app. If the username is not available, the system will not send an alert. Please confirm the username <b>{{storeWallet.username}}</b> before proceeding.</span
                                >
                                
                            </div>
                            <div class="field mt-3">
                                <label htmlFor="state" class="mr-3 mt-3">Wallet username</label>
                                <InputText id="wallet_username" type="text" v-model="storeWallet.username"  autoFocus  required :class="{ 'p-invalid': submitted && !storeWallet.username }" />
                            </div> 

                            <div class="field mb-3">
                                <label htmlFor="state" class="mr-3">Authorization PIN</label>
                                <InputText id="otp2" type="text" v-model="storeWallet.otp2"  autoFocus  required />
                                <span  v-if="loading_otp">Saving ... please wait</span>
                                <Button v-else label="Request to generate Authorization PIN" icon="pi pi-key" severity="help"  class=" mt-2" @click="delStores" />
                            </div> 
                            <template #footer>
                                <span  v-if="loading_otp">Saving ... please wait</span>
                                <Button v-else label="Update" icon="pi pi-save"  class="button button-success" @click="saveWallet(stores)" />
                                
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteStoressDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="stores">Are you sure you want to delete the selected storess?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteStoressDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedStoress" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="stores" 
        :tableId="stores.id" 
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
        
            
           
            
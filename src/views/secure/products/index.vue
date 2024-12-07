
<script setup>
import config from '@/config/index';
import { useLayout } from '@/layout/composables/layout';
import { useProductsStore } from '@/stores/modules/Products';
import { useStoresStore } from '@/stores/modules/Stores';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';


import { useLoginStore } from '@/stores/modules/Login';
            

import { validate, validateForm } from '@/lib/validation';
    const { productss,categories, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useProductsStore())
    const {  
    getProducts,
    getCategories,
    updateProductsValue ,
    addProducts,
    updateProducts,
    deleteProducts
    } = useProductsStore()
    const { storess} = storeToRefs(useStoresStore())
    const {  
        getStoresAll
    } = useStoresStore()

const toast = useToast();
const { contextPath } = useLayout();
const productsDialog = ref(false);
const deleteProductsDialog = ref(false);
const deleteProductssDialog = ref(false);
const products = ref({});
const selectedProductss = ref(null);
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
    {id:'category',type:validate.text,required:true},
    {id:'description',type:validate.text,max:0,min:0,required:false},
    {id:'price',type:validate.number,max:0,min:0,required:true},
    {id:'unit',type:validate.text,max:0,min:0,required:false}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getStoresAll();
    await getProducts()
    await getCategories({});    

//GET THE USER TOEKN           
getUserInfo()


});


const openNew = () => {
    let emptyProducts = {
        name:'',
        stores:'',
        category:null,
        description:'',
        price:0,
        unit:''
    };
    products.value = emptyProducts;
    submitted.value = false;
    productsDialog.value = true;
};

const hideDialog = () => {
    productsDialog.value = false;
    submitted.value = false;
};

const saveProducts = async() => {
    submitted.value = true;
    const validationErrors=validateForm(products.value,validation)
    if (validationErrors.length==0) {
    
        if (products.value.id) {
            await updateProducts(products.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addProducts(products.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        productsDialog.value = false;
        products.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editProducts = (editProducts) => {
    
    products.value = { ...editProducts };
    productsDialog.value = true;
};

const confirmDeleteProducts = (editProducts) => {
    products.value = { ...editProducts };
    deleteProductsDialog.value = true;
};

const delProducts = async() => {
    await deleteProducts(products.value.id);
    deleteProductsDialog.value = false;
    if(error.value==undefined || error.value==null){
    products.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    products.value =  {...products.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < productss.value.length; i++) {
        if (productss.value[i].id === id) {
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
    deleteProductssDialog.value = true;
};
const deleteSelectedProductss = () => {
    productss.value = productss.value.filter((val) => !selectedProductss.value.includes(val));
    deleteProductssDialog.value = false;
    selectedProductss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Productss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        stores: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        createBy: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        description: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        unit: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getProducts(searchObj);
}     
       
    
    const updateFileName = (newUploadedFileName,colName) => {
        updateProductsValue(products.value.id,newUploadedFileName,colName)         
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
        products.value={ ...data };
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
                            :value="productss"
                            v-model:selection="selectedProductss"
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
                                    <h5 class="m-0">Manage Productss</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="image"  header="Image" :showAddButton="false"  filterField="image"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Image</span>
        
    <Image v-if="slotProps.data.image!='' && slotProps.data.image!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + slotProps.data.image">
        <template #indicatoricon>
            
            <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
        
            <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'image')" />
        </template>
    </Image>
    
    <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
           <template #indicatoricon>
               <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,slotProps.data,'image')" />
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
            
            
<Column field="stores"   header="Stores" :showAddButton="false"  filterField="stores"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Business/Stores</span>
        {{slotProps.data.stores?.businessName}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown optionLabel="businessName" optionValue="id"  v-model="filterModel.value" :options="storess"    placeholder="Search by stores" className="p-column-filter" />           

    </template>
</Column>
          
         
<Column field="category"   header="Category" :showAddButton="false"  filterField="category"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Category</span>
        {{slotProps.data.category}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="categories"    placeholder="Search by category" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="price"  dataType="numeric" header="Price" :showAddButton="false"  filterField="price"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Price</span>
        {{slotProps.data.price}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Price" />
                
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
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProducts(slotProps.data)" />
                                   
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/products/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="productsDialog" :style="{ width: '450px' }" header="Products Details" :modal="true" class="p-fluid">
                            
                            <div class="field">
                                <label htmlFor="category">Business/Store Name</label>
                                 <Dropdown optionLabel="businessName" optionValue="id"   id="stores"     v-model="products.stores" :options="storess"   />
                            </div>                        
    <div class="field">
        <label htmlFor="name">Name</label>
         <InputText id="name" type="text" v-model="products.name"  autoFocus  required :class="{ 'p-invalid': submitted && !products.name }" />
    </div>
            

    <div class="field">
        <label htmlFor="category">Category</label>
         <Dropdown   id="category" editable    v-model="products.category" :options="categories"   />
    </div>
            

    <div class="field">
        <label htmlFor="description">Description</label>
         <Textarea id="description" v-model="products.description"  autosize rows="5" cols="30"    />
    </div>
            

    <div class="field">
        <label htmlFor="price">Price</label>
         <InputNumber id="price" v-model="products.price"   mode="currency" currency="MYR"  />
    </div>
            

    <div class="field">
        <label htmlFor="unit">Unit</label>
         <InputText id="unit" type="text" v-model="products.unit"  autoFocus  />
    </div>
            

                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProducts" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="products"
                                    >Are you sure you want to delete <b>{{ products.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delProducts" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteProductssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="products">Are you sure you want to delete the selected productss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProductss" />
                            </template>
                        </Dialog>
                        
    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">
           
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="products" 
        :tableId="products.id" 
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
        
            
           
            
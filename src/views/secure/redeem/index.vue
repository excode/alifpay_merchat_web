
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useRedeemStore } from '@/stores/modules/Redeem';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';
//import { useProductStore } from '@/stores/modules/Product';
//import { useRedeemoptionStore } from '@/stores/modules/Redeemoption';
import { validate, validateForm } from '@/lib/validation';
    const { redeems, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useRedeemStore())
    const {  
    getRedeem,
    updateRedeemValue ,
    addRedeem,
    updateRedeem,
    deleteRedeem
    } = useRedeemStore()


const toast = useToast();
const { contextPath } = useLayout();
const redeemDialog = ref(false);
const deleteRedeemDialog = ref(false);
const deleteRedeemsDialog = ref(false);
const redeem = ref({});
const selectedRedeems = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);


                

                
// THE VALIDATION RULES
const validation=[
    {id:'productid',type:validate.text,required:true},
{id:'redeemproductid',type:validate.text,required:true},
{id:'quantity',type:validate.number,max:0,min:0,required:true},
{id:'unitprice',type:validate.number,max:0,min:0,required:true},
{id:'total',type:validate.number,max:0,min:0,required:true},
{id:'sellerNumber',type:validate.phone,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getRedeem()
    

});


const openNew = () => {
    let emptyRedeem = {
        productid:null,
redeemproductid:null,
quantity:0,
unitprice:0,
total:0,
sellerNumber:''
    };
    redeem.value = emptyRedeem;
    submitted.value = false;
    redeemDialog.value = true;
};

const hideDialog = () => {
    redeemDialog.value = false;
    submitted.value = false;
};

const saveRedeem = async() => {
    submitted.value = true;
    const validationErrors=validateForm(redeem.value,validation)
    if (validationErrors.length==0) {
    
        if (redeem.value.id) {
            await updateRedeem(redeem.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Redeem Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addRedeem(redeem.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Redeem Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        redeemDialog.value = false;
        redeem.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editRedeem = (editRedeem) => {
    
    redeem.value = { ...editRedeem };
    redeemDialog.value = true;
};

const confirmDeleteRedeem = (editRedeem) => {
    redeem.value = { ...editRedeem };
    deleteRedeemDialog.value = true;
};

const delRedeem = async() => {
    await deleteRedeem(redeem.value.id);
    deleteRedeemDialog.value = false;
    if(error.value==undefined || error.value==null){
    redeem.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Redeem Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    redeem.value =  {...redeem.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < redeems.value.length; i++) {
        if (redeems.value[i].id === id) {
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
    deleteRedeemsDialog.value = true;
};
const deleteSelectedRedeems = () => {
    redeems.value = redeems.value.filter((val) => !selectedRedeems.value.includes(val));
    deleteRedeemsDialog.value = false;
    selectedRedeems.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Redeems Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        productid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
redeemproductid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
quantity: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
unitprice: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
sellerNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getRedeem(searchObj);
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
                            :value="redeems"
                            v-model:selection="selectedRedeems"
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
                                    <h5 class="m-0">Manage Redeems</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="productid"   header="Product" :showAddButton="false"  filterField="productid"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Product</span>
        {{slotProps.data.productid}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="products"   optionLabel="productname" optionValue="id" placeholder="Search by productid" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="redeemproductid"   header="Redeemproductid" :showAddButton="false"  filterField="redeemproductid"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Redeemproductid</span>
        {{slotProps.data.redeemproductid}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="redeemoptions"   optionLabel="name" optionValue="id" placeholder="Search by redeemproductid" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="quantity"  dataType="numeric" header="Quantity" :showAddButton="false"  filterField="quantity"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Quantity</span>
        {{slotProps.data.quantity}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Quantity" />
                
    </template>
</Column>
            
            

          
         
<Column field="unitprice"  dataType="numeric" header="Unitprice" :showAddButton="false"  filterField="unitprice"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Unitprice</span>
        {{slotProps.data.unitprice}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Unitprice" />
                
    </template>
</Column>
            
            

          
         
<Column field="total"  dataType="numeric" header="Total" :showAddButton="false"  filterField="total"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Total</span>
        {{slotProps.data.total}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Total" />
                
    </template>
</Column>
            
            

          
         
<Column field="sellerNumber"  header="Seller Number" :showAddButton="false"  filterField="sellerNumber"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Seller Number</span>
        {{slotProps.data.sellerNumber}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by SellerNumber" />
                
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editRedeem(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteRedeem(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/redeem/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="redeemDialog" :style="{ width: '450px' }" header="Redeem Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="productid">Product</label>
         <Dropdown   id="productid"  optionLabel="productname" optionValue="id"  v-model="redeem.productid" :options="products"   />
    </div>
            

    <div class="field">
        <label htmlFor="redeemproductid">Redeemproductid</label>
         <Dropdown   id="redeemproductid"  optionLabel="name" optionValue="id"  v-model="redeem.redeemproductid" :options="redeemoptions"   />
    </div>
            

    <div class="field">
        <label htmlFor="quantity">Quantity</label>
         <InputNumber id="quantity" v-model="redeem.quantity"   mode="currency" currency="USD"  />
    </div>
            

    <div class="field">
        <label htmlFor="unitprice">Unitprice</label>
         <InputNumber id="unitprice" v-model="redeem.unitprice"   mode="currency" currency="USD"  />
    </div>
            

    <div class="field">
        <label htmlFor="total">Total</label>
         <InputNumber id="total" v-model="redeem.total"   mode="currency" currency="USD"  />
    </div>
            

    <div class="field">
        <label htmlFor="sellerNumber">Seller Number</label>
         <InputText id="sellerNumber" type="text" v-model="redeem.sellerNumber"  autoFocus  required :class="{ 'p-invalid': submitted && !redeem.sellerNumber }" />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveRedeem" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteRedeemDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="redeem"
                                    >Are you sure you want to delete <b>{{ redeem.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRedeemDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delRedeem" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteRedeemsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="redeem">Are you sure you want to delete the selected redeems?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRedeemsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRedeems" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
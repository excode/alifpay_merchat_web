
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useRewardStore } from '@/stores/modules/Reward';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';
//import { useProductStore } from '@/stores/modules/Product';
//import { useRedeemoptionStore } from '@/stores/modules/Redeemoption';
import { validate, validateForm } from '@/lib/validation';
    const { rewards, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useRewardStore())
    const {  
    getReward,
    updateRewardValue ,
    addReward,
    updateReward,
    deleteReward
    } = useRewardStore()


const toast = useToast();
const { contextPath } = useLayout();
const rewardDialog = ref(false);
const deleteRewardDialog = ref(false);
const deleteRewardsDialog = ref(false);
const reward = ref({});
const selectedRewards = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

       

                
// THE VALIDATION RULES
const validation=[
    {id:'level',type:validate.int,max:0,min:0,required:true},
{id:'amount',type:validate.number,max:0,min:0,required:true},
{id:'status',type:validate.boolean,required:true},
{id:'productid',type:validate.text,required:true},
{id:'redeemProductId',type:validate.text,required:true},
{id:'contactNumber',type:validate.phone,max:0,min:0,required:true},
{id:'ref',type:validate.text,max:0,min:0,required:true},
{id:'sourceContactNumber',type:validate.phone,max:0,min:0,required:true},
{id:'particular',type:validate.text,max:0,min:0,required:true},
{id:'type',type:validate.text,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getReward()
             
});


const openNew = () => {
    let emptyReward = {
        level:0,
amount:0,
status:null,
productid:null,
redeemProductId:null,
contactNumber:'',
ref:'',
sourceContactNumber:'',
particular:'',
type:''
    };
    reward.value = emptyReward;
    submitted.value = false;
    rewardDialog.value = true;
};

const hideDialog = () => {
    rewardDialog.value = false;
    submitted.value = false;
};

const saveReward = async() => {
    submitted.value = true;
    const validationErrors=validateForm(reward.value,validation)
    if (validationErrors.length==0) {
    
        if (reward.value.id) {
            await updateReward(reward.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Reward Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addReward(reward.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Reward Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        rewardDialog.value = false;
        reward.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editReward = (editReward) => {
    
    reward.value = { ...editReward };
    rewardDialog.value = true;
};

const confirmDeleteReward = (editReward) => {
    reward.value = { ...editReward };
    deleteRewardDialog.value = true;
};

const delReward = async() => {
    await deleteReward(reward.value.id);
    deleteRewardDialog.value = false;
    if(error.value==undefined || error.value==null){
    reward.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Reward Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    reward.value =  {...reward.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < rewards.value.length; i++) {
        if (rewards.value[i].id === id) {
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
    deleteRewardsDialog.value = true;
};
const deleteSelectedRewards = () => {
    rewards.value = rewards.value.filter((val) => !selectedRewards.value.includes(val));
    deleteRewardsDialog.value = false;
    selectedRewards.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Rewards Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sourceContactNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
contactNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
particular: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
productid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
level: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
amount: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
ref: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
redeemProductId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
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
        
        await getReward(searchObj);
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
                                  
                                    
                                </div>
                            </template>
        
                            <template v-slot:end>
                               
                                <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                            </template>
                        </Toolbar>
        
                        <DataTable
                            ref="dt"
                            :value="rewards"
                            v-model:selection="selectedRewards"
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
                                    <h5 class="m-0">Rewards Lists</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="sourceContactNumber"  header="Source username" :showAddButton="false"  filterField="sourceContactNumber"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Source username</span>
        {{slotProps.data.sourceContactNumber}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by SourceContactNumber" />
                
    </template>
</Column>
            
            

          
         
<Column field="contactNumber"  header="username" :showAddButton="false"  filterField="contactNumber"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">username</span>
        {{slotProps.data.contactNumber}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by ContactNumber" />
                
    </template>
</Column>
            
            

          
         
<Column field="particular"  header="Particular" :showAddButton="false"  filterField="particular"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Particular</span>
        {{slotProps.data.particular}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Particular" />
                
    </template>
</Column>
            
            

          
         
<Column field="productid"   header="Product" :showAddButton="false"  filterField="productid"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Product</span>
        {{slotProps.data.productid.productname}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="products"   optionLabel="productname" optionValue="id" placeholder="Search by productid" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="level"  dataType="numeric" header="Level" :showAddButton="false"  filterField="level"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Level</span>
        {{slotProps.data.level}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Level" />
                
    </template>
</Column>
            
            

          
         
<Column field="amount"  dataType="numeric" header="Amount" :showAddButton="false"  filterField="amount"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Amount</span>
        {{slotProps.data.amount}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputNumber v-model="filterModel.value" class="p-column-filter" placeholder="Search by Amount" />
                
    </template>
</Column>
            
<Column field="status"  dataType="boolean" header="Claimed" :showAddButton="false"  filterField="createAt"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Status</span>
        {{slotProps.data.status}}
    </template>
    
</Column>         

          
         

            
            

          
         

            

          
         

            
            

          
         
<Column field="createAt"  dataType="date" header="Created At" :showAddButton="false"  filterField="createAt"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Time</span>
        {{slotProps.data.createAt}}
    </template>
    <template #filter="{ filterModel }">
    
<Calendar v-model="filterModel.value"  showTime hourFormat="12" />

            
    </template>
</Column>
            
            
                            
                          
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="rewardDialog" :style="{ width: '450px' }" header="Reward Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="level">Level</label>
         <InputNumber id="level" v-model="reward.level"   />
    </div>
            

    <div class="field">
        <label htmlFor="amount">Amount</label>
         <InputNumber id="amount" v-model="reward.amount"   mode="currency" currency="USD"  />
    </div>
            

    <div class="field">
        <label htmlFor="status">Status</label>
         <TriStateCheckbox name="status" id="status" v-model="reward.status"   />
    </div>
            

    <div class="field">
        <label htmlFor="productid">Product</label>
         <Dropdown   id="productid"  optionLabel="productname" optionValue="id"  v-model="reward.productid" :options="products"   />
    </div>
            

    <div class="field">
        <label htmlFor="redeemProductId">Redeem Product</label>
         <Dropdown   id="redeemProductId"  optionLabel="name" optionValue="id"  v-model="reward.redeemProductId" :options="redeemoptions"   />
    </div>
            

    <div class="field">
        <label htmlFor="contactNumber">username</label>
         <InputText id="contactNumber" type="text" v-model="reward.contactNumber"  autoFocus  required :class="{ 'p-invalid': submitted && !reward.contactNumber }" />
    </div>
            

    <div class="field">
        <label htmlFor="ref">Ref</label>
         <InputText id="ref" type="text" v-model="reward.ref"  autoFocus  required :class="{ 'p-invalid': submitted && !reward.ref }" />
    </div>
            

    <div class="field">
        <label htmlFor="sourceContactNumber">Source username</label>
         <InputText id="sourceContactNumber" type="text" v-model="reward.sourceContactNumber"  autoFocus  required :class="{ 'p-invalid': submitted && !reward.sourceContactNumber }" />
    </div>
            

    <div class="field">
        <label htmlFor="particular">Particular</label>
         <InputText id="particular" type="text" v-model="reward.particular"  autoFocus  required :class="{ 'p-invalid': submitted && !reward.particular }" />
    </div>
            

    <div class="field">
        <label htmlFor="type">Type</label>
         <InputText id="type" type="text" v-model="reward.type"  autoFocus  required :class="{ 'p-invalid': submitted && !reward.type }" />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveReward" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteRewardDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="reward"
                                    >Are you sure you want to delete <b>{{ reward.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRewardDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delReward" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteRewardsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="reward">Are you sure you want to delete the selected rewards?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteRewardsDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedRewards" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
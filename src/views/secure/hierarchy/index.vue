
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useHierarchyStore } from '@/stores/modules/Hierarchy';
import { storeToRefs } from 'pinia';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref,computed } from 'vue';
import { useLoginStore } from '@/stores/modules/Login';

import { validate, validateForm } from '@/lib/validation';
    const { hierarchys, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useHierarchyStore())
    const {  
    getHierarchy,
    updateHierarchyValue ,
    addHierarchy,
    updateHierarchy,
    deleteHierarchy
    } = useHierarchyStore()
const { userInfo} = storeToRefs(useLoginStore())
 const {  
    getUserInfo
   
    } = useLoginStore()
const toast = useToast();
const { contextPath } = useLayout();
const hierarchyDialog = ref(false);
const deleteHierarchyDialog = ref(false);
const deleteHierarchysDialog = ref(false);
const hierarchy = ref({});
const selectedHierarchys = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

                
// THE VALIDATION RULES
const validation=[
{id:'introducer',type:validate.phone,max:0,min:0,required:true},
{id:'upline',type:validate.text,max:0,min:0,required:true},
{id:'position',type:validate.text,max:0,min:0,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getHierarchy();
             
     getUserInfo();
          

});
const referralUrl = computed(() => `https://web.alifpay.com.my/#/reg/${userInfo.value.username}`)

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(referralUrl.value)
    alert('Copied to clipboard!')
  } catch (err) {
    alert('Failed to copy!')
    console.error(err)
  }
}

const openNew = () => {
    let emptyHierarchy = {
        distributor:null,
contactNumber:'',
productid:null,
introducer:'',
upline:'',
leftChild:'',
rightChild:'',
infoData:'',
category:''
    };
    hierarchy.value = emptyHierarchy;
    submitted.value = false;
    hierarchyDialog.value = true;
};

const hideDialog = () => {
    hierarchyDialog.value = false;
    submitted.value = false;
};

const saveHierarchy = async() => {
    submitted.value = true;
    const validationErrors=validateForm(hierarchy.value,validation)
    if (validationErrors.length==0) {
    
            let placementData={
                contactNumber:hierarchy.value.contactNumber,
                upline:hierarchy.value.upline,
                position:hierarchy.value.position,
                productid:hierarchy.value.productid._id
            }
            await updateHierarchy(placementData)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Hierarchy Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        
        hierarchyDialog.value = false;
        hierarchy.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editHierarchy = (editHierarchy) => {
    
    hierarchy.value = { ...editHierarchy };
    hierarchyDialog.value = true;
};

const confirmDeleteHierarchy = (editHierarchy) => {
    hierarchy.value = { ...editHierarchy };
    deleteHierarchyDialog.value = true;
};

const delHierarchy = async() => {
    await deleteHierarchy(hierarchy.value.id);
    deleteHierarchyDialog.value = false;
    if(error.value==undefined || error.value==null){
    hierarchy.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Hierarchy Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    hierarchy.value =  {...hierarchy.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < hierarchys.value.length; i++) {
        if (hierarchys.value[i].id === id) {
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
    deleteHierarchysDialog.value = true;
};
const deleteSelectedHierarchys = () => {
    hierarchys.value = hierarchys.value.filter((val) => !selectedHierarchys.value.includes(val));
    deleteHierarchysDialog.value = false;
    selectedHierarchys.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Hierarchys Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
contactNumber: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
//productid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
introducer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
upline: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
leftChild: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
rightChild: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
walletbalance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
rewardbalance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
distributor: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
infoData: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getHierarchy(searchObj);
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
                                   
                                  <h3> {{referralUrl}}</h3> <Button 
      label="Copy Link" 
      icon="pi pi-copy" 
      class="p-button-sm p-button-success" 
      @click="copyText" 
    />
                                </div>
                            </template>
        
                          
                        </Toolbar>
        
                        <DataTable
                            ref="dt"
                            :value="hierarchys"
                            v-model:selection="selectedHierarchys"
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
                                    <h5 class="m-0">My Sponsor list</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="category"  header="Category" :showAddButton="false"  filterField="category"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Category</span>
        {{slotProps.data.category}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Category" />
                
    </template>
</Column>
            
            

          
         
<Column field="contactNumber"  header="Username" :showAddButton="false"  filterField="contactNumber"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Username</span>
        {{slotProps.data.contactNumber}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by ContactNumber" />
                
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
            
            

          
         
<Column field="upline"  header="Upline" :showAddButton="false"  filterField="upline"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Upline</span>
        {{slotProps.data.upline}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Upline" />
                
    </template>
</Column>
            
            

          
         
<Column field="leftChild"  header="Left Child" :showAddButton="false"  filterField="leftChild"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Left Child</span>
        {{slotProps.data.leftChild}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by LeftChild" />
                
    </template>
</Column>
            
            

          
         
<Column field="rightChild"  header="Right Child" :showAddButton="false"  filterField="rightChild"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Right Child</span>
        {{slotProps.data.rightChild}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by RightChild" />
                
    </template>
</Column>
            
            

          
         

            
            

          
         

            
            

          
         

            
            

          
         
<Column field="infoData"  header="Info Data"    headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Info Data</span>
        {{slotProps.data.infoData?.leftTotal??'0'}}-{{slotProps.data.infoData?.rightTotal??'0'}}
    </template>
    
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button v-if="slotProps.data.infoData?.placementRequired && !slotProps.data.infoData?.placementDone" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editHierarchy(slotProps.data)" />
                                    <Button v-if="slotProps.data.infoData?.placementRequired && slotProps.data.infoData?.placementDone" icon="pi pi-pencil" class="p-button-rounded p-button-warning mr-2" @click="editHierarchy(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="confirmDeleteHierarchy(slotProps.data)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="hierarchyDialog" :style="{ width: '450px' }" header="Placement Details" :modal="true" class="p-fluid">
                            
                            
    
            

    <div class="field">
        <label htmlFor="contactNumber">Username</label>
         <InputText :readonly="true"  id="contactNumber" type="text" v-model="hierarchy.contactNumber"   autoFocus  required :class="{ 'p-invalid': submitted && !hierarchy.contactNumber }" />
    </div>
            

    

    
            

    <div class="field">
        <label htmlFor="upline">Upline</label>
         <InputText id="upline" type="text" v-model="hierarchy.upline"  autoFocus  required :class="{ 'p-invalid': submitted && !hierarchy.upline }" />
    </div>
            

    <div class="field">
        <label htmlFor="leftChild">Position</label>
    <p>
        <div class="flex items-center">
            <RadioButton v-model="hierarchy.position" inputId="ingredient2" name="position" value="L" />
            <label for="ingredient2" class="ml-2">Left</label>
        </div>
        <div class="flex items-center">
            <RadioButton v-model="hierarchy.position" inputId="ingredient3" name="position" value="R" />
            <label for="ingredient3" class="ml-2">Right</label>
        </div>
    </p>
    </div>
            

    
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveHierarchy" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteHierarchyDialog" :style="{ width: '450px' }" :header="hierarchy.contactNumber" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                               
                                <div class="container">
                                    <h3>{{hierarchy.contactNumber}}</h3>
                                    <div class="panel downlines">
                                      <h5>Downlines:</h5>
                                      <p>Left = {{ hierarchy.infoData?.leftTotal??'0' }} | Right = {{ hierarchy.infoData?.rightTotal??'0'  }}</p>
                                    </div>
                                    <div class="panel current-points">
                                      <h5>Current Points:</h5>
                                      <p>Left = {{ hierarchy.infoData?.leftCurrent??'0' }} | Right = {{hierarchy.infoData?.rightCurrent??'0' }}</p>
                                    </div>
                                   
                                  </div>
                            </div>
                            <template #footer>
                                <Button label="Close" icon="pi pi-times" class="p-button-text" @click="deleteHierarchyDialog = false" />
                                
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteHierarchysDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="hierarchy">Are you sure you want to delete the selected hierarchys?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteHierarchysDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedHierarchys" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          
          .panel {
            background-color: #007bff;
            color: white;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          
          .panel h2 {
            margin: 0;
          }
          
          .current-points {
            background-color: #6f42c1; /* Purple */
          }
          
          .total-points {
            background-color: #20c997; /* Green */
          }
          
          .genealogy {
            background-color: #28a745; /* Dark Green */
            color: white;
            padding: 15px;
            border-radius: 5px;
          }
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
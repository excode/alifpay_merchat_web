
<script setup>
import { FilterMatchMode ,FilterOperator} from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia'
import config from '@/config/index'
import { useUsersStore } from '@/stores/modules/Users'
import moment from 'moment'
import { convertArray, fixDate } from '@/lib/functions';

import {validateForm,validate} from '@/lib/validation'
    const { userss, error,curdLoading, loading,totalpages,page,totalRecords} = storeToRefs(useUsersStore())
    const {  
    getUsers,
    updateUsersValue ,
    addUsers,
    updateUsers,
    deleteUsers
    } = useUsersStore()


const toast = useToast();
const { contextPath } = useLayout();
const usersDialog = ref(false);
const deleteUsersDialog = ref(false);
const deleteUserssDialog = ref(false);
const users = ref({});
const selectedUserss = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const sortOrders = ref({});
const row = ref(10);

// THE VALIDATION RULES
const validation=[
    {id:'firstname',type:validate.text,max:0,min:0,required:false},
{id:'lastname',type:validate.text,max:50,min:1,required:true},
{id:'email',type:validate.email,max:0,min:0,required:true},
{id:'password',type:validate.password,max:20,min:6,required:true},
{id:'mobile',type:validate.text,max:20,min:8,required:true},
{id:'usertype',type:validate.int,required:true}
]
onBeforeMount(() => {
    initFilters();
});
onMounted(async() => {
    await getUsers()
    

});


const openNew = () => {
    let emptyUsers = {
        firstname:'',
lastname:'',
email:'',
password:'',
mobile:'',
usertype:null
    };
    users.value = emptyUsers;
    submitted.value = false;
    usersDialog.value = true;
};

const hideDialog = () => {
    usersDialog.value = false;
    submitted.value = false;
};

const saveUsers = async() => {
    submitted.value = true;
    const validationErrors=validateForm(users.value,validation)
    if (validationErrors.length==0) {
    
        if (users.value.id) {
            await updateUsers(users.value);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Updated', life: 3000 });
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
            
        } else {
            await addUsers(users.value)
            if(error.value==undefined || error.value==null){
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Created', life: 3000 });
            }else{
            toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
            }
        }
        usersDialog.value = false;
        users.value = {};
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: validationErrors, life: 5000 })
    }
};

const editUsers = (editUsers) => {
    editUsers.createat =fixDate(editUsers.createat)
editUsers.updateat =fixDate(editUsers.updateat)
    users.value = { ...editUsers };
    usersDialog.value = true;
};

const confirmDeleteUsers = (editUsers) => {
    users.value = { ...editUsers };
    deleteUsersDialog.value = true;
};

const delUsers = async() => {
    await deleteUsers(users.value.id);
    deleteUsersDialog.value = false;
    if(error.value==undefined || error.value==null){
    users.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    }else{
        toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
    }
};
const autoCompleteSelect =(e,fieldName,valueId)=>{
    let val=e.value[valueId];
    users.value =  {...users.value,[fieldName]:val};
} 
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < userss.value.length; i++) {
        if (userss.value[i].id === id) {
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
    deleteUserssDialog.value = true;
};
const deleteSelectedUserss = () => {
    userss.value = userss.value.filter((val) => !selectedUserss.value.includes(val));
    deleteUserssDialog.value = false;
    selectedUserss.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Userss Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
mobile: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
usertype: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
lastname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
createby: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
        
        await getUsers(searchObj);
}     
       

    const usertypes =[
	{value:"Admin",name:"Admin"},
	{value:"Manager",name:"Manager"},
	{value:"User",name:"User"}
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
                            :value="userss"
                            v-model:selection="selectedUserss"
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
                                    <h5 class="m-0">Manage Userss</h5>
                                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global'].value" placeholder="Search..." />
                                    </span>
                                </div>
                            </template>
        
                            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                            
          
         
<Column field="firstname"  header="First Name" :showAddButton="false"  filterField="firstname"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">First Name</span>
        {{slotProps.data.firstname}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Firstname" />
                
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
            
            

          
         
<Column field="mobile"  header="Mobile" :showAddButton="false"  filterField="mobile"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Mobile</span>
        {{slotProps.data.mobile}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Mobile" />
                
    </template>
</Column>
            
            

          
         
<Column field="usertype"   header="User Types" :showAddButton="false"  filterField="usertype"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">User Types</span>
        {{slotProps.data.usertype}}
    </template>
    <template #filter="{ filterModel }">
    
<Dropdown v-model="filterModel.value" :options="usertypes"   optionLabel="name" optionValue="value" placeholder="Search by usertype" className="p-column-filter" />           

    </template>
</Column>
            
            

          
         
<Column field="lastname"  header="Last Name" :showAddButton="false"  filterField="lastname"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">Last Name</span>
        {{slotProps.data.lastname}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Lastname" />
                
    </template>
</Column>
            
            

          
         
<Column field="createby"  header="create By" :showAddButton="false"  filterField="createby"  :sortable="true" headerStyle="width:14%; min-width:10rem;">
    <template #body="slotProps">
        <span class="p-column-title">create By</span>
        {{slotProps.data.createby}}
    </template>
    <template #filter="{ filterModel }">
    
         <InputText v-model="filterModel.value" class="p-column-filter" placeholder="Search by Createby" />
                
    </template>
</Column>
            
            
                            
                            <Column headerStyle="min-width:10rem;">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUsers(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUsers(slotProps.data)" />
                                    <Button icon="pi pi-list" class="p-button-rounded p-button-info mt-2" @click="$router.push('/secure/users/'+slotProps.data.id)"></Button>
                                </template>
                            </Column>
                        </DataTable>
                        <simple-pagination :currentpage="page" :pages="totalpages" @changePage="pageChange"></simple-pagination>
                        <Dialog v-model:visible="usersDialog" :style="{ width: '450px' }" header="Users Details" :modal="true" class="p-fluid">
                            
                            
    <div class="field">
        <label htmlFor="firstname">First Name</label>
         <InputText id="firstname" type="text" v-model="users.firstname"  autoFocus  />
    </div>
            

    <div class="field">
        <label htmlFor="lastname">Last Name</label>
         <InputText id="lastname" type="text" v-model="users.lastname"  autoFocus  required :class="{ 'p-invalid': submitted && !users.lastname }" />
    </div>
            

    <div class="field">
        <label htmlFor="email">Email</label>
         <InputText id="email" type="text" v-model="users.email"  autoFocus  required :class="{ 'p-invalid': submitted && !users.email }" />
    </div>
            

    <div class="field">
        <label htmlFor="password">Password</label>
         <Password id="password" v-model="users.password"  toggleMask  required :class="{ 'p-invalid': submitted && !users.password }" />
    </div>
            

    <div class="field">
        <label htmlFor="mobile">Mobile</label>
         <InputText id="mobile" type="text" v-model="users.mobile"  autoFocus  required :class="{ 'p-invalid': submitted && !users.mobile }" />
    </div>
            

    <div class="field">
        <label htmlFor="usertype">User Types</label>
         <Dropdown   id="usertype" optionLabel="name" optionValue="value"  v-model="users.usertype" :options="usertypes"   />
    </div>
            
                            <template #footer>
                                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                                <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUsers" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="users"
                                    >Are you sure you want to delete <b>{{ users.name }}</b
                                    >?</span
                                >
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="delUsers" />
                            </template>
                        </Dialog>
        
                        <Dialog v-model:visible="deleteUserssDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                            <div class="flex align-items-center justify-content-center">
                                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                                <span v-if="users">Are you sure you want to delete the selected userss?</span>
                            </div>
                            <template #footer>
                                <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserssDialog = false" />
                                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUserss" />
                            </template>
                        </Dialog>
                        

                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
        @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            
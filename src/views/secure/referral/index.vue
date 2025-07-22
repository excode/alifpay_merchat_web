
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useNetworkStore } from '@/stores/modules/Network';
import { useLoginStore } from '@/stores/modules/Login';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
const { userInfo} = storeToRefs(useLoginStore())
import { onBeforeMount, onMounted, ref } from 'vue';
const { levelNodes,levelNodes_n,loading} = storeToRefs(useNetworkStore())




const {  
    getUserInfo
  } = useLoginStore()


    const {  
    getLevelNodes2
    
    } = useNetworkStore()

    const nodes2 = ref([]);
    const nodes3 = ref([]);
const toast = useToast();
const { contextPath } = useLayout();


onBeforeMount(() => {
 
});
onMounted(async() => {
    getUserInfo()
    await getLevelNodes2(userInfo.value.username)
   // await getLevelNodes2('ahmad')
});

const loadNodeChildren = async (node) => {
    console.log(node.key);

    if (node.leaf || node.children) return;
        await getLevelNodes2(node.label, false); // Assuming this fills levelNodes_n.value

       node.children = levelNodes_n.value.map(child => ({
        key: child.key,
        label: child.label,
        data: child.data,
        leaf: child.data.refCount === 0
    }));

    // Optional: Force Vue reactivity if needed (depends on how PrimeVue Tree is bound)
    levelNodes.value = [...levelNodes.value];
    //console.log(levelNodes.value )
    
};

const getIconClass = (userType) => {
    switch (userType) {
        case 'FP':
            return 'pi pi-star';
        case 'FC':
            return 'pi pi-users';
        case 'BU':
            return 'pi pi-briefcase';
        default:
            return 'pi pi-question';
    }
};

const getColor = (userType) => {
    switch (userType) {
        case 'FP':
            return '#176204ff'; // Amber/Prominent
        case 'FC':
            return '#e0900fff'; // Emerald/Green
        case 'BU':
            return '#3b82f6'; // Blue
        default:
            return '#6b7280'; // Gray
    }
};
const getBadgeClass = (userType) => {
  switch (userType) {
    case 'FP':
      return 'bg-red-500 text-white'; // star = prominent
    case 'FC':
      return 'bg-blue-500 text-white';
    case 'BU':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};
                
        </script>
    
        <template>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Toast />
                      <h3 class="text-xl font-semibold text-primary border-b-2 border-primary pb-1 mb-3">
  <i class="pi pi-sitemap mr-2 text-primary"></i>
  Hierarchy of {{ userInfo.username }}
</h3>
                        <div v-if="loading">
                            <i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
                        </div>
                        <div v-if="levelNodes.length" class="card flex justify-content-center">
                           
                        
                      <Tree
  :value="levelNodes"
  lazy
  @node-expand="loadNodeChildren"
  :loading="loading"
  class="w-full md:w-[30rem]"
>
  <template #default="slotProps">
     <div class="flex items-center gap-2">
     <span v-if="slotProps.node.data.userType === 'FP'" class="text-red-500">★</span> <!-- Star filled -->
<span v-else-if="slotProps.node.data.userType === 'FC'" class="text-blue-500">👥</span> <!-- Users emoji -->
<span v-else-if="slotProps.node.data.userType === 'BU'" class="text-green-600">💼</span> <!-- Briefcase -->
      <span class="text-lg font-semibold">{{ slotProps.node.label }}</span>
      <span
        class="p-badge p-component p-badge-sm"
        :class="getBadgeClass(slotProps.node.data.userType)"
      >
        {{ slotProps.node.data.userType }}
      </span>
    </div>
  </template>
</Tree>
                        </div>
                       
                        
                       
                    </div>
                </div>
            </div>
        </template>
        
        <style scoped lang="scss">
      //  @import '@/assets/demo/styles/badges.scss';
        </style>
        
            
           
            

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useNetworkStore } from '@/stores/modules/Network';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

    const { levelNodes,loading} = storeToRefs(useNetworkStore())
    const {  
    getLevelNodes
    
    } = useNetworkStore()

    const nodes2 = ref([]);
    const nodes3 = ref([]);
const toast = useToast();
const { contextPath } = useLayout();


onBeforeMount(() => {
 
});
onMounted(async() => {
    await getLevelNodes()
});



                
        </script>
    
        <template>
            <div class="grid">
                <div class="col-12">
                    <div class="card">
                        <Toast />
                        
                        <div v-if="loading">
                            <i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
                        </div>
                        <div v-if="levelNodes.length" class="card flex justify-content-center">
                           
                            <Tree :value="levelNodes" class="w-full md:w-30rem">
                                <template #default="slotProps">
                                    {{ slotProps.node.data }}:  <b>{{ slotProps.node.label }} </b> 
                                </template>
                                <template #url="slotProps">
                                   {{ slotProps.node.label }}
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
        
            
           
            
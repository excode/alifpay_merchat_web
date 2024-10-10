
<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useNetworkStore } from '@/stores/modules/Network';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';

//import OrgChart from "./OrgChart.vue";
import OrganizationChart from 'primevue/organizationchart';
    const { binarary,loading} = storeToRefs(useNetworkStore())
    const {  
      getBinarayNodes
    
    } = useNetworkStore()
    onMounted(async() => {
    await getBinarayNodes()
});

const toast = useToast();
const { contextPath } = useLayout();


                
        </script>
        
        <template>
            <div class="grid">
                <div class="col-12">
                   
                      
                        <div v-if="loading">
                          <i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
                      </div>
                      <div class="canvas-container">
                        <OrganizationChart :value="binarary">
                          <template #default="slotProps">
                            <div v-if="slotProps.node.name">
                             
                              <div class="container">
                                <h3>{{slotProps.node.name}}</h3>
                                <div class="panel downlines">
                                  <h5>Downlines:</h5>
                                  <p>Left = {{ slotProps.node.leftTotal }} | Right = {{ slotProps.node.rightTotal  }}</p>
                                </div>
                                <div class="panel current-points">
                                  <h5>Current Points:</h5>
                                  <p>Left = {{ slotProps.node.leftCurrent }} | Right = {{ slotProps.node.rightCurrent }}</p>
                                </div>
                                <Button  icon="pi pi-arrow-down" @click="getBinarayNodes(slotProps.node.name)" severity="success" aria-label="Next" size="small" />
                              </div>
                            </div>
                            </template>
                      </OrganizationChart>
                      
                       </div> 
                        
                     
                   
                </div>
            </div>
           
        </template>
        
        <style scoped lang="scss">
        .canvas-container {
          width: 100%;
          height: 100%;
          border-radius: 5px;
          border: 1px solid gray;
          margin-bottom: 10px;
        }

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
        
            
           
          
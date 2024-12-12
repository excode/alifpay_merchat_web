
<script setup>
import config from '@/config/index';
import { useLoginStore } from '@/stores/modules/Login';
import { useStoresStore } from '@/stores/modules/Stores';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const { stores, error,loading} = storeToRefs(useStoresStore())
const {  
getStoresDetails,
updateStores
} = useStoresStore()
const mapRef = ref(null);
const markers=ref([]);
const infoWindo = ref({
        visible: false,
        text: "",
        position: null,
      })
//const map_api_token1=import.meta.env.VITE_MAP_API;
    const { userInfo} = storeToRefs(useLoginStore())
    const {  
        getUserInfo,
      } = useLoginStore()
    const uploadDialog = ref(false);
    const enableSave = ref(false);
    const currentImage = ref('');
    const submitted = ref(false);
    const center = ref({lat:101,lng:3});
    const uploadInfo = ref(null);
    const toast = useToast();
    
  const setPlace=(e)=>{
   //console.log(e)
    let lat = e.geometry.location.lat();
    let lng = e.geometry.location.lng();
    center.value={lat: lat, lng: lng}
    enableSave.value=true;
  }  
  const newClick=(e)=>{
    
    
    
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    center.value={lat: lat, lng: lng}
    console.log(`Clicked coordinates: Lat: ${lat}, Lng: ${lng}`);
    //markers.value= [{ position:{lat: lat, lng: lng}  }]
    enableSave.value=true;
    //console.log(markers.value[0])


    const customText = `You clicked at Latitude: ${lat}, Longitude: ${lng}`;

      // Add a marker at the clicked location
      markers.value.push({
        position: { lat, lng },
        text: customText, // Save custom text for the marker
      });
      // Show the info window
      infoWindo.value = {
        visible: true,
        text: customText,
        position: { lat, lng },
      };
    
  }
  const showInfoWindow=(index)=> {
    const marker = markers.value[index];
    infoWindo.value = {
        visible: true,
        text: "aaa",
        position: marker.position,
      };
    }
  
const options = ref({});
onMounted(async() => {
const route = useRoute();  
const id = route.params.id; // read parameter id (it is reactive) 
await getStoresDetails(id)

    //GET THE USER TOEKN           
    getUserInfo()
    //setTimeout(triggerMapResize, 100);
    if(stores.value?.location?.coordinates[0]>0){
        center.value={lat: stores.value?.location?.coordinates[1], lng: stores.value?.location?.coordinates[0]}
        options.value={}
        //markers.value= [{ position:center.value }]
    }
    
});
const saveStores = async() => {
           submitted.value = true;
  

            let location = {type:'Point',coordinates:[center.value.lng,center.value.lat]}
            let updateInfo={id:stores.value.id,location:location}
            await updateStores(updateInfo);
            if(error.value==undefined || error.value==null){
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Stores Updated', life: 3000 });
               
            }else{
                toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 3000 });
                
            }
            submitted.value = false;
            
       
        
    
};
    
    const updateFileName = (newUploadedFileName,colName) => {
        let _stores = {...stores.value,[colName]:newUploadedFileName}
        stores.value=_stores     
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
    
    const triggerMapResize = () => {
  if (mapRef.value?.map) {
    //console.log("*****I AM FIRED *****")
  //  google.maps.event.trigger(mapRef.value.map, 'resize');
  }
};


// Watch center and trigger resize when it changes
//watch(center, triggerMapResize);
                  
</script>
<template>
<div>
   
<BlockViewer header="Stores details"  containerClass="surface-section px-4 py-8 md:px-6 lg:px-8">
<div v-if="loading">
<i class="pi pi-spin pi-cog" style="font-size: 4rem"></i>
</div>
  <div v-else class="surface-section">
   <div class="font-medium text-3xl text-900 mb-3"></div>
        
    <div className="card flex justify-content-center">
        
        <div>
        <Image v-if="stores.logo!='' && stores.logo!=undefined" preview  alt="Image" width="250"  :src="config.serverURIMer+'/' + stores.logo">
            <template #indicatoricon>
                
                <Button  icon="pi pi-eye" class="p-button-rounded p-button-warning mr-2"  />
            
                <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,stores,'logo')" />
            </template>
        </Image>
        
        <Image v-else   alt="Image" width="250" preview  src="/photo_na.png">
               <template #indicatoricon>
                   <Button  icon="pi pi-upload" class="p-button-rounded p-button-success mr-2" @click="$event=>showUploadDialog($event,stores,'logo')" />
               </template>
        </Image>

        
        </div>
            
    </div>
    
        <ul class="list-none p-0 m-0">
            
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Business Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.businessName}}</div>
        
    </li>       
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Business Category</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.businessCategory}}</div>
        
    </li>  
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Sharing Value</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.sharingValue}} %</div>
        
    </li>  
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Wallet username</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1"><b>{{stores.wallet_username}} </b></div>
        
    </li>  
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap" v-if="stores.businessCategory=='Community' || stores.businessCategory=='Marketplace'">
        <div className="text-500 w-6 md:w-2 font-medium">Price</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.price}} RM</div>
        
    </li>  
    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Halal Classification</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.halalClassification}}</div>
        
    </li>       
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Description</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.description}}</div>
        
    </li>       
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Business Hour</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.businessHour}}</div>
        
    </li>       
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Business days</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">


            <Chip
      v-for="(day, index) in stores.businessDays"
      :key="index"
      :label="day"
      icon="pi pi-calendar"
    />
        </div>
        
    </li>       
  
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Contact</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.contact}}</div>
        
    </li>       
          
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Address</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.address}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Street Name</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.streetName}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">City</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.city}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">State</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.state}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Postcode</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.postcode}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Country</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.country}}</div>
        
    </li>       
  
                
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
        <div className="text-500 w-6 md:w-2 font-medium">Location</div>
        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{{stores.location}}</div>
        
    </li>    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
    
        <InlineMessage severity="info">
<p>
            Instructions for Location Selection:</p>

            <p>Search for your location on Google Maps.</p>
            <p>If the exact address or business name is not available, search for a nearby reference address.</p>
            <p>Click on the map to obtain the exact latitude and longitude of your desired location.</p>
            <p>After selecting the location, save the information.</p>
        </InlineMessage>
    
        
    </li>    
    <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">

    <GMapAutocomplete

    class="p-inputtext p-component gmap-autocomplete-input"
    placeholder="Search Address"
    @place_changed="setPlace"
 >
   
</GMapAutocomplete>   
<Button :loading="submitted" type="button" label="Update Coordinate(Latitude & Longitude)" icon="pi pi-check" class="p-button-text" @click="saveStores" />
</li> 
  <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
    <GMapMap :center="center"
    :options="options"
     :zoom="15"
     ref="mapRef"
     @click="newClick"
     map-type-id="terrain"
     style="width: 100vw; height: 40rem">
     <GMapMarker
      key="index1"
      
      :position="center"
      :icon='{
        url: "https://alifpay.com.my/map-marker.png",
        scaledSize: {width: 64, height: 64}
      }'
      :clickable="true"
      :draggable="true"
    />

    
    </GMapMap>
<!--
   <GoogleMap
    ref="mapRef"
    :api-key="map_api_token1"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="15"
    @click="newClick"
  >
    <Marker :options="{ position: center }" />
  </GoogleMap>
  -->
  </li>
                
        </ul>
    </div>
</BlockViewer>

    <Dialog :style="{ width: '650px',height:'450' }" v-model:visible="uploadDialog"  :header="'Upload '+uploadInfo?.dbColName" :modal="true">   
        <CustomFileUpload 
        :onUpload="$e=>updateFileName($e,uploadInfo?.dbColName)" 
        :url="uploadInfo?.url" 
        table="stores" 
        :tableId="stores.id" 
        :maxFileSize="10000000" 
        :token="userInfo.token"
        :accept="uploadInfo?.accept" 
        fieldName="uploadFile" 
        :dbColName="uploadInfo?.dbColName" />      
    </Dialog>    
                
                
</div>
</template>
<style>
/* Custom style for the GMapAutocomplete input */
.gmap-autocomplete-input {
  font-size: 1.2rem; /* Make the font size larger */
  padding: 10px; /* Increase padding */
  height: 50px; /* Set a larger height */
  width: 600px;
}
.info-window {
    position: absolute;
    background: white;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    z-index: 10;
    pointer-events: none;
  }
</style>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>


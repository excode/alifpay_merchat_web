<script>
import { useToast } from "primevue/usetoast";
export default {
  data() {
    return{
        totalSize:0,
        totalSizePercent:0,
        files:[],
        toast:useToast(),
        uploadUrl:`${this.url}/${this.table}/upload/${this.dbColName}/${this.tableId}`
    }
  },
  props: {
    url:String,
    accept:String,
    table:String,
    tableId:String,
    fieldName:String,
    maxFileSize:Number,
    onUpload:Function,
    dbColName:String,
    token:String
  },
  methods:{
    onRemoveTemplatingFile (file, removeFileCallback, index)  {
    removeFileCallback(index);
    this.totalSize -= parseInt(formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
    },
test(val){
return val
},
 onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
},

 onSelectedFiles (event){
    this.files.value = event.files;
    this.files.value.forEach((file) => {
        this.totalSize += parseInt(this.formatSize(file.size));
    });
},

 uploadEvent (callback){
    this.totalSizePercent = this.totalSize / 10;
    callback();
},

 onTemplatedUpload (e) {
    let _totalSize = 0;

    e.files.forEach((file) => {
        _totalSize += file.size || 0;
    });
    this.totalSize = _totalSize
   
    if(this.onUpload){
        console.log(e.xhr.responseText)
        this.onUpload(e.xhr.responseText??"");
    }
    this.toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });
},

 formatSize (bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
},
onBeforeUpload(event){
       
    
        event.xhr.setRequestHeader('Authorization','Bearer '+this.token);
   

    }
  }
}
</script>
<template>
    <div class="card">
       <Toast/>
        <FileUpload @before-send="$event=>onBeforeUpload($event)" :name="fieldName" :url="uploadUrl" @upload="$event=>onTemplatedUpload($event)" :multiple="false" :accept="accept" :maxFileSize="maxFileSize" @select="$event=>onSelectedFiles($event)">
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <h4>File size mustn't exceed 800 kb</h4>
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <div class="flex gap-2">
                        <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined></Button>
                        <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button>
                        <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                        ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
                    >
                </div>
            </template>
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div v-if="files.length > 0">
                    <h5>Pending</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pending" severity="warning" />
                            <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded  severity="danger" />
                        </div>
                    </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                    <h5>Completed</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Completed" class="mt-3" severity="success" />
                            <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" />
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex align-items-center justify-content-center flex-column">
                    <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" />
                    <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
                </div>
            </template>
        </FileUpload>
    </div>
</template>


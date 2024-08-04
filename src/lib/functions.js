export const setTitleAndDescription = (title, description) => {
    window.document.title = title
    window.document.head.querySelector('meta[name=description]').content = description
}
export const  trimBig = (value,max)=>{
  var returnVal = value;
  var maximum = max==undefined ?15:max;
  if(value.length>maximum){
    returnVal= value.substring(0,maximum);
  }
  return returnVal;
}
export const listError = (value) => {
  var error=[];
  if(value){
    
  if(value['err']){
    error= value['err'];
  }else if(value['error']){
    error= value['error'];
  }else if(value['errors']){
    error= value.errors;
  }else{
    error= value;
  }
  
 // console.log("&&&&&")
  
}else{
  error= 'something went wrong';
}

return  error;
}

export const fixDate=(val)=>{
  if(typeof val =="string" && val!=""){
      return new Date(val)
  }else{
      return val;
  }
}
export const convertArray=(val)=>{
  if(val){
      if(Array.isArray(val)){
          return val
      }else{
          return JSON.parse(val)
      }
  }else{
   return []
  }
}
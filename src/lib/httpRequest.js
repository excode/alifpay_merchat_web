import axios from 'axios'
import config from '@/config'
import VueJwtDecode from 'vue-jwt-decode'

function setLogin(){
  var  u=`{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDU5YmQxNTBlMmY4ODI1NjBhZTJkZjYiLCJlbWFpbCI6InRlc3RAdWNvZGUuYWkiLCJwZXJtaXNzaW9uTGV2ZWwiOjQsIm5hbWUiOiJ1Q29kZSBUZXN0Iiwid2ViQWNjZXNzIjowLCJyZWZyZXNoS2V5IjoiMnFtbXJJL3F5ZUE1QXNrYUMvaGRrQT09IiwiaWF0IjoxNjg0NzQxNDk3fQ.qNTN1C_Q5qTMXQn0WDXJ70S3sl0f7jKh4cqlQfX8XOY",
    "email":"kazad79@gmail.com",
    "name":"Kalam Azad"
  }`
  localStorage.setItem('users',u)
}
export const getData = async(path,request={},secured=true,_url="") => {
       //setLogin();
      const url=_url==""?config.serverURI + path:_url + path
      let headers={
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if(secured){
        const ldata = localStorage.getItem('users')
        console.log(ldata);
        if ( ldata == null ) return [];
        const data = JSON.parse( ldata )
        const token = data.token
        headers["Authorization"] ='Bearer ' + token;
      }
      try {
      const response = await axios.get(url, {
          dataType: 'json',
          params:request,
          headers: headers
        });
       
        return response.data;
    
    } catch (err) {
      
       if(err.response.data){
        return {"errors":err.response.data};
      }else{
        return {"errors":err};
      }
     }     

     
    
};

export const postData = async(path,postdata,secured=true,_url="") => {
  //setLogin();
    const url=_url==""?config.serverURI + path:_url + path
    let headers={
      'Content-Type': 'application/json'
    };
    if(secured){
      const ldata = localStorage.getItem('users')
      if ( ldata == null ) return [];
      const data = JSON.parse( ldata )
      const token = data.token
      headers["Authorization"] ='Bearer ' + token;
    }
  
    try {
    const  response = await axios.post(url,postdata, {
        headers: headers
      });
     
      return response.data;
      
  } catch (err) {
    if(err.response.data){
      return {"errors":err.response.data};
    }else{
      return {"errors":err};
    }
     
   }     
  
};

export const patchData = async(path,postdata,secured=true,_url="") => {
  //setLogin();
    const url=_url==""?config.serverURI + path:_url + path
    let headers={
      'Content-Type': 'application/json'
    };
    if(secured){
      const ldata = localStorage.getItem('users')
      if ( ldata == null ) return [];
      const data = JSON.parse( ldata )
      const token = data.token
      headers["Authorization"] ='Bearer ' + token;
    }
    try {
    const response = await axios.patch(url,postdata, {
        headers: headers
      });
      return response.data;
  
  } catch (err) {
    if(err.response.data){
      return {"errors":err.response.data};
    }else{
      return {"errors":err};
    }
   }     
  
};

export const deleteData = async(path,_url="") => {
 // setLogin();
    const url=_url==""?config.serverURI + path:_url + path
   
   
      const ldata = localStorage.getItem('users')
      if ( ldata == null ) return [];
      const data = JSON.parse( ldata )
      const token = data.token
     
      let headers={
        'Content-Type': 'application/json',
        "Authorization":'Bearer ' + token
      };
      headers["Authorization"] ='Bearer ' + token;
    try {
    const response = await axios.delete(url, {
        headers: headers
      });
      return response.data;
  
  } catch (err) {
    if(err.response.data){
      return {"errors":err.response.data};
    }else{
      return {"errors":err};
    }
   }     
  
};
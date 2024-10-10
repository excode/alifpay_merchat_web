import config from '@/config';
import axios from 'axios';

const project_code="66efa1fcfb844876e472f02b"
export const getData = async(path,request={},secured=true,_url="") => {
       //setLogin();
      const url=_url==""?config.serverURI + path:_url + path
      let headers={
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if(_url!=""){
        headers["project_code"] =project_code;
      }
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
    if(_url!=""){
      headers["project_code"] =project_code;
    }
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
    if(_url!=""){
      headers["project_code"] =project_code;
    }
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
      if(_url!=""){
        headers["project_code"] =project_code;
      }
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
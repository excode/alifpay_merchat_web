

import config from '@/config'
import moment from 'moment'

export const validateEmail=(value)=> {
    // if the field is empty
   
    if (!value) {
      return false;
    }
    // if the field is not a valid email
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return false;
    }
    // All is good
    return true;
  }
  function isInt(value) {
    console.log(value);
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }
  function dummy(){
    console.log("I am dummy");
  }

function validateUsr(value) {
  if (!value) {
    return false;
  }
  const regex = /^[a-z\d_]{4,16}$/i;
    if (!regex.test(value)) {
      return false;
    }
    // All is good
    return true;
}
  function isValidHttpUrl(str) {
    const pattern = new RegExp(
      '/^[a-zA-Z0-9]+$/', // fragment locator
      'i'
    );
    return pattern.test(str);
  }
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
  }
  export const validateForm=(formData,rules=[{}])=>{
    //console.log(formData)
    var errors=[];
    for (const key in formData) {
     // console.log(`${key} -> ${formData[key]}`)
      const rule = rules.find(r=>r.id==key);
      if(rule!==undefined){
        //if(rule.required){
          let value="";
          if(formData[key]){
            console.log(key +  "  " + formData[key])
            value= typeof formData[key] === 'object' ?formData[key].value?formData[key].value:formData[key]:formData[key];
          }
        
          if(isNaN(value) && (value=="")){
            if(rule.required){
              if(config.multiLanguageSupport){
                errors.push(key +"_is_required")
              }else{
                errors.push(key.capitalize() +" is required")
              }
            }
          }else{
            if(rule.type==validate.email ){
              //console.log("Email checking "+value)
              if(!validateEmail(value)){
                if(config.multiLanguageSupport){
                  errors.push(key +"_invalid_email_address")
                }else{
                  errors.push(" invalid email address for "+key.capitalize() )
                }
              }
            }
            if(rule.max!==undefined && rule.max>0){
              if(value.length>rule.max){
                if(config.multiLanguageSupport){
                  errors.push(key +"_must_be_lower_than_"+rule.max+"_chars")
                }else{
                  errors.push(key.capitalize() +" must be lower than "+rule.max+" chars")
                }
              }
            }
            if(rule.min!==undefined && rule.min>0){
              if(value.length<rule.min){
                if(config.multiLanguageSupport){
                  errors.push(key +"_must_be_minimum_"+rule.min+"_chars")
                }else{
                  errors.push(key.capitalize() +" must be minimum  "+rule.min+" chars")
                }
              }
            }
            if(rule.type==validate.date ){
              let result1 =value.getDate;// moment(value, 'DD/MM/YYYY',true).isValid();
             // let result2 = moment(value, 'MM/DD/YYYY',true).isValid();
              if(!result1){
                if(config.multiLanguageSupport){
                  errors.push(key +"_is_not_valid_date")
                }else{
                  errors.push(key.capitalize() +" is not a valid date  ")
                }
              }
            }
            if(rule.type==validate.number ){
              
              if(isNaN(value)){
                if(config.multiLanguageSupport){
                  errors.push(key +"_is_not_valid_number")
                }else{
                  errors.push(key.capitalize() +" is not a valid number  ")
                }
              }
            }
            if(rule.type==validate.int ){
            if(value==0|| value=="0"|| value==="0"){

            }else{
              let newVal = value*1;
              //console.log(!Number.isInteger(newVal))
              if(!Number.isInteger(newVal)){
                if(config.multiLanguageSupport){
                  errors.push(key +"_is_not_valid_integer")
                }else{
                  errors.push(key.capitalize() +" is not a valid integer")
                }
              }
            }
          }
            if(rule.type==validate.url ){
              
              if(!isValidHttpUrl(value)){
                if(config.multiLanguageSupport){
                  errors.push(key +"_is_not_valid_url")
                }else{
                  errors.push(key.capitalize() +" is not a valid URL")
                }
              }
            }
            if(rule.type==validate.username ){
              
              if(!validateUsr(value)){
                if(config.multiLanguageSupport){
                  errors.push(key +"_is_not_valid_format")
                }else{
                  errors.push(key.capitalize() +" is not a valid!! Space , special chars not supported")
                }
              }
            }
          }
        
      }
    }
    return errors;

  }

  export class validate {
    // Private Fields
    static email = 0;
    static string = 1;
    static date = 2;
    static number = 3;
    static int = 4;
    static url = 5;
    static username = 6;
    
    // Accessors for "get" functions only (no "set" functions)
    static get email() { return this.email; }
    static get string() { return this.string; }
    static get date() { return this.date; }
    static get number() { return this.number; }
    static get int() { return this.int; }
    static get url() { return this.url; }
    static get username() { return this.username; }
}
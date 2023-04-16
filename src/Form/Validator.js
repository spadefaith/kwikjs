import Templating from "../Templating";
const inputEvent =function(callbacks){

    return  function (e){

        if(e){
            let target = e.target;
            let value = e.target.value;
            
            let attr = target.dataset.validator;


            let validator = attr.split(",").reduce((accu, iter)=>{
                
                let [key, value] = iter.split("=");
    
                if(value && value.includes(",")){
                    value = value.split(",");
                } else {
    
                    value = value ? value.trim() : true;
                };
    
                accu.push({key: key.trim(), value});
    
                return accu;
            },[]);
    
    
            if(!validator.length){
                return
            };
    
            const attrValues = {};
            let _callbacks = validator.filter(item=>{
                return callbacks[item.key];
            }).map(item=>{
                let {key , value} = item;
                attrValues[key] = value;
    
                let conf = callbacks[key];
                let callback = conf.handler;
                let errorMessage = conf.error;
    
                callback.errorMessage = errorMessage 
                callback.validatorName = key;
    
                return callback;
            });
    
    
            const asy = async function(callbacks){
                this.isLoading();
                const validation = await Promise.all(callbacks.map(async (callback)=>{
                    let _attrValues = attrValues[callback.validatorName];
                    
                    let message = callback.errorMessage;

                    
                    if(_attrValues && message.includes("{") && message.includes("}")){
                        // console.log(61,_attrValues, message);
                        
                        let data = _attrValues.split(",").reduce((accu, iter, index)=>{
                            
                            accu[`${index}`] = iter;

                            return accu;
                        }, {});
                        // console.log(66,data);
                        message = this.templating.replaceString(data, message);
                    }



                    let test = await callback({
                        target:e.target,
                        value
                    },_attrValues);
                    // console.log(75,test);
                    return {test,message};
                }));

                // console.log(78, validation);

                if(validation.some(val=>!val.test)){
                   this.addErrorClass(target);
                   
                } else {
                    this.addSuccessClass(target); 
                }
                this.showError(target, validation); 
                this.doneLoading();
            };
    
            asy.bind(this)(_callbacks);
        }
    
    
    }

}



export default class Validator {
    constructor(form, validation, opts){
        // type of element to create for the error text
        this.parentClass =  opts.parentClass;
        this.errorTextParent =  opts.errorTextParent;
        this.errorTextTag = opts.errorTextTag;
        // class of the error text element
        this.errorTextClass = opts.errorTextClass;
        //error class of the input
        this.errorClass = opts.errorClass;
        //success class of the input
        this.successClass = opts.successClass;
        //validation object
        this.validation = validation;
        this.form = form;

        this.templating = new Templating();

        this._addEvent(this.form);
    }

    _addEvent(target){
        target.addEventListener("input", inputEvent(this.validation).bind(this));
    }

    isLoading(){
        console.log("validating");
    }

    doneLoading(){
        console.log("validated");
    }
    addSuccessClass(target){
        if(target.classList.contains(this.errorClass)){
            target.classList.replace(this.errorClass, this.successClass);
        } else  if(!target.classList.contains(this.successClass)){
            target.classList.add(this.successClass);
        }
    }
    addErrorClass(target){
        if(target.classList.contains(this.successClass)){
            target.classList.replace(this.successClass, this.errorClass);
        } else  if(!target.classList.contains(this.errorClass)){
            target.classList.add(this.errorClass);
        }
    }
    showError(target, validated){
        let hasError = false;
        const messages = validated.reduce((accu, item)=>{

            let {test, message} = item;
            if(!test){
                hasError = true;
                accu += `${message} <br>`;
            };

            return accu;
        },"");
        // console.log(127,"error message", messages);

        // console.log(163,target, validated);

        // console.log(this.parentClass);

        let parentClass = `.${this.parentClass}`;

        let parent = target.closest(parentClass);
        // console.log(133, "parent",target,parentClass, parent);
        if(!parent){
            throw new Error("parent is not found");
        };
        
        const errorTagIdentity = this.errorTextClass;
        const connectedErrorTextParent = parent.querySelector(`.${errorTagIdentity}`);
        if(connectedErrorTextParent){
            connectedErrorTextParent.remove();
        };
        

        if(hasError){
            let tag = document.createElement(this.errorTextParent);
            tag.classList.add(errorTagIdentity);
            tag.innerHTML = messages;
            parent.appendChild(tag);
        };


    }
} 
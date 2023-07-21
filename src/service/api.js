import axios from 'axios';
import { API_NOTIFICATION_MESSAGES ,SERVICE_URLS} from '../constants/config'

import { getAccessToken, getType } from '../utils/common-utils';
const API_URL='https://blogbackend-ijum.onrender.com';
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000, 
    headers: {
        "content-type": "application/json"
    }
});

axiosInstance.interceptors.request.use(
    function(config){
        if(config.TYPE.params){
            config.params=config.TYPE.params;
        }
            else if(config.TYPE.query){
                config.url=config.url+'/'+config.TYPE.query;
            }
        return config;
    },
    function(error){
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
    function(response)
    {
        //stop global user
        return processResponse(response);
    },
    function(error){
        return (processError(error));
    }
)
// if sucess->return {isSUcess:true , data:Object}
// if fail ->return {isFailure:true  , status:string . sg:string, code :int}
const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data }
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        }
    }
}

const  processError=(error)=>{
    if(error.response){

        console.log("ERROR in RESPONSE" , error.toJSON())
        return {
            isError:true,
            msg:API_NOTIFICATION_MESSAGES.responseFailure,
            code:error.response.status
        }
    }
    else if(error.request){
        console.log("ERROR in Request" , error.toJSON())
        return {
            isError:true,
            msg:API_NOTIFICATION_MESSAGES.requestFailure,
            code:""
        }
    }
    else{
        console.log("ERROR in RESPONSE" , error.toJSON())
        return {
            isError:true,
            msg:API_NOTIFICATION_MESSAGES.networkError,
            code:""
        }

    }
}

const API={};
for(const [key , value] of Object.entries(SERVICE_URLS)){
    API[key]=(body , showUploladProgress , showDownloadProgress)=>
        axiosInstance({
            method:value.method,
            url:value.url,
            data:value.method === 'DELETE' ? {} : body,
            responseType:value.responseType,
            headers:{
                authorization:getAccessToken()
            },
            TYPE:getType(value , body),
            onUploadProgress:function(progressEvent){
                if(showUploladProgress)
                {
                    let percentageCompleted=Math.roound((progressEvent.loaded*100)/progressEvent.total)
                    showUploladProgress(percentageCompleted);
                }
            },
            onDownloadProgress:function(progressEvent){
                if(showDownloadProgress)
                {
                    let percentageCompleted=Math.roound((progressEvent.loaded*100)/progressEvent.total)
                    showDownloadProgress(percentageCompleted);
                }
            }

        })
    }

    export {API};
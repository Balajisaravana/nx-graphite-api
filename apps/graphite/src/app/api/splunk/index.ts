import {AxiosResponse} from 'axios'
import { ApiError } from '../api-middleware/types'
export const sendApiEvent = <T>(payload:{
    request : T,
    response : AxiosResponse | null, //null for failed requests
    timestamp : string,
    userId : string,
    url : string,
    responseTime : string,
    status : "FAILED" | "SUCCESS"
    uniqId ?: string //optional for failed requests
})=>{
    //call splunk Api and send event
    console.log("Splunk Api Event generated" , payload)
}
export const sendApiEventError = (payload:ApiError[])=>{
    //call splunk Api and send event
    console.log("Splunk Api Event generated" , payload)
}
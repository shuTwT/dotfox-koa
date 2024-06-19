import fetch from "node-fetch";
import log4js from "../../utils/log4js";
const IP_URL = "https://searchplugin.csdn.net/api/v1/ip/get";

export const getAddressByIp = (ip: string) => {
    return new Promise((resolve,reject)=>{
        fetch(IP_URL+`?ip=${ip}`).then(res=>res.json()).then((res:any)=>{
            if(res.data){
                resolve(res.data.address)
            }
        }).catch(res=>{
            log4js.error(res)
            resolve('请求错误')
        })
    })
};

import fs from "node:fs"
import path from "node:path"
import log4js from "./log4js"
import fetch  from "node-fetch"
import { nanoid } from "nanoid"
export function downloadFile(url:string):Promise<string>{
    const arr1 = url.split('/')
    const fullname = arr1.slice(arr1.length-1,arr1.length).toString()
    const arr2 = fullname.split('.')

    let filename = ''
    let extname=''

    if(arr2.length>=1){
        filename = arr2[0]
    }
    if(arr2.length==2){
        extname = arr2[1]
    }

    const target = path.resolve(process.cwd(), "public","profile","download",`${filename}_${nanoid()}.${extname}`)
    const relativeUrl = path.resolve("/","profile","download",`${filename}_${nanoid()}.${extname}`)
    const fileStream = fs.createWriteStream(target).on('error',function(e){
        log4js.error(e)
    }).on('ready',function(){
        
    }).on('finish',function(){

    })

    return new Promise((resolve,reject)=>{
        fetch(url,{
            method:'GET',
            headers:{
                'Content-Type':'application/octet-stream'
            }
        }).then(res=>{
            /** 获取请求头中的文件大小数据 */
            let length = res.headers.get('content-length')
            /** 创建进度 */
            res.body?.pipe(fileStream)
            resolve(relativeUrl)
        }).catch(res=>{
            fileStream.close()
            reject(res)
        })
    })
}
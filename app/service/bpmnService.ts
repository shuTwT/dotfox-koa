import BpmnModdle, { Definitions } from "bpmn-moddle";
import xml2js from "xml2js"

export class BpmnService{
    
    async  toDefinitions(xmlStr:string){
        const moddle = new BpmnModdle();
        // const definitions = await moddle.fromXML(xmlStr);
        // return definitions
    }
    async  createProcess(name:string,config:Record<string,string>){
        const moddle = new BpmnModdle();
        return moddle.create(name,config)
    }
    async  toXml(definitions:Definitions){
        const moddle = new BpmnModdle();
        const xml = await moddle.toXML(definitions)
    }
    toJson(xml:string){
        return new Promise((resolve,reject)=>{
            xml2js.parseString(xml,(err,result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }      
            })
        })
    }
}
import BpmnModdle, { Definitions } from "bpmn-moddle";

const moddle = new BpmnModdle();


export class BpmnService{
    
    async  toDefinitions(xmlStr:string){
        const definitions = await moddle.fromXML(xmlStr);
        return definitions
    }
    async  createProcess(name:string,config:Record<string,string>){
        return moddle.create(name,config)
    }
    async  toXml(definitions:Definitions){
        const xml = await moddle.toXML(definitions)
    }
    
}
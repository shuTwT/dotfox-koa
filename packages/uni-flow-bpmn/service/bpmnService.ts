import BpmnModdle, { Definitions } from "bpmn-moddle";

const moddle = new BpmnModdle();

export async function toDefinitions(xmlStr:string){
    const definitions = await moddle.fromXML(xmlStr);
    return definitions
}

export async function createProcess(name:string,config:Record<string,string>){
    return moddle.create(name,config)
}

export async function toXml(definitions:Definitions){
    const xml = await moddle.toXML(definitions)
}
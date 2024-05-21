
export default class BpmnModdle {
    constructor(packages?:any,options?:any){

    }
    fromXML(xmlStr:string,typeName?:string,options?:object):Promise<Definitions>
    create(name:string,options:any):any
    toXML(element:Definitions,options?:object):Promise<{xml:string}|Error>
}

export interface Definitions{

}
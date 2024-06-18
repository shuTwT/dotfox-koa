//https://docs.camunda.io/docs/apis-tools/node-js-sdk/
import {Camunda8} from '@camunda8/sdk'
import path from "node:path"

const camunda = new Camunda8()
const zeebe = camunda.getZeebeGrpcApiClient() // 获得 gRPC 客户端 这用于部署流程模型和启动流程实例
const operate = camunda.getOperateApiClient() // 获取 Operate 客户端 这用于与已完成的流程和已部署的流程模型进行交互
const optimize = camunda.getOptimizeApiClient() // unused
const tasklist = camunda.getTasklistApiClient() // 获取 Tasklist 客户端。这用于以编程方式与用户任务进行交互

console.log("Starting worker...");
zeebe.createWorker({
  taskType: "service-task",
  taskHandler: (job) => {
    console.log(`[Zeebe Worker] handling job of type ${job.type}`);
    return job.complete({
      serviceTaskOutcome: "We did it!",
    });
  },
});

export class BpmnService{
    /**
     * 部署流程模型
     */
    async deployResource(name:string,process:Buffer,tenantId?:string){
        const deploy = await zeebe.deployResource({
            name,
            process,
            tenantId
          });
          console.log(
            `[Zeebe] Deployed process ${deploy.deployments[0].process.bpmnProcessId}`
          );
    }
}
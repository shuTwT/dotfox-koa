// https://docs.camunda.io/docs/apis-tools/node-js-sdk/
// https://github.com/camunda/camunda-platform#using-docker-compose
import { Provide } from '@midwayjs/core';
import { Camunda8 } from '@camunda8/sdk'
import { TaskState } from '@camunda8/sdk/dist/tasklist/lib/TasklistDto'
import log4js from 'src/utils/log4js'

Provide()
export class BpmnService {
  camunda
  zeebe
  operate
  // optimize
  tasklist
  constructor(){
    this.camunda=new Camunda8()
    this.zeebe = this.camunda.getZeebeGrpcApiClient() // 获得 gRPC 客户端 这用于部署流程模型和启动流程实例
    this.operate = this.camunda.getOperateApiClient() // 获取 Operate 客户端 这用于与已完成的流程和已部署的流程模型进行交互
    // this.optimize = this.camunda.getOptimizeApiClient() // unused
    this.tasklist = this.camunda.getTasklistApiClient() // 获取 Tasklist 客户端。这用于以编程方式与用户任务进行交互
    log4js.info("Starting worker...");
    this.zeebe.createWorker({
      taskType: "service-task",
      taskHandler: (job) => {
        log4js.info(`[Zeebe Worker] handling job of type ${job.type}`);
        return job.complete({
          serviceTaskOutcome: "We did it!",
        });
      },
    });
  }
  /**
   * 创建流程实例
   */
  async createProcessInstance(bpmnProcessId: string, variables: object) {
    const variablesCopy = JSON.parse(JSON.stringify(variables))
    const p = await this.zeebe.createProcessInstanceWithResult({
      bpmnProcessId: bpmnProcessId,
      variables: variablesCopy
    })
    log4js.info(`[Zeebe] Finished Process Instance ${p.processInstanceKey}`);
    log4js.info(`[Zeebe] humanTaskStatus is "${p.variables.humanTaskStatus}"`);
    log4js.info(
      `[Zeebe] serviceTaskOutcome is "${p.variables.serviceTaskOutcome}"`
    );
  }
  async getProcessInstance(processInstanceKey:string){
    const historicalProcessInstance = await this.operate.getProcessInstance(
      processInstanceKey
    );
    return historicalProcessInstance
  }
  /**
   * 部署流程模型
   */
  async deployResource(name: string, process: Buffer, tenantId?: string) {
    const deploy = await this.zeebe.deployResource({
      name,
      process,
      tenantId
    });
    console.log(
      `[Zeebe] Deployed process ${deploy.deployments[0].process.bpmnProcessId}`
    );
  }
  async searchTask(state: TaskState) {
    const res = await this.tasklist.searchTasks({
      state
    })
    log4js.info(`[Tasklist] fetched ${res.length} human tasks`)
    return res
  }
  async assignTask(task: any) {
    log4js.info(`[Tasklist] claiming task ${task.id} from process ${task.processInstanceKey}`)
    const t = await this.tasklist.assignTask({
      taskId: task.id,
      assignee: 'demobot',
      allowOverrideAssignment: true,
    })
    log4js.info(`[Tasklist] servicing human task ${t.id} from process ${t.processInstanceKey}`)
  }
  async completeTask(task: any) {
    await this.tasklist.completeTask(task.id, {
      humanTaskStatus: "Got done"
    })
  }
}
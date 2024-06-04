interface AjaxSuccessResponse {
  code: number;
  msg: string;
  data?: any;
}

interface AjaxFailedResponse {
  code: number;
  msg: string;
  data?: any;
}
export class BaseController {
  constructor() {}
  protected ajaxSuccess(data: undefined): AjaxSuccessResponse;
  protected ajaxSuccess(data: object): AjaxSuccessResponse;
  protected ajaxSuccess(msg: string): AjaxSuccessResponse;
  protected ajaxSuccess(msg: string, data: object): AjaxSuccessResponse;
  protected ajaxSuccess(param1?: any, param2?: any): AjaxSuccessResponse {
    if (typeof param1 === "undefined") {
      return {
        code: 200,
        msg: "操作成功",
      };
    } else if (typeof param1 === "string") {
      if (param2 !== "undefined") {
        return {
          code: 200,
          msg: param1,
          data: param2,
        };
      } else {
        return {
          code: 200,
          msg: param1,
        };
      }
    } else {
      return {
        code: 200,
        msg: "操作成功",
        data: param1,
      };
    }
  }
  ajaxFailed(msg: string): AjaxFailedResponse {
    return {
      code: 500,
      msg: msg,
      data: null,
    };
  }
}

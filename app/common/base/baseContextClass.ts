export class BaseContextClass<
  Context = any,
  Application = any,
  AppConfig = any,
  Service = any
> {
  protected ctx: Context;
  protected app: Application;
  protected config: AppConfig;
  protected service: Service;
  protected logger:any
  constructor(ctx: Context);
  constructor(ctx: any) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config;
    this.service = ctx.service;
  }
}

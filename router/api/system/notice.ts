import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import dayjs from "dayjs";
import type { TransformCallback } from "stream";
import { Stream, Transform } from "stream";
import EventEmitter from "events";
import { parseQuery, str2num } from "../utils";

class SSEStream extends Transform {
  constructor() {
    super({
      writableObjectMode: true,
    });
  }
  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.push(`data:${JSON.stringify(chunk)}\n\n`);
    callback();
  }
}

const noticeRouter = new Router<DefaultState, Context>({ prefix: "/notice" });
const events = new EventEmitter();
events.setMaxListeners(0);

//向所有客户端推送数据
const pushData = async () => {
  try {
    const noticeList = await prisma.sysNotice.findMany({
      where: {
        noticeType: "1",
      },
      take: 5,
      orderBy: {
        createTime: "desc",
      },
    });
    events.emit("data", {
      code: 200,
      msg: "success",
      data: {
        noticeList: noticeList,
      },
    });
  } catch (error) {
    events.emit("data", {
      code: 500,
      msg: String(error),
    });
  }
  interval();
};

const interval = () => {
  setTimeout(() => {
    pushData();
  }, 5000);
};

interval();
/**
 * 通知公告列表
 */
noticeRouter.get("/", async (ctx, next) => {
  const query = ctx.query as any;
  const noticeTitle = parseQuery(query, "noticeTitle");
  const noticeType = parseQuery(query, "noticeType");
  const noticeReaded = parseQuery(query, "noticeReaded");
  const pageSize = str2num(parseQuery(query, "pageSize"), 10);
  const pageNum = str2num(parseQuery(query, "pageNum"), 1);
  const [noticeList, count] = await prisma.$transaction([
    prisma.sysNotice.findMany({
      where: {
        noticeTitle: {
          contains: noticeTitle,
        },
        noticeType,
        noticeReaded,
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createTime: "desc",
      },
    }),
    prisma.sysNotice.count({
      where: {
        noticeTitle: {
          contains: noticeTitle,
        },
        noticeType,
        noticeReaded,
      },
    }),
  ]);
  ctx.body = {
    code: 200,
    msg: "success",
    data: {
      list: noticeList,
      total: count,
    },
  };
});

noticeRouter.get("/msg", async (ctx, next) => {
  ctx.req.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new SSEStream();
  ctx.status = 200;
  ctx.body = stream;

  const listener = (data: object) => {
    stream.write(data);
  };

  events.on("data", listener);

  stream.on("close", () => {
    ctx.log4js.debug("客户端断开连接");
    events.off("data", listener);
  });
});

/**
 * 通知公告详情
 */
noticeRouter.get("/:noticeId", async (ctx, next) => {
  const params = ctx.params as any;
  const noticeId = Number(params["noticeId"]);
  try {
    const notice = await prisma.sysNotice.findUnique({
      where: {
        noticeId,
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
      data: notice,
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: error,
    };
  }
});

/**
 * 通知公告新增
 */
noticeRouter.post("/", async (ctx, next) => {
  const body: any = ctx.request.body;
  const loginUser = ctx.getLoginUser();
  const date = dayjs();
  try {
    await prisma.sysNotice.create({
      data: {
        noticeTitle: body.noticeTitle,
        noticeType: body.noticeType,
        noticeContent: body.noticeContent,
        createBy: loginUser.getUserName(),
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: error,
    };
  }
});

/**
 * 通知公告修改
 */
noticeRouter.put("/:noticeId", async (ctx, next) => {
  const params = ctx.params as any;
  const noticeId = Number(params["noticeId"]);
  const body: any = ctx.request.body;
  const loginUser = ctx.getLoginUser();
  const date = dayjs();
  try {
    await prisma.sysNotice.update({
      where: {
        noticeId: noticeId,
      },
      data: {
        noticeTitle: body.noticeTitle,
        noticeType: body.noticeType,
        noticeContent: body.noticeContent,
        status:body.status,
        updateBy: loginUser.getUserName(),
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: error,
    };
  }
});
/**
 * 通知公告删除
 */
noticeRouter.delete("/:ids", async (ctx, next) => {
  const body: any = ctx.request.body;
  try {
    await prisma.sysNotice.delete({
      where: {
        noticeId: body.noticeId,
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: error,
    };
  }
});

export { noticeRouter };

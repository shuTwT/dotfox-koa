import dayjs from "dayjs";
import prisma from "../utils/prisma.js";
import * as log4js from "../utils/log4js.js";
import { Prisma } from "@prisma/client";

/**
 * 创建房间
 */
export async function createRoom(
  roomId: number | string,
  roomOwnerUid: string,
  data: any = {}
) {
  try {
    await prisma.room.create({
      data: {
        roomId: roomId + "",
        roomOwnerUid,
        ...data,
      },
    });
    return true;
  } catch (e) {
    log4js.prismaError(e);
  }
}

export async function updateRoom(
  roomId: string,
  roomOwnerUid: string,
  data: any = {}
) {
  const room = await prisma.room.update({
    data: {
      roomOwnerUid,
      ...data,
    },
    where: {
      roomId,
    },
  });
  if (room) {
    return true;
  } else {
    return false;
  }
}

export async function createLive(roomId: string, date: string) {
  const live = await prisma.live.create({
    data: {
      roomId,
      date: dayjs(date).format("YYYY-MM-DD"),
    },
  });
  if (live) {
    return true;
  } else {
    return false;
  }
}
export async function increaseEnterRoomNum(
  roomId: string,
  uid: string,
  date: string
) {
  const today = dayjs(date).format("YYYY-MM-DD");
  // 当日进房量+1
  try {
    await prisma.live.upsert({
      where: {
        roomId_date: {
          roomId,
          date: today,
        },
      },
      update: {
        entryNum: {
          increment: 1,
        },
      },
      create: {
        roomId,
        date: today,
      },
    });
    await prisma.userEntry.upsert({
      where: {
        uid_roomId: {
          uid,
          roomId,
        },
      },
      update: {
        latest: date,
        num: {
          increment: 1,
        },
      },
      create: {
        uid,
        roomId,
        first: date,
        latest: date,
      },
    });
    return true;
  } catch (e) {
    log4js.prismaError(e);
  }
}
export async function increaseSpeakerNum(roomId: string, date: string) {
  // 当日发言人数+1
  const today = dayjs(date).format("YYYY-MM-DD");
  try {
    await prisma.live.upsert({
      where: {
        roomId_date: {
          roomId,
          date: today,
        },
      },
      update: {
        speakNum: {
          increment: 1,
        },
      },
      create: {
        roomId,
        date: today,
      },
    });
    return true;
  } catch (e) {
    log4js.prismaError(e);
  }
}
export async function increaseDanmakuNum(num = 1) {
  // 当日弹幕数量+1
}
export async function increaseConsumptionNum(num = 1000) {
  // 当日消费金额
}
export async function updateGift(
  roomId: string,
  uid: string,
  uname: string,
  date: string,
  face: string,
  giftId: number,
  giftName: string,
  medalInfo: object,
  giftNum: number,
  coinType: string,
  price: number
) {
  const today = dayjs(date).format("YYYY-MM-DD");
  // 当日礼物数量
  const giftPrice = price / giftNum;
  try {
    await prisma.live.upsert({
      where: {
        roomId_date: {
          roomId,
          date: today,
        },
      },
      update: {
        giftNum: {
          increment: 1,
        },
      },
      create: {
        roomId,
        date: today,
      },
    });
    await prisma.gift.upsert({
      where: {
        giftId,
      },
      update: {},
      create: {
        giftId,
        giftName,
        giftPrice
      },
    });
    await prisma.user.upsert({
      where: {
        uid,
      },
      update: {
        uname,
        fa: face,
      },
      create: {
        uid,
        uname,
        fa: face,
      },
    });
    await prisma.sendGift.create({
      data: {
        roomId,
        uid,
        giftId,
        giftName,
        date,
      },
    });

    await prisma.userGift.upsert({
      where: {
        uid_roomId: {
          uid,
          roomId,
        },
      },
      update: {
        latest: date,
        num: {
          increment: giftNum,
        },
      },
      create: {
        uid,
        roomId,
        first: date,
        latest: date,
        num: giftNum,
      },
    });
  } catch (e) {
    log4js.prismaError(e);
  }
}
export async function updateLikeNum(
  roomId: string,
  likeNum: number,
  date: string
) {
  // 当日点赞数
  const today = dayjs(date).format("YYYY-MM-DD");
  try {
    await prisma.live.update({
      where: {
        roomId_date: {
          roomId: roomId + "",
          date: today,
        },
      },
      data: {
        likeNum,
      },
    });
  } catch (e) {
    log4js.prismaError(e);
  }
}
export async function increaseShareNum(num = 1) {
  // 当日分享数
}
export async function increaseFollowNum(roomId: string, date: string) {
  // 当日关注数
  const today = dayjs(date).format("YYYY-MM-DD");
  try {
    await prisma.live.upsert({
      where: {
        roomId_date: {
          roomId,
          date: today,
        },
      },
      update: {
        followNum: {
          increment: 1,
        },
      },
      create: {
        roomId,
        date: today,
        followNum: 1,
      },
    });
  } catch (e) {
    log4js.prismaError(e);
  }
}
export async function updateLiveFans(
  roomId: string,
  date: string,
  fans: number,
  fansClub: number
) {
  const today = dayjs(date).format("YYYY-MM-DD");
  try {
    await prisma.live.upsert({
      where: {
        roomId_date: {
          roomId,
          date: today,
        },
      },
      update: {
        fans,
        fansClub,
      },
      create: {
        roomId,
        fans,
        fansClub,
        date: today,
      },
    });
    return true;
  } catch (e) {
    log4js.prismaError(e);
  }
}
export async function updateRedNotice(
  roomId: string,
  date: string,
  tag: number
) {
  try {
    await prisma.redNotice.create({
      data: {
        roomId,
        redNoticeTag: tag,
        date: dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
      },
    }),
      await prisma.live.upsert({
        update: {
          redNoticeNum: {
            increment: 1,
          },
        },
        where: {
          roomId_date: {
            roomId,
            date: dayjs(date).format("YYYY-MM-DD"),
          },
        },
        create: {
          roomId,
          date: dayjs(date).format("YYYY-MM-DD"),
        },
      });
  } catch (e) {
    log4js.prismaError(e);
  }
}

/**
 * 设置直播间开播状态
 */
export async function updateRoomState(roomId: string, state: number = 0) {
  try {
    await prisma.room.update({
      where: {
        roomId,
      },
      data: {
        active: state,
      },
    });
  } catch (error) {
    log4js.error(error);
  }
}
export async function updateLiveWarning(roomId: string, date: string) {
  try {
    await prisma.live.update({
      where: {
        roomId_date: {
          roomId,
          date: dayjs(date).format("YYYY-MM-DD"),
        },
      },
      data: {
        redNoticeNum: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    log4js.error(error);
  }
}

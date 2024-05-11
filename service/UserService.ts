import prisma from "../utils/prisma.js";
import * as log4js from "../utils/log4js.js"

export async function existUser(uid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    log4js.prismaError(e)
  }

}

/**
 * 创建用户
 */
export async function createUser(uid: string, data: any) {
  try {
    const User = await prisma.user.create({
      data: {
        uid,
        ...data,
      },
    });
    if (User) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    log4js.prismaError(e)
  }
}
/**
 * 更新用户
 */
export async function updateUser(uid: string, data: object) {
  try {
    const user = await prisma.user.update({
      where: {
        uid,
      },
      data,
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    log4js.prismaError(e)
  }
}

/**
 * 是否存在用户，存在则更新，不存在则创建
 */
export async function processUser(
  uid: string,
  data: { uname: string; fa?: string } & object
) {
  try {
    await prisma.user.upsert({
      where: {
        uid: uid + "",
      },
      create: {
        uid: uid + "",
        ...data,
      },
      update: {
        ...data,
      },
    });
    return true;
  } catch (e) {
    log4js.prismaError(e)
  }
}

/**
 * 处理用户发言
 */
export async function saveUserSpeak(
  uid: string,
  uname: string,
  roomId: string,
  content: string,
  date: string
) {
  try {
    await prisma.user.upsert({
      where: {
        uid,
      },
      create: {
        uid,
        uname,
      },
      update: {
        uname,
        speakNum:{
          increment:1
        }
      },
    });
    await prisma.speak.create({
      data: {
        uid,
        roomId,
        content,
        date,
      },
    });
    await prisma.userDanmu.upsert({
      where: {
        uid_roomId: {
          uid,
          roomId
        }
      },
      update: {
        latest: date,
        num: {
          increment: 1
        },
        content
      },
      create: {
        uid,
        roomId,
        first: date,
        latest: date,
        content
      }
    })
    return true;
  } catch (e) {
    log4js.prismaError(e)
  }
}

export async function entryRoom(uid: string, uname: string, roomId: string) {
  if (await existUser(uid)) {
    //用户存在
    return await updateUser(uid, { uname });
  } else {
    //用户不存在
    return await createUser(uid, { uname });
  }
}

export async function userLog(uid: string, uname:string, roomId: string, content: string, date: string) {
  try {
    await processUser(uid, { uname });
    await prisma.userLog.create({
      data: {
        uid,
        roomId,
        content,
        date
      }
    })
  } catch (e) {
    log4js.prismaError(e)
  }

}

export async function userLike(uid: string, roomId: string, date: string, uname: string) {
  try {
    await processUser(uid, { uname })
    await prisma.userLike.upsert({
      where: {
        uid_roomId: {
          uid: uid + "",
          roomId
        }
      },
      update: {
        latest: date,
        num: {
          increment: 1
        }
      },
      create: {
        uid: uid + "",
        roomId,
        first: date,
        latest: date
      }
    })
  } catch (e) {
    log4js.prismaError(e)
  }
}

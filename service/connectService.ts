import prisma from "../utils/prisma.js";
import { getDanmuConf, getRoomid, getRoomInfo } from "../core/apis";
import * as log4js from "../utils/log4js.js";
import { BLiveTCP } from "../core/BLiveTCP.js";
import { SysConfigService } from "./system/SysConfigService.js";

export const connectPool = new Map< number, BLiveTCP>();
const sysConfigService= new SysConfigService()

export async function createConnect(short_room_id: number) {
  const buvid = await sysConfigService.selectConfigByKey('blive.cookies.buvid')
  const uid = await sysConfigService.selectConfigByKey('blive.uid')
  const SESSDATA = await sysConfigService.selectConfigByKey('live.cookies.SESSDATA')
  const bili_jct = await sysConfigService.selectConfigByKey('blive.cookies.bili_jct')
  const bili_ticket = await sysConfigService.selectConfigByKey('blive.cookies.bili_ticket')
  const bili_ticket_expires = await sysConfigService.selectConfigByKey('blive.cookies.bili_ticket_expires')
  const DedeUserID = await sysConfigService.selectConfigByKey('blive.dedeUserID')
  const cookies = `SESSDATA=${SESSDATA};bili_jct=${bili_jct};bili_ticket=${bili_ticket};bili_ticket_expires=${bili_ticket_expires};DedeUserID=${DedeUserID};buvid3=${buvid};`;

  if (buvid == "") {
    throw "请先在系统设置中设置buvid"
  }
  if (uid=="") {
    throw "请先在系统设置中设置uid"
  }
  if(Number.isNaN(short_room_id)){
    throw "请确认roomId正确"
  }

  const { room_id } = await getRoomid(short_room_id, cookies);

  if (connectPool.has(room_id)) {
    throw "该房间已在连接池中"
  }
  const {
    description,
    parent_area_name,
    title,
    user_cover,
    keyframe,
    tags,
    area_name,
    room_owner_uid,
  } = await getRoomInfo(room_id, cookies);

  await prisma.room.upsert({
    where: {
      roomId: room_id + "",
    },
    update: {
      roomOwnerUid: room_owner_uid + "",
      description,
      parentAreaName: parent_area_name,
      title,
      userCover: user_cover,
      keyframe,
      tags,
      areaName: area_name,
    },
    create: {
      roomId: room_id + "",
      roomOwnerUid: room_owner_uid + "",
      description,
      parentAreaName: parent_area_name,
      title,
      userCover: user_cover,
      keyframe,
      tags,
      areaName: area_name,
    },
  });

  const conf = await getDanmuConf(room_id, cookies);

  const live = new BLiveTCP(room_id, {
    uid: Number(uid),
    key: conf.key,
    buvid: buvid,
  });


  connectPool.set(room_id, live);
}

export async function closeConnect(roomId:number){
    const connect=connectPool.get(roomId)
    if(connect){
        connect.close()
        connectPool.delete(roomId)
    }else{
        throw new Error("无此连接")
    }
}
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { menus } from "./seedData/menus";
import { roleMenus } from "./seedData/roleMenus";
import { configs } from "./seedData/configs";
import {dictTypes} from "./seedData/dictTypes";
import { dictDatas } from "./seedData/dictDatas";
const prisma = new PrismaClient();
async function main() {
    const now = dayjs()
  const datetime = now.format("YYYY-MM-DD HH:mm:ss");
  await prisma.sysDept.upsert({
    where: {
      deptId: 100,
    },
    update: {
      parentId: 0,
      ancestors: "0",
      deptName: "阳光互联科技有限公司",
      type: 1,
      leader: "阳光互联",
      phone: "15888888888",
      email: "ry@qq.com",
      status: "1",
    },
    create: {
      deptId: 100,
      parentId: 0,
      ancestors: "0",
      deptName: "阳光互联科技有限公司",
      type: 1,
      leader: "阳光互联",
      phone: "15888888888",
      email: "ry@qq.com",
      status: "1",
      createBy: "admin",
      createTime: now.toDate(),
    },
  });
  await prisma.sysDept.upsert({
    where: {
      deptId: 101,
    },
    update: {
      parentId: 100,
      ancestors: "0,100",
      deptName: "深圳总公司",
      type: 2,
      leader: "阳光互联",
      phone: "15888888888",
      email: "ry@qq.com",
      status: "1",
    },
    create: {
      deptId: 101,
      parentId: 100,
      ancestors: "0,100",
      deptName: "深圳总公司",
      type: 2,
      leader: "阳光互联",
      phone: "15888888888",
      email: "ry@qq.com",
      createBy: "admin",
      createTime: now.toDate(),
    },
  });
  await prisma.sysRole.upsert({
    where: {
      id: 1,
    },
    update: {
      name: "超级管理员",
      code: "admin",
      sort: 1,
      status: "1",
      dataScope: "1",
    },
    create: {
      id: 1,
      name: "超级管理员",
      code: "admin",
      sort: 1,
      status: "1",
      dataScope: "1",
      createBy: "admin",
      createTime: now.toDate(),
    },
  });
  await prisma.sysRole.upsert({
    where: {
      id: 2,
    },
    update: {
      name: "普通角色",
      code: "common",
      sort: 2,
      status: "1",
      dataScope: "2",
    },
    create: {
      id: 2,
      name: "普通角色",
      code: "common",
      sort: 2,
      status: "1",
      dataScope: "2",
      createBy: "admin",
      createTime: now.toDate(),
    },
  });

  await prisma.sysUser.upsert({
    where: {
      userId: 1,
    },
    update: {
      deptId: 100,
      avatar: "https://avatars.githubusercontent.com/u/44761321",
      username: "admin",
      nickname: "阳光互联",
      userType: "00",
      email: "ry@163.com",
      phonenumber: "15888888888",
      password: "0192023a7bbd73250516f069df18b500",
    },
    create: {
      userId: 1,
      deptId: 100,
      avatar: "https://avatars.githubusercontent.com/u/44761321",
      username: "admin",
      nickname: "阳光互联",
      userType: "00",
      email: "ry@163.com",
      phonenumber: "15888888888",
      password: "0192023a7bbd73250516f069df18b500",
      createBy: "admin",
      createTime: now.toDate(),
    },
  });
  await prisma.sysUser.upsert({
    where: {
      userId: 2,
    },
    update: {
      deptId: 100,
      avatar: "https://avatars.githubusercontent.com/u/44761321",
      username: "common",
      nickname: "普通用户",
      userType: "00",
      email: "ry@163.com",
      phonenumber: "15888888888",
      password: "0192023a7bbd73250516f069df18b500",
    },
    create: {
      userId: 2,
      deptId: 100,
      avatar: "https://avatars.githubusercontent.com/u/44761321",
      username: "common",
      nickname: "普通用户",
      userType: "00",
      email: "ry@163.com",
      phonenumber: "15888888888",
      password: "0192023a7bbd73250516f069df18b500",
      createBy: "admin",
      createTime: now.toDate(),
    },
  });
  await prisma.sysUserRole.upsert({
    where:{
        userId_roleId:{
            roleId:1,
            userId:1
        }
    },
    create:{
        roleId:1,
        userId:1
    },
    update:{}
  })
  await prisma.sysUserRole.upsert({
    where:{
        userId_roleId:{
            roleId:2,
            userId:2
        }
    },
    create:{
        roleId:2,
        userId:2
    },
    update:{}
  })

  await prisma.sysPost.upsert({
    where: {
      postId: 1,
    },
    update: {
      postCode: "ceo",
      postName: "董事长",
      postSort: 1,
    },
    create: {
      postId: 1,
      postCode: "ceo",
      postName: "董事长",
      postSort: 1,
      createBy: "admin",
      createTime: now.toDate(),
    },
  });
  for (const key in menus) {
    const item = menus[key];
    await prisma.sysMenu.upsert({
      where: {
        menuId: item.menuId,
      },
      update: {
        parentId: item.parentId,
        menuType: item.menuType,
        title: item.title,
        menuName: item.menuName,
        component: item.component,
        rank: item.rank,
        path: item.path,
        redirect: item.redirect,
        icon: item.icon,
        extraIcon: item.extraIcon,
        enterTransition: item.enterTransition,
        leaveTransition: item.leaveTransition,
        activePath: item.activePath,
        auths: item.auths,
        frameSrc: item.frameSrc,
        frameLoading: item.frameLoading,
        keepAlive: item.keepAlive,
        hiddenTag: item.hiddenTag,
        showLink: item.showLink,
        showParent: item.showParent,
      },
      create: {
        menuId: item.menuId,
        parentId: item.parentId,
        menuType: item.menuType,
        title: item.title,
        menuName: item.menuName,
        component: item.component,
        rank: item.rank,
        path: item.path,
        redirect: item.redirect,
        icon: item.icon,
        extraIcon: item.extraIcon,
        enterTransition: item.enterTransition,
        leaveTransition: item.leaveTransition,
        activePath: item.activePath,
        auths: item.auths,
        frameSrc: item.frameSrc,
        frameLoading: item.frameLoading,
        keepAlive: item.keepAlive,
        hiddenTag: item.hiddenTag,
        showLink: item.showLink,
        showParent: item.showParent,
      },
    });
  }
  for (const key in roleMenus) {
    roleMenus[key].menuIds.forEach(async (item) => {
      await prisma.sysRoleMenu.upsert({
        where: {
          roleId_menuId: {
            roleId: roleMenus[key].roleId,
            menuId: item,
          },
        },
        update: {},
        create: {
          roleId: roleMenus[key].roleId,
          menuId: item,
        },
      });
    });
  }

  for (const key in configs) {
    await prisma.sysConfig.upsert({
      where: {
        configId: configs[key].configId,
      },
      update: {
        configKey: configs[key].configKey,
        configName: configs[key].configName,
        configType: configs[key].configType,
      },
      create: {
        configKey: configs[key].configKey,
        configName: configs[key].configName,
        configType: configs[key].configType,
        configValue: configs[key].configValue,
      },
    });
  }

  for(const key in dictTypes){
    await prisma.sysDictType.upsert({
      where: {
        dictId: dictTypes[key].dictId,
      },
      update: {
        dictName: dictTypes[key].dictName,
        dictType: dictTypes[key].dictType,
        status: dictTypes[key].status,
        remark: dictTypes[key].remark,
      },
      create: {
        dictName: dictTypes[key].dictName,
        dictType: dictTypes[key].dictType,
        status: dictTypes[key].status,
        remark: dictTypes[key].remark,
      },
    });
  }
  for(const key in dictDatas){
    await prisma.sysDictData.upsert({
      where: {
        dictCode: dictDatas[key].dictCode,
      },
      update: {
        dictLabel: dictDatas[key].dictLabel,
        dictType: dictDatas[key].dictType,
        dictValue: dictDatas[key].dictValue,
        status: dictDatas[key].status,
        remark: dictDatas[key].remark,
      },
      create: {
        dictLabel: dictDatas[key].dictLabel,
        dictType: dictDatas[key].dictType,
        dictValue: dictDatas[key].dictValue,
        status: dictDatas[key].status,
        remark: dictDatas[key].remark,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../utils/prisma";

const asyncRoutesRouter = new Router<DefaultState, Context>();

function arrayToTree(arr:any[], root:number) {
  const result = [] // 用于存放结果
  const map : any= {} // 用于存放 list 下的节点

  // 1. 遍历 arr，将 arr 下的所有节点使用 id 作为索引存入到 map
  for (const item of arr) {
    map[item.menuId] = item // 浅拷贝（存储对 item 的引用）
  }

  // 2. 再次遍历，将根节点放入最外层，子节点放入父节点
  for (const item of arr) {
    // 3. 获取节点的 id 和 父 id
    const { menuId, parentId } = item // ES6 解构赋值
    // 4. 如果是根节点，存入 result
    if (item.parentId === root) {
      result.push(map[menuId])
    } else {
      // 5. 反之，存入到父节点
      map[parentId].children ? map[parentId].children.push(map[menuId]) : (map[parentId].children = [map[menuId]])
    }
  }

  // 将结果返回
  return result
}

asyncRoutesRouter.get("/get-async-routes", async (ctx, next) => {

  const menus = await prisma.sysMenu.findMany()
  const routes=menus.filter(item=>item.menuType!=3).map(item=>{
    if(item.menuType==0){
      return {
        menuId:item.menuId,
        path:item.path,
        component:item.component,
        name:item.menuName,
        parentId:item.parentId,
        meta:{
          icon:item.icon,
          title:item.title,
          showLink:item.showLink,
          rank:item.rank,
          roles:["admin"],
          keepAlive:item.keepAlive,
        }
      }
    }else if(item.menuType==1){
      return {
        menuId:item.menuId,
        path:item.path,
        name:item.menuName,
        parentId:item.parentId,
        meta:{
          icon:item.icon,
          title:item.title,
          keepAlive:item.keepAlive,
          frameSrc:item.frameSrc,
          showLink:item.showLink,
          rank:item.rank,
          roles:["admin"],
        }
      }
    }else if(item.menuType==2){
      return {
        menuId:item.menuId,
        path:item.path,
        name:item.menuName,
        parentId:item.parentId,
        meta:{
          icon:item.icon,
          title:item.title,
          showLink:item.showLink,
          rank:item.rank,
          roles:["admin"],
          keepAlive:item.keepAlive,
        }
      }
    }
  }
  )
  const asyncRoutes=arrayToTree(routes,0)
  ctx.body = {
    success: true,
    data:asyncRoutes  
  };
});

export { asyncRoutesRouter };

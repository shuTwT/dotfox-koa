import type { SysDictType } from "@prisma/client"
export const dictTypes=[
    {
        dictId:1,
        dictName:'用户性别',
        dictType:'sys_user_sex',
        status:"1",
        remark:'用户性别列表'
    }
] as Partial<SysDictType>[]
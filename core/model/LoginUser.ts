import { SysUser } from "@prisma/client"

interface UserDetails{
    userId:number
    deptId:number|null
    token:string
    loginTime?:number
    expireTime?:number
    ipaddr?:number
    loginLocation?:string
    browser?:string
    os?:string
    permissions:Set<string>
    user:SysUser
}
export class LoginUser implements UserDetails{
    userId:number
    deptId:number|null
    token:string
    permissions:Set<string>
    user:SysUser
    constructor(token:string,user:SysUser,permissions:string[])
    constructor(token:string,user:SysUser,permissions:string[],userId:number,deptId:number|null)
    constructor(token:string,user:SysUser,permissions:string[],userId?:number,deptId?:number|null){
        this.token=token
        this.user = user
        this.permissions=new Set(permissions)
        if(typeof userId !=='undefined'){
            this.userId=userId;
        }else{
            this.userId=user.userId
        }
        if(typeof deptId!=='undefined'){
            this.deptId=deptId;
        }else{
            this.deptId=user.deptId
        }
    }
    getUserName(){
        return this.user.userName
    }
    getPassword(){
        return this.user.password
    }
    getPermissions(){
        return Array.from(this.permissions)
    }
}
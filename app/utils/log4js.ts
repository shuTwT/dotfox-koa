import { Prisma } from '@prisma/client'
import log4j from 'log4js'
const levels = {
    'trace'     : log4j.levels.TRACE,
    'debug'     : log4j.levels.DEBUG,
    'info'      : log4j.levels.INFO,
    'warn'      : log4j.levels.WARN,
    'error'     : log4j.levels.ERROR,
    'fatal'     : log4j.levels.FATAL
}

// log4j配置
log4j.configure({
    appenders: {
        console: { type: 'console' },
        info: {
            type: 'file',
            filename: 'logs/all-logs.log'
        },
        error: {
            type: 'dateFile',
            filename: 'logs/log',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true      // 设置文件名称为 filename + pattern
        }
    },
    categories: {
        default: {
            appenders: [ 'console' ],
            level: 'debug'
        },
        info: {
            appenders: [ 'info', 'console' ],
            level: 'info'
        },
        error: {
            appenders: [ 'error', 'console' ],
            level: 'error'
        }
    }
})

let debugLogger = log4j.getLogger('debug')
/**
 * 日志输出 level为bug
 */
export function debug ( content:string,...args:any[] ) {
    
    debugLogger.level = levels.debug
    debugLogger.debug(content,...args)
}

let infoLogger = log4j.getLogger('info')
/**
 * 日志输出 level为info
 */
 export function info ( content:string,...args:any[] )  {
    infoLogger.level = levels.info
    infoLogger.info(content,...args)
}

let errorLogger = log4j.getLogger('error')
/**
 * 日志输出 level为error
 */
export function error ( content:string,...args:any[] )  :void
export function error ( content:unknown,...args:any[] )  :void
export function error ( content:string|unknown,...args:any[] )  {
    errorLogger.level = levels.error
    if(content instanceof Error){
        errorLogger.error(content.name,...args)
        errorLogger.error(content.message,...args)
        errorLogger.error(content.stack,...args)
        return
    }
    
    errorLogger.error(content,...args)
}

export function prismaError(e:unknown){
    if(e instanceof Prisma.PrismaClientKnownRequestError){
        error('===prisma error===')
        error('code:%s',e.code)
        error('clientVersion:%s',e.clientVersion)
        error('%s',e.message)
        error('meta:%o',e.meta)
        error('==================')
    }else throw e
}

export default {
    error,info,debug,prismaError
}
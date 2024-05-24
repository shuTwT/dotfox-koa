import {glob} from 'glob'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const controller:Record<string,any> = {}

const files = await glob('app/controller/**/*Controller.ts',{ignore:'node_modules'})

Object.entries(files).forEach(([key,value])=>{
    const module = require(value)
    const pathArr=value.split(path.sep)
    const fullname = pathArr[pathArr.length-1]
    const filename = fullname.split('.')[0]
	controller[filename] = module
})

export default controller
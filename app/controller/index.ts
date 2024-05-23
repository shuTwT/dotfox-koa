import {glob} from 'glob'
const controller = {
    
}
const files = await glob('**/*Controller.ts')

Object.entries(files).forEach(([key,value])=>{
    console.log(key)
    // const value = require(key)
	// controllers[name] = value
})
export default controller
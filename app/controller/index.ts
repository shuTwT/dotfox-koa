import { glob } from "glob";
import path from "node:path";
import { createRequire } from "node:module";
import log4js from "app/utils/log4js";
const require = createRequire(import.meta.url);
const originModules: Record<string, any> = {};

const files = await glob("app/controller/**/*Controller.ts", {
  ignore: "node_modules",
});

Object.entries(files).forEach(([key, value]) => {
  const module = require(value);
  const pathArr = value.split(path.sep);
  const fullname = pathArr[pathArr.length - 1];
  const filename = fullname.split(".")[0];
  originModules[filename] = module;
});

const controller: Record<string, any> = {};

Object.entries(originModules).forEach(([key, value]) => {
    try{
        controller[key] = value.default();
    }catch(error){
        log4js.error(error)
    }

});

export default controller;

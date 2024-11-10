import fs from 'fs';
import BaseController from "./base_controller";

const util = require('util');
const logger = require('pino')({});
const controllerPath = '/app/controllers';

class ControllerFactory {
  static async buildControllers(controllers: {[key: string]: BaseController}) {
    let dir = process.cwd() + controllerPath;
    let controllerClasses = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);
    console.log(controllerClasses);
    for(let i = 0; i < controllerClasses.length; i++) {
      let filePath = 'file:///' + dir + '/' + controllerClasses[i];
      let definition = await import(filePath);
      let controller = new definition.default.default();
      console.log(controller);
      controllers[controllerClasses[i]] = controller;
      /*definitions.forEach((controller: any) => {
        controllers[controller.default.name] = new controller();
      });*/
    }
    logger.info('loaded ' + Object.keys(controllers).length + ' controllers from src/app/controllers');

  }
}

export default ControllerFactory;
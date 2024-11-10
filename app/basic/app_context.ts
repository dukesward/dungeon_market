import JSONFileLoader from "./json_file_loader";
import DataWarehouse from "./data_warehouse";
import Route from "./route";
import BaseController from "./base_controller";
import ControllerFactory from "./controller_factory";

const logger = require('pino');

class ApplicationContext {
  private _loader: JSONFileLoader;
  private _props: {[key: string]: any};
  private _properties: {[key: string]: any} = {};
  private _projectId?: string;
  private _projectInfo: {[key: string]: any} = {};
	private _controllers: {[key: string]: BaseController} = {}
	constructor() {
		this._props = {};
		this._loader = new JSONFileLoader();
		ControllerFactory.buildControllers(this._controllers);
		this.loadGlobalProperties();
	}
	findRecursive(props: {[key: string]: any}, key: string): any {
		let tokens = key.split('.');
		if (tokens.length > 0) {
			let index: string | undefined = tokens.shift();
      if(index) {
        let prop = props[index];
        while (!prop && tokens.length > 0) {
          index += ('.' + tokens.shift());
          prop = props[index];
        }
        if (prop && tokens.length > 0) {
          props = this.findRecursive(prop, tokens.join('.'));
        } else {
          props = prop;
        }
      }
		}
		return props;
	}
	loadGlobalProperties() {
		this._properties = this._loader.loadJsonFile('global.json');
	}
	getGlobalProperty(key: string): any {
		return this.findRecursive(this._properties, key);
	}
	getCustomProperty(scope: string, key: string) {
		if (scope === 'project') {
			return this._projectInfo[key];
		} else {
			// if custom prop config is available, require for the config
			let moduleLocation = this._properties.modules.location;
			let customConfig = this._loader.loadJsonFile(moduleLocation + '/' + scope + '.json');
			if (customConfig) {
				return key ? customConfig[key] : customConfig;
			}
		}
	}
	loadProjectProperties(projectId: string) {
		if (!this._projectInfo) {
			this._projectId = projectId;
			this._projectInfo = {};
		}
		this.addProjectInfo();
	}
	/**
	 * Add project information.
	 * This function adds the information of a project to the existing project information.
	 * If the project information includes other projects, it will recursively add the information of those projects as well.
	 *
	 * @param projectId - The ID of the project to add.
	 */
	addProjectInfo(projectId: string = '') {
		let moduleLocation = this._properties.modules.location + '/' + projectId;
		let projectInfo = this._loader.loadJsonFile(moduleLocation + 'project.json');
		this._projectInfo = {...this._projectInfo, ...projectInfo};
		if(projectInfo.includes) {
			this.addProjectInfo(projectInfo.includes);
		}
	}
	getController() {
		let controller = this.getProp('controller');
		if (!controller) {
			let route = this.getProp('route');
			if (route) {
				let scopeId = this._projectInfo.base_scope;
				let controllerId = route.controller;
				this.setProp('controllerId', controllerId);
				let controllerName = this._projectInfo.controllers[controllerId] || this._projectInfo.controllers['default'];
				if (controllerName) {
					controller = this.doGetController(controllerName, scopeId);
				}
			}
		}
		return controller;
	}
  doGetController(controllerName: string, scopeId: string) {

  }
	getProp(propId: string) {
		return this._props[propId];
	}
	setProp(key: string, val: any) {
		if(key === 'database') {
			console.log('set prop: db');
		}
		this._props[key] = val;
	}
	async initDataWarehouse(controller: string) {
		let uri = this.getGlobalProperty('settings.mongodb.uri');
		let dbName = this.getGlobalProperty('settings.mongodb.database');
		console.log(uri);
    if(uri && typeof uri === 'string') {
      let db = new DataWarehouse(uri);
      await db.connect(dbName);
      this.setProp('database', db);
      this.getController().onAction();
    }else {
      throw new Error("database uri is not found");
    }
	}
}

export default ApplicationContext;
import { Request, Response } from "express";
import ApplicationContext from "../basic/app_context";
import Route from "../basic/route";
import RequestProperties from "../basic/request_props";

const logger = require('pino')({});

class Dispatcher {
  private _applicationContext: ApplicationContext;
  constructor() {
    this._applicationContext = new ApplicationContext();
  }
  dispatch(req: Request, res: Response) {
    let requestProps = new RequestProperties();
    let route = new Route(req, res, requestProps);
    try {
      logger.info(route.controller);
      if(route.controller) {
        this._applicationContext.initDataWarehouse(route.controller);
      }
      res.send(404);
    } catch (e) {
      console.log(e);
      // redirect to error page
      res.send(500);
    }
  }
}

export default Dispatcher;
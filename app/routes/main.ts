import express, { Request, Response } from "express";
import Dispatcher from "./dispatcher";

const router = express.Router();
const dispatcher = new Dispatcher();

router.get('/', (req: Request, res: Response, next) => {
  // res.send('respond with a resource');
  if(req.url === '/stop') {
    console.log("Exiting NodeJS server");
    //process.exit();
  }else {
    // ApplicationContext.getInstance(new Route(req, res), req).getController().onAction();
    dispatcher.dispatch(req, res);
  }
});

router.post('/', function(req: Request, res: Response, next) {
  // res.send('respond with a resource');
  if(req.url === '/stop') {
    console.log("Exiting NodeJS server");
    //process.exit();
  }else {
    // ApplicationContext.getInstance(new Route(req, res), req).getController().onAction();
    dispatcher.dispatch(req, res);
  }
});

module.exports = router;
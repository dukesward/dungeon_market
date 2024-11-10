import BaseController from "../basic/base_controller";

class HomePageController extends BaseController {
  constructor() {
    super();
  }

  index(req: any, res: any) {
    res.send("Hello World");
  }
}

export default HomePageController;
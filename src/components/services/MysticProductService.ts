import { MysticProduct } from "@/src/apps/mystic/types";
import { AppHttpServiceConsumer } from "../AppService";
import { Subscription } from "rxjs";

class MysticProductService extends AppHttpServiceConsumer<MysticProduct> {
  constructor() {
    super();
  }
  mapObject(data: any): MysticProduct {
    throw new Error("Method not implemented.");
  }
  fetch(
    params: any,
    err_handler?: any,
    callback?: ((t: MysticProduct) => void) | undefined
  ): Subscription {
    throw new Error("Method not implemented.");
  }
}

export default MysticProductService;
import { SimpleMap } from "@/src/layouts/types";
import { AppHttpServiceConsumer } from "../AppService";

class ConstantService extends AppHttpServiceConsumer<SimpleMap<string>> {
  constructor() {
    super();
    this.services = {
      'error_code_constants': 'static/constants/{app_locale_id}/errorCodes.json'
    }
  }

  mapObject(data: any): SimpleMap<string> {
    let map: SimpleMap<string> = {};
    Object.keys(data).forEach(key => {
      map[key] = '' + data[key];
    });
    return map;
  }

  validate(data: any): boolean {
    return Object.keys(data).length > 0;
  }

}

export default ConstantService;
import { Observable, Subscription, map, of } from "rxjs";
import { ApiDelegatorConfig, AppLayout } from "../../layouts/types";
import { AppHttpServiceConsumer, HttpMethod } from "../AppService";
import { appContext } from "../../../src/AppContext";


class PageLayoutService extends AppHttpServiceConsumer<AppLayout> {
  layouts_api: string;
  constructor() {
    super();
    this.layouts_api = appContext.envVar("API_LAYOUT_CONFIGS");
    this.services = {
      'page_layout': 'static/layouts/{layout_id}.json'
    }
  }

  mapObject(data: any): AppLayout {
    let appLayout: AppLayout = new AppLayout(data);
    return appLayout;
  };

  validate(data: any): boolean {
    return data && data.page_name;
  }
}


export default PageLayoutService;
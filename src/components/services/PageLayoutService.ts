import { ApiDelegatorConfig, AppLayout } from "../../layouts/types";
import { AppHttpServiceConsumer, HttpMethod } from "../AppService";


class PageLayoutService extends AppHttpServiceConsumer<AppLayout> {
  constructor() {
    super();
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
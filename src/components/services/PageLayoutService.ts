import { AppLayout } from "../../layouts/types";
import { HttpMethod } from "../AppService";

export const pageLayoutServiceProvider = (function () {
  return {
    'page_layout': {
      uri: 'static/layouts/{layout_id}.json',
      method: HttpMethod.GET,
      mapper: (data: any) => {
        let appLayout: AppLayout = new AppLayout(data);
        return appLayout;
      },
      validate: (data: any) => {
        return data && data.page_name;
      },
    }
  };
})();
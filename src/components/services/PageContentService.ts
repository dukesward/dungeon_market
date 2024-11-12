import { AppContent } from "../../layouts/types";
import { AppHttpServiceConsumer, HttpMethod } from "../AppService";
import { Observable, Subscription } from "rxjs";

class PageContentService extends AppHttpServiceConsumer<AppContent> {
  constructor() {
    super();
    this.services = {
      'page_content': '/content/{page_name}'
    }
  }
  mapObject(data: any): AppContent {
    let appContent: AppContent = new AppContent(data.contents);
    return appContent;
  }

  /*fetch(
    page_name: string,
    err_handler?: (err: any) => any,
    callback?: (content: AppContent) => void,
  ): Subscription {
    return super.doFetch(
      `/content/${page_name}`,
      HttpMethod.GET
    ).subscribe({
      next: (data: AppContent | null) => {
        if(this.validate(data)) {
          callback && callback(this.mapObject(data));
        }
      },
      error: error => {
        // page error details to be populated here
        console.log(error);
        return err_handler && err_handler(error);
      }
    });
  }

  nextFetch(page_name: string): Observable<AppContent | null> {
    return super.nextFetch(page_name, `/content/${page_name}`);
  }*/
}

export default PageContentService;
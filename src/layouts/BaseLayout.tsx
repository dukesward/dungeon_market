import { AppContent, AppFeature, AppLayout, AppWidget } from "./types";
import { BaseWidget } from "../widgets/BaseWidget";
import { resolveFeature, resolveWidget } from "./widgets";
import { Observable } from "rxjs";

class BaseLayout extends BaseWidget {
  layout?: AppLayout
  features?: AppFeature[] | undefined
  constructor(props: any) {
    super(props);
  }
  wrappedWidget(type: string, supplier_type: string): JSX.Element {
    let _widget: AppWidget | null | undefined = this.layout?.find(type);
    let element: JSX.Element = <></>;
    if(_widget) {
      let service: Observable<AppContent | null>;
      /*if(this.layout?.page_name) {
        service = this.content_service
        .nextFetch(this.layout?.page_name);
      }*/
      let Widget: typeof BaseWidget | null = resolveWidget(type, _widget);
      // if features config exist, apply features to the target widget
      if(this.features) {
        this.features
          .filter(f => _widget?.widget_id === f.apply_to)
          .forEach(f => {
            let supplier: ((Layout: typeof BaseWidget, config: any)
            => typeof BaseWidget) | null = resolveFeature(supplier_type);
            if(supplier && Widget) {
              Widget = supplier(Widget, f);
            }
          }
        );
      }
      element = Widget ? <Widget pageName={this.layout?.page_name}/> : element;
    }
    return element;
  }
  /*loadPageContents(callback: (content: AppContent) => void) {
    if(this.layout) {
      this.content_service.nextFetch(this.layout.page_name)
      .subscribe({
        next: c => {
          if(c) callback(c);
        },
        error: e => {
          console.log(e);
        }
      })
    }
  }*/
}

export default BaseLayout;
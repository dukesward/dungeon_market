import { AppWidget } from "../layouts/types";
import { BaseWidget } from "./BaseWidget";

const blockFactory = (_widget: AppWidget | null | undefined): typeof BaseWidget => {
  class TextBlockWidget extends BaseWidget {
    type: string = "text";
    doConfigure(): void {
      if(_widget) {
        this.widget = _widget;
        console.log(this.widget);
        this.subtype = _widget.subtype;
      }
    }
    doRender(): JSX.Element {
      let dom: JSX.Element = (
        <div className={`${this.type}-${this.subtype}`}>this is a block</div>
      )
      return dom;
    }
  }
  return TextBlockWidget;
}

export default blockFactory;
import { AppWidget } from "../layouts/types";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

const errorMessageFactory = (_widget: AppWidget) => {
  class ErrorMessage extends BaseWidget {
    type: string = "error_message";
    constructor(props: BaseWidgetProps) {
      super(props);
      this.widget = _widget;
      this.subtype = _widget.subtype;
    }
    doConfigure(): void {
      console.log('errorWidget is ready');
    }
    doRender(): JSX.Element {
      console.log(this.prop('error'));
      let dom: JSX.Element = (
        <div>
          <p>{this.prop('error')?.message}</p>
        </div>
      );
      return dom;
    }
  }
  class SimpleErrorMessage extends ErrorMessage {
    doRender(): JSX.Element {
      let dom: JSX.Element = (
        super.doRender()
      );
      return dom;
    }
  }
  let Widget: typeof BaseWidget | undefined = ({
    "simple": SimpleErrorMessage
  })[_widget.subtype || "printer"];
  return Widget || BaseWidget;
}

export {
  errorMessageFactory
}
import { AppWidget, ErrorHandler, ErrorMessageWrapper } from "../layouts/types";
import { resolveWidget } from "../layouts/widgets";
import { BaseWidget } from "./BaseWidget";

class ErrorMessagePrinter implements ErrorHandler {
  messages: JSX.Element[];
  constructor() {
    this.messages = [];
  }
  handle(error: ErrorMessageWrapper): void {
    let type = error.type || 'simple';
    let Widget: typeof BaseWidget | null = resolveWidget('error', new AppWidget({
      type: 'error',
      subtype: type,
      widget_id: 'error_popup_message',
      children: []
    }));
    if(Widget !== null) {
      this.messages.push(<Widget/>);
    }
  }
  renderPopupList(): JSX.Element {
    return (
      <div>
        {
          this.messages.map((msg, idx) => {
            return <div key={idx}>{msg}</div>;
          })
        }
      </div>
    );
  }
}

export default ErrorMessagePrinter;
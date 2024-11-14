import { AppWidget, ErrorMessageWrapper } from "../layouts/types";
import { resolveWidget } from "../layouts/widgets";
import { BaseWidget } from "./BaseWidget";

abstract class ErrorHandler extends BaseWidget {
  abstract handle(error: ErrorMessageWrapper): void;
}

class ErrorMessagePrinter extends ErrorHandler {
  constructor(props: any) {
    super(props);
    this.appContext().hookState('error_message', (e: any) => {
      this.handle(new ErrorMessageWrapper(e));
    });
  }
  componentDidMount(): void {
    console.log('error message printer is ready');
    this.setCustomState('messages', []);
  }
  handle(error: ErrorMessageWrapper): void {
    let type = error.type || 'simple';
    let Widget: typeof BaseWidget | null = resolveWidget('error', new AppWidget({
      type: 'error',
      subtype: type,
      widget_id: 'error_popup_message',
      children: [],
      props: {
        error: error
      }
    }));
    if(Widget !== null) {
      let messages: JSX.Element[] = this.state.customStates?.messages;
      if(messages) {
        messages.push(<Widget/>);
        this.setCustomState('messages', messages);
      }
    }
  }
  doRender(): JSX.Element {
    return (
      <div>
        {this.renderPopupList()}
      </div>
    );
  }
  renderPopupList(): JSX.Element {
    let messages: JSX.Element[] = this.getCustomState('messages') || [];
    return (
      <div className="error-popup-list">
        {
          messages.length > 0 && messages.map((msg, idx) => {
            return <div key={idx}>{msg}</div>;
          })
        }
      </div>
    );
  }
}

export {
  ErrorHandler,
  ErrorMessagePrinter
}
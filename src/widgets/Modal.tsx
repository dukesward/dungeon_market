import { AppWidget } from "../layouts/types";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";
import "./styles/common.css";

const modalWidgetFactory = (_widget: AppWidget): typeof BaseWidget => {
  class BaseModalWidget extends BaseWidget {
    type: string = "modal";
    constructor(props: BaseWidgetProps) {
      super(props);
      this.children = _widget.children || [];
      this.subtype = _widget.subtype;
    }
    doConfigure(): void {
      console.log('modalWidget is ready');
    }
    doRender(): JSX.Element {
      console.log(_widget);
      let dom: JSX.Element = (
        <div className={`modal-wrapper ${_widget?.prop('modal-inner-type')}-modal-wrapper`}>
          <div className="modal-dialog">
            <div className="modal-default">
              <div className="modal-body">
                <div className="modal-close-wrapper">
                  <button className="modal-close-btn" onClick={this.triggerEvent('close-modal')}>
                    <div className="modal-close-icon">
                      <img src={`./icons/close_btn_01.svg`}></img>
                    </div>
                  </button>
                </div>
                {this.renderChildWidget(`${_widget?.widget_id}-inner`)}
              </div>
            </div>
          </div>
        </div>
      )
      return dom;
    }
  }
  let Widget: typeof BaseWidget | undefined = ({
    "basic": BaseModalWidget,
  })[_widget.subtype || "basic"];
  return Widget || BaseModalWidget;
}

export default modalWidgetFactory;
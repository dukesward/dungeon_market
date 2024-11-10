import { AppWidget } from "../layouts/types";
import { BaseWidget, BaseWidgetProps }  from "./BaseWidget";
import "./styles/banner.css";
import "./styles/common.css";

const bannerFactory = (_widget: AppWidget): typeof BaseWidget => {
  class BasicBannerWidget extends BaseWidget {
    type: string = "banner";
    constructor(props: BaseWidgetProps) {
      super(props);
      this.children = _widget.children || [];
      this.subtype = _widget.subtype;
    }
    doRender(): JSX.Element {
      console.log('basic banner');
      let dom: JSX.Element = (
        <div className={`banner-${this.subtype}`}></div>
      )
      return dom;
    }
  }
  class HeaderBannerWidget extends BasicBannerWidget {
    logo?: JSX.Element;
    renderHeaderLogo(): JSX.Element | null {
      if(this.children) {
        let child = this.findChild(c => c.type === "logo");
        if(child && this.subtypeIs("header-banner"))
          return (
            <div className="header-logo-wrapper">
              <a className="header-banner-logo normal-size-logo simple-link" href="/">
                <img src={`./icons/${child.parsedProp('logo_src')}.svg`}></img>
              </a>
            </div>
          );
      }
      return null;
    }
    doRender(): JSX.Element {
      console.log('header banner');
      let dom: JSX.Element = (
        <div className={`banner-${this.subtype}`}>
          {this.renderHeaderLogo()}
          {this.renderChildWidget('header-authbox')}
        </div>
      )
      return dom;
    }
  }
  let Widget: typeof BaseWidget | undefined = ({
    "basic": BasicBannerWidget,
    "header-banner": HeaderBannerWidget
  })[_widget.subtype || "basic"];
  return Widget || BasicBannerWidget;
}

export default bannerFactory;
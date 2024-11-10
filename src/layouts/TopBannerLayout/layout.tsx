import BaseLayout from "../BaseLayout";
import { AppLayout } from "../types";

const topBannerLayout = (widgets: AppLayout) => {
  class TopBannerLayout extends BaseLayout {
    layout?: AppLayout = widgets;
    doConfigure() {
      console.log('topBannerLayout is ready');
    }
    doRender(): JSX.Element {
      let dom: JSX.Element = (
        <div className="layout-container">
          <header className="header-layout-wrapper">
            {this.wrappedWidget("banner", "header")}
          </header>
          <div className="layout-body-container">
            {this.wrappedWidget("menu", "sidebar")}
            {this.wrappedWidget("article", "canvas")}
          </div>
        </div>
      )
      return dom;
    }
  }
  return TopBannerLayout;
}

export default topBannerLayout;
import BaseLayout from "../BaseLayout";
import { AppFeature, AppLayout } from "../types";

const dashboardLayout = (widgets: AppLayout): typeof BaseLayout => {
  class DashboardLayout extends BaseLayout {
    layout?: AppLayout = widgets;
    features?: AppFeature[] | undefined = widgets.layout_config?.features;
    doConfigure() {
      console.log('dashboardLayout is ready');
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
  return DashboardLayout;
}


export default dashboardLayout;
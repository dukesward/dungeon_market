import BaseLayout from "../BaseLayout";
import dashboardLayout from "../DashboardLayout/layout";
import { AppLayout } from "../types";

const errorPageLayout = (widgets: AppLayout) => {
  class ErrorPageLayout extends BaseLayout {

    doRender(): JSX.Element {
      let Layout: typeof BaseLayout = dashboardLayout(widgets);
      return <Layout/>;
    }
  }
  return ErrorPageLayout;
}


export default errorPageLayout;
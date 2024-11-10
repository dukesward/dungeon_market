import BaseLayout from "./BaseLayout";
import dashboardLayout from "./DashboardLayout/layout";
import topBannerLayout from "./TopBannerLayout/layout";
import errorPageLayout from "./ErrorPageLayout/layout";
import applyAppTheme from "./themes/Theme";
import { AppLayout, LayoutWrapperMap } from "./types";

// a centralized type for layout wrapper fn registration
const Layouts: LayoutWrapperMap = {
  'Dashboard': dashboardLayout,
  'TopBanner': topBannerLayout,
  'ErrorLayout': errorPageLayout
}

function resolveLayout(appLayout: AppLayout): typeof BaseLayout | string {
  let layout: string = appLayout.layout;
  if (typeof Layouts[layout] !== "undefined") {
    if(!Layouts[layout]) {}
    let factory: (widgets: AppLayout) => typeof BaseLayout = Layouts[layout];
    return applyAppTheme(factory(appLayout), appLayout.theme);
  }else {
    // must add error handlings here
    return '';
  }
}

export {
  resolveLayout
};
export type { LayoutWrapperMap };

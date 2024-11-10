import { AppFeature } from "../../layouts/types";
import { BaseWidget } from "../../widgets/BaseWidget";

const applyHeaderFeatures = (
  Widget: typeof BaseWidget, config: AppFeature): typeof BaseWidget => {
  //let apply_to: string = config?.apply_to;
  let feature: string = config.feature;
  let props = config && config.props;
  class HeaderLogoWrapper extends BaseWidget {
    type: string = "header-logo"
    doRender(): JSX.Element {
      let headerLogo: {[prop: string]: JSX.Element} = {
        "logo": (
          <a href="/" className="header-logo-default header-nav-home">
            <img alt="header-logo" src={`/icons/${props.logo_img_src}`}/>
          </a>
        )
      }
      return <Widget {...this.mergeProps(headerLogo)}/>;
    }
  }
  // if no feature type matching, return the original layout obj
  return ({
    "header_logo": HeaderLogoWrapper
  })[feature] || Widget;
}

export default applyHeaderFeatures;
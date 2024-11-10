import applyHeaderFeatures from "../apps/features/header";
import authWidgetFactory from "../widgets/Auth";
import bannerFactory from "../widgets/Banner"
import { BaseWidget } from "../widgets/BaseWidget";
import menuFactory from "../widgets/Menu";
import modalWidgetFactory from "../widgets/Modal";
import { AppWidget, FeatureWrapperMap, WidgetWrapperMap } from "./types"

const WidgetSupplier: WidgetWrapperMap = {
  "banner": bannerFactory,
  "menu": menuFactory,
  "auth": authWidgetFactory,
  "modal": modalWidgetFactory
}

const FeatureSupplier: FeatureWrapperMap = {
  "header": applyHeaderFeatures
}

function resolveWidget(
  type: string, widget: AppWidget | null | undefined): typeof BaseWidget | null {
  if(type in WidgetSupplier && widget) {
    let supplier: (model: AppWidget) => typeof BaseWidget = WidgetSupplier[type];
    return supplier(widget);
  }
  return null;
}

function resolveFeature(type: string): 
  ((Layout: typeof BaseWidget, config: any) => typeof BaseWidget) | null {
  if(type in FeatureSupplier) {
    return FeatureSupplier[type];
  }
  return null;
}

export {
  resolveWidget,
  resolveFeature
};
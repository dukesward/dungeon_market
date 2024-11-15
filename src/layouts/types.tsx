import BaseLayout from "./BaseLayout";
import AppModel from "../components/AppModel";
import { BaseWidget } from "../widgets/BaseWidget";
import stringUtils from "../utils/stringUtils";
import { appContext } from "../AppContext";
import commonUtils from "../utils/commonUtils";
import { AppHttpServiceConsumer, HttpMethod } from "../components/AppService";
import { Observable } from "rxjs";

type LayoutMap = {
  [layout: string]: typeof BaseLayout
}

type LayoutWrapperMap = {
  [layout: string]: (model: AppLayout) => typeof BaseLayout
};

type WidgetMap = {
  [widget: string]: typeof BaseWidget
}

type WidgetWrapperMap = {
  [widget: string]: (model: AppWidget) => typeof BaseWidget
};

type FeatureWrapperMap = {
  [feature: string]: (Layout: typeof BaseWidget, config: any) => typeof BaseWidget
}

type UserPassAuthForm = {
  emal: string,
  password: string
}

type ApiDelegatorConfig = {
  method: HttpMethod,
  uri: string,
  params: any,
  payload: any,
  headers: any
}

type SimpleMap<T> = {
  [key: string]: T
}

class ApiDelegatorConfigurer {
  method: HttpMethod
  serviceId: string
  service: AppHttpServiceConsumer<any>
  params?: any = {}
  payload?: any = {}
  headers?: any = {}
  constructor(config: any) {
    this.method = config.method;
    this.serviceId = config.serviceId;
    this.service = config.service;
    if(config.params) this.params = config.params;
    if(config.payload) this.payload = config.payload;
    if(config.headers) this.headers = config.headers;
  }
  invoke(params?: any): Observable<any> {
    let uri = this.service.getServiceUri(this.serviceId);
    if(params) {
      uri = stringUtils.parseString(uri, params);
      Object.keys(this.params).forEach(key => {
        if(params[key]) {
          this.params[key] = stringUtils.parseString(this.params[key], params);
        };
      });
      Object.keys(this.payload).forEach(key => {
        if(typeof params[key] !== 'undefined') {
          this.payload[key] = params[key];
        };
      });
      Object.keys(this.headers).forEach(key => {
        if(typeof params[key] !== 'undefined') {
          this.headers[key] = params[key];
        };
      });
    }
    return this.service.doFetch({
      method: this.method,
      uri: uri,
      params: this.params,
      payload: this.payload,
      headers: this.headers
    });
  }
}

class AppWidgetListItem implements AppModel {
  item_id: string
  next_item: string
  parent: string
  constructor(widget: any) {
    this.item_id = widget.item_id;
    this.next_item = widget.next_item;
    this.parent = widget.parent;
  }
}

class AppWidget implements AppModel {
  type: string = 'blank'
  widget_id: string
  subtype?: string
  children?: AppWidget[]
  items?: AppWidgetListItem[]
  props: any = {}
  constructor(widget: any) {
    this.children = [];
    this.items = [];
    this.type = widget.type;
    this.subtype = widget.subtype;
    this.widget_id = widget.widget_id;
    this.props = widget.props;
    if(widget.children) {
      for(let c of widget.children) {
        this.children.push(new AppWidget(c));
      }
    }
    if(widget.items) {
      for(let i of widget.items) {
        this.items.push(new AppWidgetListItem(i));
      }
    }
  }
  prop(key: string): string {
    return commonUtils.getPropByKey(key, this.props);
  }
  parsedProp(key: string): string {
    return stringUtils.parseString(this.prop(key), appContext.envConfigs());
  }
}

class AppFeature implements AppModel {
  feature: string
  apply_to?: string
  props?: any
  constructor(config: any) {
    this.feature = config.feature;
    this.apply_to = config.apply_to;
    this.props = config.props;
  }
}

class AppLayoutConfig implements AppModel {
  components: AppWidget[] = []
  features: AppFeature[] = []
  constructor(config: any) {
    if(config.components) {
      let _components: [any] = config.components;
      _components.forEach(
        c => this.components.push(new AppWidget(c))
      );
    };
    if(config.features) {
      let _features: [any] = config.features;
      _features.forEach(
        f => this.features.push(new AppFeature(f))
      );
    };
  }
  find(type: string, subtype?: string): AppWidget | null {
    for(let c of this.components) {
      if(c.type !== type) {
        continue;
      }
      if(!subtype || subtype === c.subtype) {
        return c;
      }
    }
    return null;
  }
}

class AppLayout implements AppModel {
  page_name: string
  layout: string
  theme: string
  content_api: string
  layout_config?: AppLayoutConfig
  constructor(data: any) {
    this.page_name = data['page_name'];
    this.layout = data['layout'];
    this.theme = data['theme'];
    this.content_api = data['content'];
    if('layouts' in data) {
      this.layout_config = new AppLayoutConfig({...data['layouts']});
    }else {
      // complains that layouts do not exist
    }
  }
  find(type: string, subtype?: string): AppWidget | null {
    return this.layout_config ? this.layout_config.find(type, subtype) : null;
  }
}

class AppContent implements AppModel {
  content_id: string
  contents: AppContent[] = []
  label?: string
  link?: string
  custom: any
  constructor(data: any) {
    this.content_id = data.content_id;
    this.contents = data.contents;
    if(data.label) this.label = data.label;
    if(data.link) this.label = data.link;
    if(data.custom) this.custom = data.custom;
  }
}

class UserPassLogin implements AppModel {
  email: string
  password: string
  constructor(data: any) {
    this.email = data.email;
    this.password = data.password;
  }
}

class AuthTokenEntity implements AppModel {
  access_token: string
  refresh_token: string
  expires_in: number
  user_id: number
  constructor(data: any) {
    this.user_id = data.userId;
    this.access_token = data.accessToken;
    this.refresh_token = data.refreshToken;
    this.expires_in = data.expiresTime;
  }
}

class TenantIdResponse implements AppModel {
  code: number
  data: number
  msg: string
  constructor(_data: any) {
    this.code = _data.code;
    this.data = _data.data;
    this.msg = _data.msg;
  }
}

class ErrorMessageWrapper implements AppModel {
  type: string
  errorCode: string
  message?: string | null
  function: string
  constructor(data: ServiceCallError) {
    console.log(data);
    this.type = data.get('type');
    this.errorCode = data.get('code');
    this.message = appContext.getConstant('error_code', this.errorCode) || null;
    this.function = data.name;
  }
}

class ServiceCallError extends Error {
  name: string
  original: any
  errorCode: string = '500'
  type: string = 'simple'
  constructor(message: string, public data?: any) {
    super(message);
    this.name = 'service_call';
    this.original = data;
  }
  get(key: string) {
    return this.original[key] || null;
  }
}


export {
  AppLayout,
  AppLayoutConfig,
  AppWidget,
  AppWidgetListItem,
  AppFeature,
  AppContent,
  UserPassLogin,
  AuthTokenEntity,
  TenantIdResponse,
  ApiDelegatorConfigurer,
  ErrorMessageWrapper,
  ServiceCallError
};

export type {
  SimpleMap,
  LayoutMap,
  LayoutWrapperMap,
  WidgetMap,
  WidgetWrapperMap,
  FeatureWrapperMap,
  UserPassAuthForm,
  ApiDelegatorConfig
};

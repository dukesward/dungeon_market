import axios from "axios";
import { Observable, Subscription, defer, map, share } from "rxjs";
import { appContext } from "../AppContext";
import { ApiDelegatorConfig } from "../layouts/types";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

type HttpRequest<T> = {
  url?: string
  data?: Observable<T>
  error?: any
}

abstract class AppHttpServiceConsumer<T> {
  api_base: string
  api_app?: string
  last_call: HttpRequest<T>
  next_fetch: {[page_name: string]: Observable<T | null>}
  services: {[service_id: string]: string} = {}
  constructor() {
    this.api_base = appContext.envVar('APP_SERVER_API_BASE');
    this.last_call = {}
    this.next_fetch = {};
  }

  abstract mapObject(data: any): T;

  validate(data: any): boolean {
    return data && data.contents && Object.keys(data.contents).length > 0;
  }

  getServiceUri(api: string): string {
    return this.services[api] || '';
  }
  // abstract fetch(apiConfig: ApiDelegatorConfig, callback?: (t: T) => void): Observable<T | null>;

  buildUrl(uri: string, params?: any): string {
    let api_app = this.api_app || '';
    let url = `${this.api_base}${api_app}${uri}`;
    if(params && Object.keys(params).length > 0) {
      url += '?';
      Object.keys(params).forEach(key => {
        url += (key + '=' + this.findParam(key, params) + '&');
      });
    }
    return url;
  }

  findParam(key: string, params?: any) {
    if(params && params[key]) {
      return params[key];
    } else {
      return appContext.envVar(key);
    }
  }
  
  doFetch(
    apiConfig: ApiDelegatorConfig,
    callback?: (t: T) => any): Observable<T | null> {
    let {uri, method, params, payload} = apiConfig;
    return defer(() => axios({
      'url': this.buildUrl(uri, params),
      'method': method.toString(),
      'headers': {
        "Content-Type": "application/json",
      },
      'data': payload
    })).pipe(
      map(res => res.data),
      map(data => {
        if(!this.validate(data)) {
          // this.last_call.error = new Error("data_invalid");
          throw this.last_call.error || new Error("data_invalid");
        }
        return this.mapObject(data);
      }),
      map(data => {
        if(callback) {
          return callback(data);
        }
        return data;
      })
    );
  };

  nextFetch(id: string, apiConfig: ApiDelegatorConfig): Observable<T | null> {
    if(!this.next_fetch[id]) {
      this.next_fetch[id] = this
      .doFetch(apiConfig)
      .pipe(
        map(data => {
          console.log(data);
          return data;
        }),
        share()
      );
    }
    return this.next_fetch[id];
  }
}

export {
  AppHttpServiceConsumer,
  HttpMethod
};
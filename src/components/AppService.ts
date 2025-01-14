import axios from "axios";
import { Observable, defer, map, share } from "rxjs";
import { appContext } from "../AppContext";
import { ApiDelegatorConfig, ServiceCallError, UnaryMapper } from "../layouts/types";
import AppModel from "./AppModel";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

type HttpResError = {
  code: number
  message: string
}

type HttpRequest<T, P> = {
  api?: string
  uri: string
  data?: Observable<T>
  method: HttpMethod
  payload?: P
  headers?: {[key: string]: string}
  params?: any
  validate: UnaryMapper<T>
  error?: HttpResError
  callback?: (data: T) => any
  mapper: (data: any) => T
}

class AppHttpServiceConsumer {
  api_base: string
  api_app?: string
  last_call: HttpRequest<any, any> | null
  next_fetch?: {[page_name: string]: Observable<any | null>}
  services: {[service_id: string]: string} = {}
  constructor() {
    this.api_base = appContext.envVar('APP_SERVER_API_BASE');
    this.last_call = null;
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

  customParams(params: any) {
    return params;
  }

  customHeaders(params: any) {
    return {};
  }
  
  doFetch<T extends AppModel, P>(
    request: HttpRequest<T, P>): Observable<T | null> {
    // let {uri, method, params, payload, headers} = apiConfig;
    let params = this.customParams(request.params);
    return defer(() => axios({
      'url': this.buildUrl(request.uri, params),
      'method': request.method.toString(),
      'headers': {...this.customHeaders(request.headers), ...{
        "Content-Type": "application/json"
      }},
      'data': request.payload
    })).pipe(
      map(res => res.data),
      map(data => {
        if(!request.validate(data)) {
          // this.last_call.error = new Error("data_invalid");
          throw (this.last_call && this.last_call.error) 
            || new ServiceCallError("data_invalid", data);
        }
        return request.mapper(data);
      }),
      map(data => {
        if(request.callback) {
          return request.callback(data);
        }
        return data;
      })
    );
  };

  nextFetch<T extends AppModel, P>(id: string, request: HttpRequest<T, P>): 
    Observable<T | null> {
    if(this.next_fetch && !this.next_fetch[id]) {
      this.next_fetch[id] = this
      .doFetch(request)
      .pipe(
        map(data => {
          console.log(data);
          return data;
        }),
        share()
      );
    }
    return defer(() => {
      return this.next_fetch![id];
    });
  }
}

export type {
  HttpRequest
};

export {
  AppHttpServiceConsumer,
  HttpMethod
};
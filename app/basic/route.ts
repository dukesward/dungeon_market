import { Request, Response } from "express";
import RequestProperties from "./request_props";
import { HttpError } from "http-errors";

class Route {
  private _request: Request;
  private _response: Response;
  private _props: RequestProperties;
  private _params: {[key: string]: string};
  private _controller?: string;
  private _routeName?: string;
  private _flowId?: string;
  private _actionId?: string;
  constructor(req: Request, res: Response, props: RequestProperties, next?: any) {
    this._request = req;
    this._response = res;
    this._props = props;
    this._params = {};
    this.parseUrl(req.originalUrl);
  }
  allowAccess(url: string) {
    this._response.setHeader('Access-Control-Allow-Origin', url);
  }
  parseUrl (url: string) {
    try {
      var invalidUrlMsg = 'url [' + url + '] is not valid';
      if(url) {
        if(url[0] === '/') {
          url = url.substr(1);
        }
        if(url.indexOf('?') > 0) {
          let urlWithParams = url.split('?');
          url = urlWithParams[0];
          this.parseParams(urlWithParams[1]);
        }
        var tokens = url.split('/');
        this._controller = tokens[0];
        this._routeName = tokens[1];
        this._flowId = tokens[2];
        this._actionId = tokens.length > 3 ? tokens[3] : 'get';
      }else {
        // handler error 404
      }
    }catch (err) {
      console.error('[Route] Error parsing req url: ' + err);
      // handle erro 500
    }
  }
  parseParams(paramList: string) {
    let params = paramList.split('&');
    let self = this;
    params.forEach(p => {
      let pair = p.split('=');
      self._params[pair[0]] = pair[1];
    });
  }
  getParam(key: string) {
    return this._params[key] || null;
  }
  get request() {
    return this._request;
  }
  get response() {
    return this._response;
  }
  get controller() {
    return this._controller;
  }
  get routeName() {
    return this._routeName;
  }
  get flowId() {
    return this._flowId;
  }
  get actionId() {
    return this._actionId;
  }
}

export default Route;
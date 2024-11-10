import { AppWidget } from "../layouts/types";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";
import "./styles/common.css";
import "./styles/auth.css";
import apiServiceDelegator from "../components/ApiServiceDelegator";
import { SyntheticEvent } from "react";


const authWidgetFactory = (_widget: AppWidget): typeof BaseWidget => {
  class UserPassAuthForm extends BaseWidget {
    widget: AppWidget = _widget;
    type: string = _widget.type;
    subtype: string = _widget.subtype || "basic";
    constructor(props: BaseWidgetProps) {
      super(props);
      if(props.widget)
        this.widget = props.widget;
    }
    componentDidMount() {
      console.log('userPassAuthForm is mounted');
      this.setState({
        formData: {
          "email": "",
          "password": ""
        }
      })
    }
    doRender(): JSX.Element {
      let userInputName = this.widget.prop("use_email") ? "email": "username";
      let dom: JSX.Element = (
        <div className="auth-modal-inner">
          <div className="auth-form-user-pass auth-form-wrapper">
            { this.widget.prop("auth_form_header") &&
            <div className="auth-form-header">
              <div className="auth-form-header-title">
                <h1>{this.widget.prop('title')}</h1>
              </div>
            </div>
            }
            <form onSubmit={this.handleFormSubmit.bind(this)} className="auth-form-body form-body">
              <div className="auth-form-input-label form-label">
                <label>{this.widget.prop('inputs->' + userInputName + '->copy')}</label>
              </div>
              <div className="auth-form-input-body form-input">
                <input type="text"
                placeholder={this.widget.prop('inputs->' + userInputName + '->placeholder')}></input>
              </div>
              <div className="auth-form-input-label form-label">
                <label>{this.widget.prop('inputs->password->copy')}</label>
              </div>
              <div className="auth-form-input-body form-input">
                <input type="password"
                placeholder={this.widget.prop('inputs->password->placeholder')}></input>
              </div>
              <div className="form-forgot-pass">
                <a href="/">{this.widget.prop('forgot_pass')}</a>
              </div>
              <div className="auth-form-input-body form-submit-wrapper">
                <button type="submit" className="simple-btn">
                  <div className="btn-label-wrapper">{this.widget.prop('login-button->copy')}</div>
                </button>
              </div>
            </form>
          </div>
        </div>
      )
      return dom;
    }
    handleFormSubmit(e: SyntheticEvent<HTMLFormElement>): void {
      e.preventDefault();
      let service = this.widget.prop('login-button->service');
      if(service && e.target) {
        const form = e.target;
        const formData = new FormData(form as HTMLFormElement);
        console.log(`triggering ${service} login`);
        this.setState({
          formData: {
            'email': formData.get('email') as string,
            'password': formData.get('password') as string
          }
        }, () => {
          let formData = this.state.formData;
          apiServiceDelegator
          .getArbitraryService(service)?.invoke(formData)
          .subscribe({
            next: (data: any) => {
              console.log(data);
            },
            error: error => {
              console.log(error);
            }
          });
        });
      } else {
        console.log('no service found');
      }
    }
  }
  class AuthModal extends BaseWidget {
    widget: AppWidget = _widget;
    type: string = _widget.type;
    subtype: string = _widget.subtype || "basic";
    doConfigure() {
      console.log('authModal is ready');
    }
    doRender(): JSX.Element {
      let dom: JSX.Element = (
        <div className="auth-modal-inner">
          { this.widget.prop("display_logo") && 
          <div>
            <div className="modal-logo-wrapper normal-size-logo">
              <img src={`./icons/${this.widget.parsedProp('logo_src')}.svg`}></img>
            </div>
            <div className="welcome-msg-wrapper">
              <h1 className="welcome-msg">{ this.widget.prop('welcome_msg') }</h1>
            </div>
            { this.buildAuthForm(this.widget.prop("auth_type")) }
          </div>
          }
        </div>
      )
      return dom;
    }
    buildAuthForm(key: string): JSX.Element {
      switch(key) {
        case "user_pass":
          return <UserPassAuthForm widget={this.widget.children![0]} />
        default:
          return <div className="auth-form-undefined auth-form-wrapper"></div>;
      }
    }
  }
  class AuthCorner extends BaseWidget {
    widget: AppWidget = _widget;
    type: string = _widget.type;
    subtype: string = _widget.subtype || "basic";
    constructor(props: BaseWidgetProps) {
      super(props);
      this.state.displayChild['auth-modal'] = false;
      this.children = _widget.children || [];
    }
    doConfigure() {
      console.log('authWidget is ready');
      this.addDataEmitter("close-modal", () => {
        this.setState({
          displayChild: {
            'auth-modal': false
          }
        });
      })
      this.triggerLoginModal = this.triggerLoginModal.bind(this);
    }
    doRender(): JSX.Element {
      let dom: JSX.Element = (
        <div className={`auth-${this.subtype}-wrapper`}>
          <div className={`auth-${this.subtype}`}>
            <div className="auth-login-btn">
              <button className="simple-btn" onClick={this.triggerLoginModal}>
                <div className="btn-label-wrapper">{this.widget.prop('login-button->copy')}</div>
              </button>
            </div>
          </div>
          { this.state.displayChild['auth-modal'] && this.renderChildWidget(`${this.widget.widget_id}-modal-basic`) }
        </div>
      )
      return dom;
    }
    triggerLoginModal(): void {
      if(!this.state.displayChild['auth-modal']) {
        this.setState({
          displayChild: {
            'auth-modal': true
          }
        });
        return;
      }
    }
  }
  let Widget: typeof BaseWidget | undefined = ({
   "basic": BaseWidget,
   "auth-modal": AuthModal,
   "auth-corner": AuthCorner
  })[_widget.subtype || "basic"];
  return Widget || BaseWidget;
}

export default authWidgetFactory;
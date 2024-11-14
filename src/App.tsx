import './App.css';
import apiServiceDelegator from './components/ApiServiceDelegator';
import { resolveLayout } from './layouts/layouts';
import { AppLayout } from './layouts/types';
import { AppContext, appContext } from './AppContext';

const PATH_NAME = window.location.pathname;

class App {
  path_name: string
  context: AppContext;
  constructor() {
    this.context = appContext;
    this.path_name = (PATH_NAME === '/') ? 'home' : PATH_NAME;
  }
  render(callback: (dom: JSX.Element) => void): void {
    appContext.initialize(() => {
      apiServiceDelegator
      .getService(
        'page_layout',
        {'layout_id': this.path_name},
        /*{'page_name':'general_error_page','layout':'ErrorLayout'},*/
      ).subscribe(
        {
          next: (data: AppLayout | null) => {
            console.log(data);
            if(data) {
              let Layout = resolveLayout(data);
              let dom: JSX.Element =
                <div className="App">
                  <Layout/>
                </div>
              callback(dom);
            }
          },
          error: error => {
            // page error details to be populated here
            console.log(error);
            // return err_handler && err_handler(error);
          }
        }
      );
    });
  }
}

export default App;

import { AppWidget, AppWidgetListItem } from "../layouts/types";
import { BaseWidget } from "./BaseWidget";

const menuFactory = (_widget: AppWidget | null | undefined): typeof BaseWidget => {
  // const service: PageContentService = apiServiceDelegator.getPageContentService();
  class BasicMenuItemList extends BaseWidget {
    items: AppWidgetListItem[] = []
    doConfigure(): void {
      if(this.widget) {
        this.widget = this.widget;
        if(this.widget?.items) {
          for(let i of this.widget.items) {
            this.items.push(i);
          }
        }
      }
      console.log(this.items);
    }
    doRender(): JSX.Element {
      return (
        <div className={`menu-nav-menu-items`}>
          {this.renderItems()}
        </div>
      )
    }
    renderItems(): JSX.Element[] {
      let sub_menu: JSX.Element[] = [];
      for(let i of this.items) {
        sub_menu.push(
          <div className="menu-nav-item">{i.item_id}</div>
        )
      }
      return sub_menu;
    }
  }
  class BasicMenuWidget extends BaseWidget {
    type: string = "menu"
    doConfigure(): void {
      if(_widget) {
        this.widget = _widget;
        this.subtype = _widget.subtype;
        if(_widget.children) {
          for(let c of _widget.children) {
            this.children.push(c);
          }
        }
        console.log(this.children);
      }
    }
    doRender(): JSX.Element {
      let dom: JSX.Element = (
        <div className={`menu-${this.subtype}`}>
          {this.renderMenuList()}
        </div>
      )
      return dom;
    }
    renderMenuList(): JSX.Element {
      return <BasicMenuItemList widget={this.findChild(c => c.type === 'menu-items')}/>;
    }
    renderMenuTitle(): JSX.Element {
      return (
        <div className={`menu-nav-menu-title`}>
          
        </div>
      );
    }
  }
  class SidebarMenuWidget extends BasicMenuWidget {

  }
  let Widget: typeof BaseWidget | undefined = ({
    "basic": BasicMenuWidget,
    "sidebar-menu": SidebarMenuWidget
  })[_widget?.subtype || "basic"];
  return Widget || BasicMenuWidget;
}

export default menuFactory;
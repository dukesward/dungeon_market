import BaseLayout from "../BaseLayout";
import "./Indigo/theme_indigo.css";

const applyAppTheme = (
  Layout: typeof BaseLayout, theme: string): typeof BaseLayout => {
  class ThemeWrapper extends BaseLayout {
    doRender(): JSX.Element {
      return (
        <div className={`app-theme-${theme}`}>
          <Layout/>
        </div>
      )
    }
  }
  return ThemeWrapper;
}

export default applyAppTheme;
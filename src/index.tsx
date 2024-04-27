import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

import { StrictMode } from "react";
import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

function Root() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}
root.render(<Root />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(cons ole.l og))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

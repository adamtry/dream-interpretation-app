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
import { IonApp, IonContent, IonFooter, IonIcon, IonPage, IonTabBar, IonTabButton } from "@ionic/react";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import { add, list } from "ionicons/icons";

import React from "react";
import { BrowserRouter, RouteComponentProps } from "react-router-dom";
import { App } from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

function Root(props: RouteComponentProps<{}>) {
  return (
    <React.StrictMode>
      <IonApp>
        <IonPage>
          <IonContent className="ion-padding">
            <BrowserRouter>
              <App {...props} />
            </BrowserRouter>
          </IonContent>
          <IonFooter>
            <IonTabBar slot={"bottom"}>
              <IonTabButton tab="add-dream" href="/add-dream">
                <IonIcon icon={add} />
                Add Dream
              </IonTabButton>
              <IonTabButton tab="my-dreams" href="/my-dreams">
                <IonIcon icon={list} />
                My Dreams
              </IonTabButton>
            </IonTabBar>
          </IonFooter>
        </IonPage>
      </IonApp>
    </React.StrictMode>
  );
}
const routeComponentProps = {} as RouteComponentProps<{}>;
root.render(<Root {...routeComponentProps} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

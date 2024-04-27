import { IonApp, IonContent, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { list } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import { MyDreamsPage } from "./views/Dreams/Dreams";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonContent>
          <IonRouterOutlet>
            <Route path="/dreams" render={(props) => <MyDreamsPage {...props} />} />
            <Redirect to={"/dreams"} />
          </IonRouterOutlet>
        </IonContent>
        <IonTabBar slot={"bottom"}>
          <IonTabButton tab="dreams" href="/dreams">
            <IonIcon icon={list} />
            Dreams
          </IonTabButton>
        </IonTabBar>
      </IonReactRouter>
    </IonApp>
  );
}

export { App };

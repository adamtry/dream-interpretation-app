import { IonApp, IonContent, IonIcon, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { list } from "ionicons/icons";
import { Redirect } from "react-router-dom";
import { MyDreamsPage } from "./views/Dreams/Dreams";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonContent>
          <MyDreamsPage />
        </IonContent>
        <Redirect to={"/dreams"} />
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

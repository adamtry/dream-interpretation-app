import { IonApp, IonContent, IonIcon, IonPage, IonRouterOutlet, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { list } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import AddDream from "./views/AddDream/AddDream";
import DreamDetails from "./views/DreamDetails/DreamDetails";
import { MyDreams } from "./views/Dreams/Dreams";
import EditDream from "./views/EditDream/EditDream";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonContent>
          <IonPage>
            <IonRouterOutlet>
              <Route exact path="/dreams" component={MyDreams} />
              <Route exact path="/dreams/edit/:id" render={(props) => <EditDream {...props} />} />
              <Route exact path="/dreams/add" render={(props) => <AddDream {...props} />} />
              <Route exact path="/dreams/view/:id" render={(props) => <DreamDetails {...props} />} />
            </IonRouterOutlet>
          </IonPage>
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

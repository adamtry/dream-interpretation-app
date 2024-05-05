import { IonApp, IonContent, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { cogOutline, list } from "ionicons/icons";
import { Route } from "react-router-dom";
import AddDream from "./views/AddDream/AddDream";
import DreamDetails from "./views/DreamDetails/DreamDetails";
import { MyDreams } from "./views/Dreams/Dreams";
import EditDream from "./views/EditDream/EditDream";
import Settings from "./views/Settings/Settings";

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonContent>
          <IonRouterOutlet>
            <Route exact path="/dreams" component={MyDreams} />
            <Route exact path="/dreams/edit/:id" render={(props) => <EditDream {...props} />} />
            <Route exact path="/dreams/add" render={(props) => <AddDream {...props} />} />
            <Route exact path="/dreams/view/:id" render={(props) => <DreamDetails {...props} />} />
            <Route exact path="/settings" render={() => <Settings />} />
          </IonRouterOutlet>
        </IonContent>
        <IonTabBar slot={"bottom"}>
          <IonTabButton tab="dreams" href="/dreams">
            <IonIcon icon={list} />
            Dreams
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={cogOutline} />
            Settings
          </IonTabButton>
        </IonTabBar>
      </IonReactRouter>
    </IonApp>
  );
}

export { App };

import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { getAuth } from "firebase/auth";
import { cogOutline, list } from "ionicons/icons";
import { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import AddDream from "./views/AddDream/AddDream";
import DreamDetails from "./views/DreamDetails/DreamDetails";
import { MyDreams } from "./views/Dreams/Dreams";
import EditDream from "./views/EditDream/EditDream";
import { Login } from "./views/Login/Login";
import Settings from "./views/Settings/Settings";

function App() {
  const [user, setUser] = useState(getAuth().currentUser);

  getAuth().onAuthStateChanged((user) => {
    setUser(user);
  });

  return (
    <IonApp>
      {!user ? (
        <Login />
      ) : (
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/login" component={Login} />
              <Route exact path="/dreams" component={MyDreams} />
              <Route exact path="/dreams/edit/:id" render={(props) => <EditDream {...props} />} />
              <Route exact path="/dreams/add" render={(props) => <AddDream {...props} />} />
              <Route exact path="/dreams/view/:id" render={(props) => <DreamDetails {...props} />} />
              <Route exact path="/settings" component={Settings} />
              <Redirect exact from="/" to="/dreams" />
            </IonRouterOutlet>
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
          </IonTabs>
        </IonReactRouter>
      )}
    </IonApp>
  );
}

export { App };

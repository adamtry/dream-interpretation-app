import { IonApp, IonContent, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { list } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { getAllDreams } from "./data/DB";
import { Dream } from "./types/Dream";
import { MyDreamsPage } from "./views/Dreams/Dreams";

function App() {
  const [dreams, setDreams] = useState<Dream[]>([]);

  function addDreamProp(dream: Dream) {
    var dr = [...dreams, dream];
    dr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDreams(dr);
  }

  useEffect(() => {
    const initialDreams = getAllDreams();
    initialDreams.then((incomingDreams) => {
      var currentDreamIds = dreams.map((dream) => dream.id);
      var incomingDreamIds = incomingDreams.map((dream) => dream.id);
      var allSet =
        currentDreamIds.length === incomingDreamIds.length &&
        currentDreamIds.sort().join(",") === incomingDreamIds.sort().join(",");
      if (allSet) {
        console.log("No new dreams");
        return;
      }

      incomingDreams.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setDreams(incomingDreams);
    });
  }, [dreams]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonContent>
          <IonRouterOutlet>
            <Route
              path="/dreams"
              render={(props) => <MyDreamsPage {...props} allDreams={dreams} addDreamProp={addDreamProp} />}
            />
            <Route path="/" exact render={() => <Redirect to="/dreams" />} />
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

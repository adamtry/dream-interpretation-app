import { IonApp, IonContent, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { add, list } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { getAllDreams } from "./data/DB";
import { Dream } from "./types/Dream";
import { AddDreamForm } from "./views/AddDreamForm";
import { MyDreams } from "./views/MyDreams";

interface AppProps extends RouteComponentProps {}

function getAllTestDreams(): Promise<Dream[]> {
  const testDreams: Dream[] = [];

  for (let i = 0; i < 30; i++) {
    testDreams.push({
      id: i.toString(),
      title: `Dream ${i}`,
      description: `Description ${i}`,
      date: new Date().toDateString(),
    });
  }
  return Promise.resolve(testDreams);
}

function App({ history }: AppProps) {
  const [dreams, setDreams] = useState<Dream[]>([]);

  function addDreamProp(dream: Dream) {
    var dr = [...dreams, dream];
    dr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDreams(dr);
    console.log("Dream added a123");
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
            <Route path="/add-dream" render={() => <AddDreamForm addDreamCallback={addDreamProp} />} />
            <Route path="/my-dreams" render={() => <MyDreams allDreams={dreams} />} />
            <Route path="/" exact render={() => <Redirect to="/add-dream" />} />
          </IonRouterOutlet>
        </IonContent>
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
      </IonReactRouter>
    </IonApp>
  );
}

export { App };

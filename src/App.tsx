import { IonContent } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useEffect, useState } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { getAllDreams } from "./data/DB";
import { Dream } from "./types/Dream";
import { AddDreamForm } from "./views/AddDreamForm";
import { MyDreams } from "./views/MyDreams";

interface AppProps extends RouteComponentProps {}

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
    <IonContent>
      <IonReactRouter>
        <Route
          path="/add-dream"
          exact={true}
          component={(props: any) => <AddDreamForm {...props} addDreamCallback={addDreamProp} />}
        />
        <Route path="/my-dreams" exact={true} component={(props: any) => <MyDreams {...props} allDreams={dreams} />} />
        {/* <Route path="/" render={() => <Redirect to="/add-dream" />} exact={true} /> */}
      </IonReactRouter>
    </IonContent>
  );
}

export { App };

import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { Dream } from "../../types/Dream";

import { IonPage } from "@ionic/react";

import { IonRefresherCustomEvent } from "@ionic/core";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Route, RouteComponentProps } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { getAllDreams } from "../../data/DB";
import AddDream from "../AddDream/AddDream";
import DreamDetails from "../DreamDetails/DreamDetails";
import EditDream from "../EditDream/EditDream";
import { DreamCard } from "./components/DreamCard";
import { SearchBar } from "./components/SearchBar";

interface MyDreamsPageProps extends RouteComponentProps {
  allDreams: Dream[];
  addDreamProp: (dream: Dream) => void;
}
export function MyDreamsPage({ allDreams, addDreamProp, match }: MyDreamsPageProps) {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path={match.url} render={() => <MyDreams allDreams={allDreams} />} />
        <Route exact path={`${match.url}/:id`} component={DreamDetails} />
        <Route
          exact
          path={`${match.url}/:id/edit`}
          render={(props) => <EditDream allDreams={allDreams} {...props} />}
        />
        <Route
          exact
          path={`${match.url}/add`}
          render={(props) => <AddDream {...props} addDreamCallback={addDreamProp} />}
        />
      </IonRouterOutlet>
    </IonPage>
  );
}

interface MyDreamsProps {
  allDreams: Dream[];
}

function MyDreams({ allDreams }: MyDreamsProps) {
  const location = useLocation();
  const [dreams, setDreams] = useState<Dream[]>(allDreams);
  const [shownDreams, setShownDreams] = useState<Dream[]>(allDreams);
  const [textFilter, setTextFilter] = useState<string>("");

  function filterDreams(searchFilter: string, dreams: Dream[]) {
    return dreams
      .filter((dream) => {
        var titleMatch = dream.title.toLowerCase().includes(searchFilter.toLowerCase());
        var descriptionMatch = dream.description.toLowerCase().includes(searchFilter.toLowerCase());
        return titleMatch || descriptionMatch;
      })
      .sort((a, b) => {
        return new Date(a.date) < new Date(b.date) ? 1 : -1;
      });
  }

  useEffect(() => {
    const filteredDreams = filterDreams(textFilter, dreams);
    setShownDreams(filteredDreams);
  }, [textFilter, dreams]);

  useEffect(() => {
    handleRefresh();
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRefresh(event?: IonRefresherCustomEvent<RefresherEventDetail>) {
    getAllDreams().then((dr) => {
      const dreamRes = filterDreams(textFilter, dr);
      setShownDreams(dreamRes);
      setDreams(dreamRes);
    });
    (document.getElementById("dreamSearch") as HTMLIonSearchbarElement).value = "";
    event?.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Dreams</IonTitle>
        </IonToolbar>
      </IonHeader>
      <SearchBar setSearchFilter={setTextFilter} />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {shownDreams.map((dream) => (
          <DreamCard {...dream} key={dream.id} />
        ))}
      </IonContent>
      <Link to="/dreams/add">
        <IonFab vertical="bottom" horizontal="end" aria-label="add dream">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </Link>
    </IonPage>
  );
}

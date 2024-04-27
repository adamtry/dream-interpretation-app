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
  useIonViewWillEnter,
} from "@ionic/react";
import { Dream } from "../../types/Dream";

import { IonPage } from "@ionic/react";

import { IonRefresherCustomEvent } from "@ionic/core";
import { add } from "ionicons/icons";
import { useMemo, useState } from "react";
import { Route, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { getAllDreams } from "../../data/DB";
import AddDream from "../AddDream/AddDream";
import DreamDetails from "../DreamDetails/DreamDetails";
import EditDream from "../EditDream/EditDream";
import { DreamCard } from "./components/DreamCard";
import { SearchBar } from "./components/SearchBar";

interface MyDreamsPageProps extends RouteComponentProps {}
export function MyDreamsPage({ match }: MyDreamsPageProps) {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path={match.url} component={MyDreams} />
        <Route exact path={`${match.url}/edit/:id`} render={(props) => <EditDream {...props} />} />
        <Route exact path={`${match.url}/add`} render={(props) => <AddDream {...props} />} />
        <Route exact path={`${match.url}/view/:id`} render={(props) => <DreamDetails {...props} />} />
      </IonRouterOutlet>
    </IonPage>
  );
}

function MyDreams() {
  const [dreams, setDreams] = useState<Dream[]>([]);
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

  const shownDreams = useMemo(() => filterDreams(textFilter, dreams), [textFilter, dreams]);

  useIonViewWillEnter(() => {
    refreshDreams();
  });

  async function refreshDreams(event?: IonRefresherCustomEvent<RefresherEventDetail>) {
    getAllDreams().then((dr) => {
      setDreams(dr);
    });
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
        <IonRefresher slot="fixed" onIonRefresh={refreshDreams}>
          <IonRefresherContent />
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

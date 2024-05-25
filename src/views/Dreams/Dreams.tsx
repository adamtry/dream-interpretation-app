import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
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
import { Link } from "react-router-dom";
import { getAllDreams } from "../../data/DreamflowApi";
import { DreamCard } from "./components/DreamCard";
import { SearchBar } from "./components/SearchBar";

export function MyDreams() {
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

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
} from "@ionic/react";
import { Dream } from "../../types/Dream";

import { IonPage } from "@ionic/react";

import { add } from "ionicons/icons";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { DREAMFLOW_API_URL, fetchUser, fetcher } from "../../data/DreamflowApi";
import { DreamCard } from "./components/DreamCard";
import { SearchBar } from "./components/SearchBar";

export function MyDreams() {
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

  const dreams = useSWR<Dream[]>(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`, fetcher).data || [];
  const shownDreams = useMemo(() => filterDreams(textFilter, dreams), [textFilter, dreams]);

  async function refreshDreams(event: CustomEvent) {
    mutate(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`);
    event.detail.complete();
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

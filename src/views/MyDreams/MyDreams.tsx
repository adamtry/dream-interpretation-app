import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { Dream } from "../../types/Dream";

import { IonPage } from "@ionic/react";

import { IonRefresherCustomEvent } from "@ionic/core";
import { useCallback, useEffect, useState } from "react";
import AddDream from "../AddDream/AddDream";
import { DreamCard } from "./components/DreamCard";
import { SearchBar } from "./components/SearchBar";

export function MyDreams({ allDreams, addDreamProp }: { allDreams: Dream[]; addDreamProp: (dream: Dream) => void }) {
  const [shownDreams, setShownDreams] = useState<Dream[]>(allDreams);
  const [textFilter, setTextFilter] = useState<string>("");

  const filterDreamsToShow = useCallback(() => {
    var filteredDreams = allDreams;

    if (textFilter) {
      const match = (dream: Dream, searchFilter: string) => {
        var titleMatch = dream.title.toLowerCase().includes(searchFilter.toLowerCase());
        var descriptionMatch = dream.description.toLowerCase().includes(searchFilter.toLowerCase());
        return titleMatch || descriptionMatch;
      };
      filteredDreams = allDreams.filter((dream) => match(dream, textFilter));
    }
    setShownDreams(filteredDreams);
  }, [allDreams, textFilter]);

  useEffect(() => {
    filterDreamsToShow();
  }, [filterDreamsToShow]);

  async function handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    setShownDreams(allDreams);
    (document.getElementById("dreamSearch") as HTMLIonSearchbarElement).value = "";
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {shownDreams.map((dream) => (
          <DreamCard {...dream} key={dream.id} />
        ))}
      </IonContent>
      <AddDream addDreamCallback={addDreamProp} />
    </IonPage>
  );
}

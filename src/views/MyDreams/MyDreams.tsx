import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { Dream } from "../../types/Dream";

import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonPage } from "@ionic/react";

import { searchCircle } from "ionicons/icons";

import { IonRefresherCustomEvent } from "@ionic/core";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AddDreamFlow from "./components/AddDreamModal";

function DreamCard(dream: Dream) {
  var formattedDate = new Date(dream.date).toLocaleDateString();
  return (
    <Link to={`/dream/${dream.id}`} style={{ textDecoration: "none" }}>
      <IonCard key={dream.id}>
        <IonCardContent>
          <IonCardTitle>{dream.title}</IonCardTitle>
          <p>{dream.description}</p>
          <IonCardSubtitle>{formattedDate}</IonCardSubtitle>
        </IonCardContent>
      </IonCard>
    </Link>
  );
}

function SearchBar({ setSearchFilter }: { setSearchFilter: (searchFilter: string) => void }) {
  return (
    <IonSearchbar
      id="dreamSearch"
      type="text"
      placeholder="Search dreams"
      searchIcon={searchCircle}
      showCancelButton="focus"
      onIonInput={(ev) => {
        let query = "";
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        setSearchFilter(query);
      }}
    />
  );
}

interface DreamListProps {
  allDreams: Dream[];
  handleRefresh: (event: IonRefresherCustomEvent<RefresherEventDetail>) => void;
}
function DreamList({ allDreams, handleRefresh }: DreamListProps) {
  const [shownDreams, setShownDreams] = useState<Dream[]>(allDreams);
  useEffect(() => {
    setShownDreams(allDreams);
  }, [allDreams]);
  return (
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
      {shownDreams.map((dream) => (
        <DreamCard {...dream} key={dream.id} />
      ))}
    </IonContent>
  );
}

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
      <DreamList allDreams={shownDreams} handleRefresh={handleRefresh} />
      <AddDreamFlow addDreamCallback={addDreamProp} />
    </IonPage>
  );
}
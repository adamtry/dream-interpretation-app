import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Dream } from "../../types/Dream";

import { IonPage } from "@ionic/react";

import { add } from "ionicons/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mutate } from "swr";
import { DREAMFLOW_API_URL, fetchUser } from "../../data/DreamflowApi";
import DreamResultPage from "./components/DreamResultPage";
import SearchBar from "./components/SearchBar";

export function MyDreams() {
  const [page, setPage] = useState<number>(1);
  const [textFilter, setTextFilter] = useState<string>("");
  const [morePagesExist, setMorePagesExist] = useState<boolean>(true);

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

  async function refreshDreams(event: CustomEvent) {
    mutate(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`);
    event.detail.complete();
  }

  async function loadMoreDreams(event: CustomEvent) {
    console.log("Loading more!");
    setPage(page + 1);
    setTimeout(() => (event.target as HTMLIonInfiniteScrollElement).complete(), 500);
  }

  const pages = [];
  for (let i = 1; i <= page; i++) {
    pages.push(<DreamResultPage key={i} page={i} pageSize={10} setMorePagesExist={setMorePagesExist} />);
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
        {pages}
        {morePagesExist ? (
          <IonInfiniteScroll threshold="100px" onIonInfinite={loadMoreDreams}>
            <IonInfiniteScrollContent loadingText="Loading more dreams..."></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        ) : (
          <IonNote
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px",
            }}
          >
            No more dreams
          </IonNote>
        )}
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

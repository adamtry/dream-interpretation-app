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

import { IonPage } from "@ionic/react";

import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mutate } from "swr";
import { DREAMFLOW_API_URL, fetchUser } from "../../data/DreamflowApi";
import DreamResultPage from "./components/DreamResultPage";
import SearchBar from "./components/SearchBar";

function MyDreams() {
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [morePagesExist, setMorePagesExist] = useState<boolean>(true);

  async function refreshDreams(event: CustomEvent) {
    setPage(1);
    mutate((key: string) => {
      return key.startsWith(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`) && key.includes("page=1");
    });
    mutate(
      (key: string) => {
        return (
          key.startsWith(`${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams`) &&
          key.includes("page=") &&
          !key.includes("page=1")
        );
      },
      false,
      false,
    );
    setSearchQuery("");
    event.detail.complete();
  }

  async function loadMoreDreams(event: CustomEvent) {
    setPage(page + 1);
    setTimeout(() => (event.target as HTMLIonInfiniteScrollElement).complete(), 500);
  }

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const newPages = [];
    for (let i = 1; i <= page; i++) {
      newPages.push(
        <DreamResultPage
          key={i}
          page={i}
          pageSize={10}
          setMorePagesExist={setMorePagesExist}
          searchQuery={searchQuery}
        />,
      );
    }
    setPages(newPages);
  }, [page, searchQuery]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Dreams</IonTitle>
        </IonToolbar>
      </IonHeader>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={refreshDreams}>
          <IonRefresherContent />
        </IonRefresher>
        {pages}
        {morePagesExist ? (
          <IonInfiniteScroll threshold="10%" onIonInfinite={loadMoreDreams}>
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

export default MyDreams;

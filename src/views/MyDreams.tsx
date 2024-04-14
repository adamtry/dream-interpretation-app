import { IonRefresherCustomEvent } from "@ionic/core";
import {
  IonContent,
  IonHeader,
  IonInput,
  IonItemGroup,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import { Dream } from "../types/Dream";

import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonItem, IonPage } from "@ionic/react";

function DreamCard(dream: Dream) {
  var formattedDate = new Date(dream.date).toLocaleDateString();
  return (
    <IonCard key={dream.id}>
      <IonCardContent>
        <IonCardTitle>{dream.title}</IonCardTitle>
        <p>{dream.description}</p>
        <IonCardSubtitle>{formattedDate}</IonCardSubtitle>
      </IonCardContent>
    </IonCard>
  );
}

function SearchBar({ setSearchFilter }: { setSearchFilter: (searchFilter: string) => void }) {
  return (
    <IonItem>
      <IonSearchbar
        id="dreamSearch"
        type="text"
        placeholder="Search dreams"
        onIonChange={(event) => setSearchFilter(event.detail.value!.toLowerCase())}
      ></IonSearchbar>
    </IonItem>
  );
}

type DateRangeFilter = {
  startDate: string | null;
  endDate: string | null;
};

function DateRange({
  dateFilter,
  setDateFilter,
}: {
  dateFilter: DateRangeFilter;
  setDateFilter: (dateFilter: DateRangeFilter) => void;
}) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  return (
    <>
      <IonItemGroup>
        <IonItem>
          <IonInput
            type="date"
            label="Start date"
            value={startDate}
            onIonChange={(e) => {
              setStartDate(e.detail.value as string);
              setDateFilter({ ...dateFilter, startDate: e.detail.value as string });
            }}
          />
        </IonItem>
        <IonItem>
          <IonInput
            type="date"
            label="End date"
            value={endDate}
            onIonChange={(e) => {
              setEndDate(e.detail.value as string);
              setDateFilter({ ...dateFilter, endDate: e.detail.value as string });
            }}
          />
        </IonItem>
      </IonItemGroup>
    </>
  );
}

function DreamList({
  allDreams,
  handleRefresh,
}: {
  allDreams: Dream[];
  handleRefresh: (event: IonRefresherCustomEvent<RefresherEventDetail>) => void;
}) {
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

export function MyDreams({ allDreams }: { allDreams: Dream[] }) {
  const [shownDreams, setShownDreams] = useState<Dream[]>(allDreams);
  const [textFilter, setTextFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({ startDate: null, endDate: null });

  const filterDreamsToShow = useCallback(() => {
    console.log("Filtering dreams");

    var filteredDreams = allDreams;

    // Filter by date
    const [startDate, endDate] = [dateFilter.startDate, dateFilter.endDate];
    if (startDate != null) {
      filteredDreams = filteredDreams.filter((dream) => dream.date >= startDate);
    }
    if (endDate != null) {
      filteredDreams = filteredDreams.filter((dream) => dream.date <= endDate);
    }

    // Filter by text
    if (textFilter) {
      const match = (dream: Dream, searchFilter: string) => {
        var titleMatch = dream.title.toLowerCase().includes(searchFilter.toLowerCase());
        var descriptionMatch = dream.description.toLowerCase().includes(searchFilter.toLowerCase());
        return titleMatch || descriptionMatch;
      };
      filteredDreams = allDreams.filter((dream) => match(dream, textFilter));
    }
    setShownDreams(filteredDreams);
  }, [allDreams, dateFilter, textFilter]);

  useEffect(() => {
    filterDreamsToShow();
  }, [filterDreamsToShow]);

  async function handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    console.log("Handling refresh");
    setShownDreams(allDreams);
    setDateFilter({ startDate: null, endDate: null });
    setTextFilter("");
    event.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Dreams</IonTitle>
        </IonToolbar>
      </IonHeader>
      <DateRange dateFilter={dateFilter} setDateFilter={setDateFilter} />
      <SearchBar setSearchFilter={setTextFilter} />
      <DreamList allDreams={shownDreams} handleRefresh={handleRefresh} />
    </IonPage>
  );
}

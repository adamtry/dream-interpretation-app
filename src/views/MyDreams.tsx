import {
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonGrid,
  IonHeader,
  IonModal,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Dream } from "../types/Dream";

import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonPage } from "@ionic/react";

function DreamCard(dream: Dream) {
  return (
    <IonCard key={dream.id}>
      <IonCardHeader>
        <IonCardSubtitle>{dream.date}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonCardTitle>{dream.title}</IonCardTitle>
        <p>{dream.description}</p>
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
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoString = oneWeekAgo.toISOString();

  return (
    <IonItem>
      <IonGrid>
        <IonRow>
          <IonCol size={"6"}>
            <IonDatetimeButton aria-label="Date" datetime="startDate"></IonDatetimeButton>
            <IonModal keepContentsMounted={true}>
              <IonDatetime id="startDate" presentation="date" value={oneWeekAgoString}></IonDatetime>
            </IonModal>
          </IonCol>
          <IonCol size={"6"}>
            <IonDatetimeButton aria-label="Date" datetime="endDate"></IonDatetimeButton>
            <IonModal keepContentsMounted={true}>
              <IonDatetime id="endDate" presentation="date"></IonDatetime>
            </IonModal>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
}

export function MyDreams({ allDreams }: { allDreams: Dream[] }) {
  const [shownDreams, setShownDreams] = useState<Dream[]>(allDreams);
  const [textFilter, setTextFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({ startDate: null, endDate: null });

  useEffect(() => {
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
  }, [textFilter, allDreams, dateFilter.startDate, dateFilter.endDate]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Dreams</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <DateRange dateFilter={dateFilter} setDateFilter={setDateFilter} />
        <SearchBar setSearchFilter={setTextFilter} />
        {shownDreams?.map((dream) => <DreamCard {...dream} key={dream.id} />)}
      </IonContent>
    </IonPage>
  );
}

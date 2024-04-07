import { IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { Dream } from "../types/Dream";

function DreamCard(dream: Dream) {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <span className="fw-bold">{dream.date}</span>
      </div>
      <div className="card-body">
        <u>
          <h5 className="card-title">{dream.title}</h5>
        </u>
        <p className="card-text">{dream.description}</p>
      </div>
    </div>
  );
}

function SearchBar({ setSearchFilter }: { setSearchFilter: (searchFilter: string) => void }) {
  return (
    <div className="input-group mb-3">
      <input
        id="dreamSearch"
        type="text"
        className="form-control"
        placeholder="Search dreams"
        aria-label="Search dreams"
        aria-describedby="button-addon2"
        onChange={() =>
          setSearchFilter((document.getElementById("dreamSearch") as HTMLInputElement).value.toLowerCase())
        }
      />
    </div>
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
  return (
    <div className="input-group mb-3">
      <input
        id="searchStartDate"
        type="date"
        className="form-control"
        placeholder="Start date"
        aria-label="Start date"
        aria-describedby="button-addon2"
        onChange={() =>
          setDateFilter({
            ...dateFilter,
            startDate: (document.getElementById("searchStartDate") as HTMLInputElement).value,
          })
        }
      />
      <input
        id="searchEndDate"
        type="date"
        className="form-control"
        placeholder="End date"
        aria-label="End date"
        aria-describedby="button-addon2"
        onChange={() =>
          setDateFilter({
            ...dateFilter,
            endDate: (document.getElementById("searchEndDate") as HTMLInputElement).value,
          })
        }
      />
    </div>
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
      <h1>My Dreams</h1>
      <DateRange dateFilter={dateFilter} setDateFilter={setDateFilter} />
      <SearchBar setSearchFilter={setTextFilter} />
      {allDreams?.map((dream) => <DreamCard {...dream} key={dream.id} />)}
    </IonPage>
  );
}

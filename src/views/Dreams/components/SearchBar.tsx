import { IonSearchbar } from "@ionic/react";
import { searchCircle } from "ionicons/icons";

export function SearchBar({ setSearchFilter }: { setSearchFilter: (searchFilter: string) => void }) {
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

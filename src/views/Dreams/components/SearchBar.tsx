import { IonSearchbar } from "@ionic/react";
import { searchCircle } from "ionicons/icons";
import { useEffect, useState } from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    const delayRebounceFn = setTimeout(() => {
      setSearchQuery(text);
    }, 500);

    return () => {
      clearTimeout(delayRebounceFn);
    };
  }, [text, searchQuery]);

  return (
    <IonSearchbar
      id="dreamSearch"
      type="text"
      placeholder="Search dreams"
      searchIcon={searchCircle}
      showCancelButton="focus"
      onIonCancel={() => {
        setText("");
        setSearchQuery("");
      }}
      onIonInput={(ev) => {
        let query = "";
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();
        if (query === "") setSearchQuery("");
        setText(query);
      }}
    />
  );
}

export default SearchBar;

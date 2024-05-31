import { useEffect } from "react";
import { useDreams } from "../../../data/DreamflowApi";
import DreamCard from "./DreamCard";

interface DreamResultPageProps {
  page: number;
  pageSize: number;
  setMorePagesExist: (morePagesExist: boolean) => void;
  searchQuery?: string;
}
function DreamResultPage({ page, pageSize, searchQuery, setMorePagesExist }: DreamResultPageProps) {
  const params = {
    page: page.toString(),
    pageSize: pageSize.toString(),
    search: searchQuery || "",
  };

  const { data: res, error } = useDreams(params);
  const dreams = res?.data;

  useEffect(() => {
    if (!res) return;
    const totalPagesHeader = res.headers.get("X-Total-Pages");
    const morePagesExist = totalPagesHeader ? page < parseInt(totalPagesHeader) : false;
    setMorePagesExist(morePagesExist);
  }, [res]);

  if (error) return <div>Error loading dreams...</div>;
  if (!dreams) return <div></div>;
  return dreams.map((dream) => <DreamCard key={dream.id} {...dream} />);
}

export default DreamResultPage;

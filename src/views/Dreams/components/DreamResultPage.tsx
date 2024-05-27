import { useEffect } from "react";
import useSWR from "swr";
import { DREAMFLOW_API_URL, fetchUser, fetcher } from "../../../data/DreamflowApi";
import { Dream } from "../../../types/Dream";
import DreamCard from "./DreamCard";

interface DreamResultPageProps {
  page: number;
  pageSize: number;
  setMorePagesExist: (morePagesExist: boolean) => void;
  searchQuery?: string;
}
function DreamResultPage({ page, pageSize, searchQuery, setMorePagesExist }: DreamResultPageProps) {
  function urlForPage(number: number): string {
    var url = `${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams?page=${number}&pageSize=${pageSize}`;
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }
    return url;
  }

  const { data: response, error } = useSWR<{ data: Dream[]; headers: Headers }>(urlForPage(page), fetcher);

  useEffect(() => {
    if (response) {
      const totalPagesHeader = response.headers.get("X-Total-Pages");
      const morePagesExist = totalPagesHeader ? page < parseInt(totalPagesHeader) : false;
      setMorePagesExist(morePagesExist);
    }
  }, [response]);

  if (error) return <div>Error loading dreams...</div>;
  if (!response?.data) return <div></div>;
  return response.data.map((dream) => <DreamCard key={dream.id} {...dream} />);
}

export default DreamResultPage;

import { useEffect } from "react";
import useSWR from "swr";
import { DREAMFLOW_API_URL, fetchUser, fetcher } from "../../../data/DreamflowApi";
import { Dream } from "../../../types/Dream";
import DreamCard from "./DreamCard";

interface DreamResultPageProps {
  page: number;
  pageSize: number;
  setMorePagesExist: (morePagesExist: boolean) => void;
}
function DreamResultPage({ page, pageSize, setMorePagesExist }: DreamResultPageProps) {
  const { data, error } = useSWR<Dream[]>(
    `${DREAMFLOW_API_URL}/users/${fetchUser().uid}/dreams?page=${page}&pageSize=${pageSize}`,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setMorePagesExist(data.length >= pageSize);
    }
  }, [data]);

  if (error) return <div>Error loading dreams...</div>;
  if (!data) return <div>Loading dreams...</div>;
  return data.map((dream) => <DreamCard key={dream.id} {...dream} />);
}

export default DreamResultPage;

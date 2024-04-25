import { Dream, DreamUpdate } from "../../types/Dream";

import { useForm } from "react-hook-form";

import { IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { getDream, updateDream } from "../../data/DB";
import DreamForm from "../_components/DreamForm";

interface EditDreamProps extends RouteComponentProps {
  allDreams: Dream[];
}
function EditDream({ allDreams, history }: EditDreamProps) {
  const form = useForm();
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<Dream | undefined>(undefined);

  useEffect(() => {
    getDream(id).then((dream) => {
      setDream(dream);
    });
  }, [id]);

  if (!dream) {
    return <IonSpinner />;
  }

  function resetForm() {
    form.reset(
      {
        date: dream?.date && new Date(dream.date).toISOString().split("T")[0],
        title: dream?.title,
        description: dream?.description,
      },
      { keepValues: false },
    );
  }

  async function submitAction(data: any) {
    if (!dream) {
      console.error("No Dream found to edit.");
      return;
    }
    var dreamUpdate: DreamUpdate = {
      id: dream.id,
      title: data.title,
      description: data.description,
      date: data.date,
    };
    await updateDream(dreamUpdate)
      .then((newDreamId) => {
        if (!newDreamId) return;

        const updatedDream = {
          id: dreamUpdate.id,
          title: dreamUpdate.title || dream.title,
          description: dreamUpdate.description || dream.description,
          date: dreamUpdate.date || dream.date,
        };

        var newDreams = allDreams.map((d) => (d.id === updatedDream.id ? updatedDream : d));
        newDreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding dream: ", error);
      })
      .finally(() => {
        history.goBack();
      });
  }

  return (
    <DreamForm
      form={form}
      formTitle="Edit Dream"
      submitAction={submitAction}
      presetValues={dream}
      redirect={`/dreams/${dream.id}`}
    />
  );
}

export default EditDream;

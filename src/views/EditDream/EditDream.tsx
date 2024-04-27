import { Dream, DreamUpdate } from "../../types/Dream";

import { useForm } from "react-hook-form";

import { IonSpinner } from "@ionic/react";
import { useEffect, useState } from "react";
import { RouteComponentProps, useLocation, useParams } from "react-router-dom";
import { getDream, updateDream } from "../../data/DB";
import DreamForm from "../_components/DreamForm";

interface EditDreamProps extends RouteComponentProps {}
function EditDream({ history }: EditDreamProps) {
  const location = useLocation();
  const form = useForm();
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<Dream | undefined>(undefined);

  useEffect(() => {
    getDream(id).then((dream) => {
      setDream(dream);
    });
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
      redirect={`/dreams/view/${dream.id}`}
    />
  );
}

export default EditDream;

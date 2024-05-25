import { Dream, DreamUpdate } from "../../types/Dream";

import { useForm } from "react-hook-form";

import { IonPage, IonSpinner, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { RouteComponentProps, useParams } from "react-router-dom";
import { getDream, updateDream } from "../../data/DreamflowApi";
import DreamForm from "../_components/DreamForm";

interface EditDreamProps extends RouteComponentProps {}
function EditDream({ history }: EditDreamProps) {
  const form = useForm();
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<Dream | undefined>(undefined);

  useIonViewWillEnter(() => {
    if (!document.location.pathname.includes("/edit/")) return;
    getDream(id)
      .then((dream) => {
        setDream(dream);
      })
      .catch((error) => {
        console.error(error);
        history.push("/dreams");
      });
  });

  if (!dream) {
    return (
      <IonPage>
        <IonSpinner />
      </IonPage>
    );
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

  return <DreamForm form={form} formTitle="Edit Dream" submitAction={submitAction} presetValues={dream} />;
}

export default EditDream;

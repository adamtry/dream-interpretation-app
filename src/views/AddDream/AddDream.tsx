import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addDream } from "../../data/DB";
import { Dream, DreamReq } from "../../types/Dream";

import { useForm } from "react-hook-form";

import { closeOutline } from "ionicons/icons";
import { RouteComponentProps } from "react-router-dom";

interface AddDreamProps extends RouteComponentProps {
  addDreamCallback: (dream: Dream) => void;
}
function AddDream({ addDreamCallback, history }: AddDreamProps) {
  const { register, handleSubmit, reset } = useForm();

  function resetForm() {
    reset(
      {
        date: new Date().toISOString().split("T")[0],
        title: "",
        description: "",
      },
      { keepValues: false },
    );
  }

  async function onSubmit(data: any) {
    var resolvedTitle = data.title || "Untitled";
    const dream: DreamReq = {
      title: resolvedTitle,
      description: data.description,
      date: data.date,
    };
    await addDream(dream, addDreamCallback)
      .then(() => {
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Dream</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/dreams">
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form id="addDreamForm" onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonInput
              {...register("date", { required: true })}
              value={new Date().toISOString().split("T")[0]}
              type="date"
              label="Date"
              required
            />
          </IonItem>

          <IonItem>
            <IonInput
              {...register("title", { required: false })}
              defaultValue={"Untitled"}
              placeholder="Untitled"
              label="Title"
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              {...register("description", { required: true })}
              rows={10}
              aria-label="Description"
              placeholder="Description..."
              required
            />
          </IonItem>

          <IonButton type="submit" expand="block">
            Submit
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}

export default AddDream;

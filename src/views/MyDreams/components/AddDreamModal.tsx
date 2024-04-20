import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useState } from "react";
import { addDream } from "../../../data/DB";
import { Dream, DreamReq } from "../../../types/Dream";

import { useForm } from "react-hook-form";

import { add, closeOutline } from "ionicons/icons";

interface AddDreamFlowProps {
  addDreamCallback: (dream: Dream) => void;
}
function AddDreamFlow({ addDreamCallback }: AddDreamFlowProps) {
  const [isOpen, setIsOpen] = useState(false);

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    resetFormAndClose();
  }

  const { register, handleSubmit, reset } = useForm();

  function resetFormAndClose() {
    reset(
      {
        date: new Date().toISOString().split("T")[0],
        title: "",
        description: "",
      },
      { keepValues: false },
    );
    setIsOpen(false);
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
        resetFormAndClose();
      })
      .catch((error) => {
        console.error("Error adding dream: ", error);
      });
  }

  return (
    <>
      <IonFab vertical="bottom" horizontal="end" aria-label="add dream">
        <IonFabButton onClick={() => setIsOpen(true)}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <IonModal isOpen={isOpen} onWillDismiss={onWillDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Dream</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>
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
      </IonModal>
    </>
  );
}

export default AddDreamFlow;

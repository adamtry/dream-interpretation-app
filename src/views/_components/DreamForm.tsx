import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { DreamReq, DreamUpdate } from "../../types/Dream";

import { UseFormReturn } from "react-hook-form";

import { closeOutline } from "ionicons/icons";
import { useState } from "react";

interface DreamFormProps {
  form: UseFormReturn<any>;
  formTitle: string;
  submitAction: (dream: DreamReq | DreamUpdate) => Promise<void>;
  presetValues?: DreamReq;
}
function DreamForm({ form, formTitle, presetValues, submitAction }: DreamFormProps) {
  const { register, handleSubmit, reset } = form;
  const [loading, setLoading] = useState(false);

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
    resetForm();
    setLoading(true);
    await submitAction(dream).finally(() => {
      setLoading(false);
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{formTitle}</IonTitle>
          <IonButtons slot="end">
            <IonBackButton>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonInput
              {...register("date", { required: true })}
              value={
                presetValues?.date
                  ? new Date(presetValues?.date).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              type="date"
              label="Date"
              required
            />
          </IonItem>

          <IonItem>
            <IonInput
              {...register("title", { required: false })}
              value={presetValues?.title || ""}
              placeholder="Untitled"
              label="Title"
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              {...register("description", { required: true })}
              value={presetValues?.description || ""}
              rows={10}
              aria-label="Description"
              placeholder="Description..."
              required
            />
          </IonItem>
          {loading ? (
            <div style={{ textAlign: "center", margin: "1em" }}>
              <IonSpinner />
            </div>
          ) : (
            <IonButton type="submit" expand="block">
              Submit
            </IonButton>
          )}
        </form>
      </IonContent>
    </IonPage>
  );
}

export default DreamForm;

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { addDream } from "../data/DB";
import { Dream } from "../types/Dream";

interface AddDreamFormProps {
  addDreamCallback: (dream: Dream) => void;
}

export function AddDreamForm({ addDreamCallback }: AddDreamFormProps) {
  const router = useIonRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data: any) {
    console.log("Form data:", data);
    var resolvedTitle = data.title ? data.title : "Untitled";
    const dream = {
      title: resolvedTitle,
      description: data.description,
      date: data.date,
    } as Dream;
    await addDream(dream, addDreamCallback).then(() => {
      router.push("/my-dreams");
    });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Dream</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonInput {...register("date", { required: true })} value={today} type="date" label="Date" />
            {errors.date && <p className="error-message">Date is required.</p>}
          </IonItem>

          <IonItem>
            <IonInput
              {...register("title", { required: true })}
              defaultValue={"Untitled"}
              placeholder="Untitled"
              label="Title"
            />
          </IonItem>

          <IonItem>
            <IonTextarea {...register("description")} rows={10} label="Description" />
            {errors.description && <p className="error-message">Description is required.</p>}
          </IonItem>

          <IonButton type="submit" expand="block">
            Submit
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}

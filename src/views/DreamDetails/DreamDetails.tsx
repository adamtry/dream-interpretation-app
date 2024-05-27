import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {} from "ionicons/icons";
import { useParams } from "react-router";

import { arrowBackOutline, createOutline } from "ionicons/icons";
import { RouteComponentProps } from "react-router-dom";
import { DREAMFLOW_API_URL, deleteDream, fetcher } from "../../data/DreamflowApi";
import { Dream } from "../../types/Dream";
import { ConfirmDeleteAlert } from "./components/ConfirmDeleteAlert";

import useSWR from "swr";

function DreamDetails({ history }: RouteComponentProps) {
  const { id } = useParams<{ id: string }>();

  function handleDelete() {
    deleteDream(id).then(() => {
      history.push("/dreams");
    });
  }

  const { data: dream } = useSWR<Dream>(`${DREAMFLOW_API_URL}/dreams/${id}`, fetcher);

  if (!id || !dream) {
    return (
      <IonPage>
        <IonSpinner />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{dream.title}</IonTitle>
          <IonButtons slot="end">
            <ConfirmDeleteAlert dream={dream} handleDelete={handleDelete} />
            <IonButton routerLink={`/dreams/edit/${dream.id}`}>
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
            <IonButton routerLink="/dreams">
              <IonIcon slot="icon-only" icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>{dream.title}</h1>
        <p>{dream.description}</p>
        <p>{new Date(dream.date).toLocaleDateString()}</p>
      </IonContent>
    </IonPage>
  );
}

export default DreamDetails;

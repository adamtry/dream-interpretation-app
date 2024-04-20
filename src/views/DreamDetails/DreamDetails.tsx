import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import {} from "ionicons/icons";
import { useParams } from "react-router";

import { arrowBackOutline, createOutline, trashOutline } from "ionicons/icons";
import { Dream } from "../../types/Dream";

import { useHistory } from "react-router-dom";

interface DreamDetailsProps {
  allDreams: Dream[];
}
function DreamDetails({ allDreams }: DreamDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const dream = allDreams.find((dream) => dream.id === id);
  if (!dream) {
    return <div>Dream not found</div>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{dream.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={`/dreams`}>
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonButton>
            <IonButton routerLink={`/dreams`}>
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonButton>
            <IonButton onClick={() => history.goBack()}>
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

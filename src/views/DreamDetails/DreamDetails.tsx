import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import {} from "ionicons/icons";
import { useParams } from "react-router";
import { Dream } from "../../types/Dream";

import { closeOutline } from "ionicons/icons";

interface DreamDetailsProps {
  allDreams: Dream[];
}
function DreamDetails({ allDreams }: DreamDetailsProps) {
  const { id } = useParams<{ id: string }>();
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
            <IonButton routerLink={`/my-dreams`}>
              <IonIcon slot="icon-only" icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>{dream.description}</p>
        <p>{new Date(dream.date).toLocaleDateString()}</p>
      </IonContent>
    </IonPage>
  );
}

export default DreamDetails;

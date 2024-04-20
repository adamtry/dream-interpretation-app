import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";
import { Dream } from "../../types/Dream";

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

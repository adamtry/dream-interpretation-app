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

import { arrowBackOutline, createOutline, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDream } from "../../data/DB";
import { Dream } from "../../types/Dream";

function DreamDetails() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<Dream | undefined>(undefined);

  useEffect(() => {
    getDream(id).then((dream) => {
      setDream(dream);
    });
  }, [id, location.key]);

  if (!dream) {
    return <IonSpinner />;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{dream.title}</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={`/dreams/${dream.id}/test`}>
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonButton>
            <Link
              to={{
                pathname: `/dreams/${dream.id}/test`,
                state: {
                  dream: dream,
                },
              }}
            >
              <IonButton>
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </Link>
            <IonButton routerLink={`/dreams/${dream.id}/edit`}>
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

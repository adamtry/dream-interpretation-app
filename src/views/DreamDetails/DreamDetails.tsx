import {
  IonAlert,
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
import { RouteComponentProps, useLocation } from "react-router-dom";
import { deleteDream, getDream } from "../../data/DB";
import { Dream } from "../../types/Dream";

interface ConfirmDeleteAlertProps {
  dream: Dream;
  handleDelete: () => void;
}
function ConfirmDeleteAlert({ dream, handleDelete }: ConfirmDeleteAlertProps) {
  const [showAlert, setShowAlert] = useState(false);

  function onDeletePressed() {
    setShowAlert(false);
    handleDelete();
  }

  return (
    <>
      <IonButton onClick={() => setShowAlert(true)}>
        <IonIcon slot="icon-only" icon={trashOutline} />
      </IonButton>
      <IonAlert
        isOpen={showAlert}
        onWillDismiss={() => setShowAlert(false)}
        header={`Delete ${dream.title}?`}
        message="Are you sure you want to delete this dream? This action cannot be undone."
        buttons={[
          { text: "CANCEL", handler: () => setShowAlert(false) },
          { text: "DELETE", handler: onDeletePressed },
        ]}
      />
    </>
  );
}

function DreamDetails({ history }: RouteComponentProps) {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [dream, setDream] = useState<Dream | undefined>(undefined);

  function handleDelete() {
    deleteDream(id).then(() => {
      history.push("/dreams");
    });
  }

  useEffect(() => {
    if (location.pathname.includes("view")) {
      getDream(id)
        .then((dream) => {
          setDream(dream);
        })
        .catch((error) => {
          console.error(error);
          history.push("/dreams");
        });
    }
  }, [location.pathname]);

  if (!dream) {
    return <IonSpinner />;
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

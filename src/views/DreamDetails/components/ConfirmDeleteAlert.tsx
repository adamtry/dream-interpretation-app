import { IonAlert, IonButton, IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { useState } from "react";
import { Dream } from "../../../types/Dream";

interface ConfirmDeleteAlertProps {
  dream: Dream;
  handleDelete: () => void;
}
export function ConfirmDeleteAlert({ dream, handleDelete }: ConfirmDeleteAlertProps) {
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

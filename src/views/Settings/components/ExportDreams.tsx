import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { download } from "ionicons/icons";

function ExportDreams() {
  return (
    <IonItem>
      <IonIcon icon={download} slot="start"></IonIcon>
      <IonLabel>Export Dreams</IonLabel>
    </IonItem>
  );
}

export default ExportDreams;

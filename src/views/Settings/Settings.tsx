import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { download } from "ionicons/icons";

function Settings() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader>Data Management</IonListHeader>
        <IonList inset={true}>
          <IonItem>
            <IonIcon aria-hidden="true" icon={download} slot="start" />
            <IonLabel>Export Dreams</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Settings;

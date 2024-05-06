import { IonContent, IonHeader, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

import ExportDreams from "./components/ExportDreams";

function Settings() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonListHeader>Data Management</IonListHeader>
        <IonList inset={true}>
          <ExportDreams />
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Settings;

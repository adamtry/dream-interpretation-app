import { IonContent, IonHeader, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

import DeleteAccount from "./components/DeleteAccount";
import ExportDreams from "./components/ExportDreams";
import SignOut from "./components/SignOut";

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
        <IonListHeader>Account</IonListHeader>
        <IonList inset={true}>
          <SignOut />
        </IonList>
        <IonListHeader>Danger zone</IonListHeader>
        <IonList inset={true}>
          <DeleteAccount />
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Settings;

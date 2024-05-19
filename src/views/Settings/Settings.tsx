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

import ExportDreams from "./components/ExportDreams";

import { getAuth, signOut } from "firebase/auth";
import { logOutOutline } from "ionicons/icons";

function SignOut() {
  function handleSignOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <IonItem button={true} onClick={handleSignOut}>
      <IonIcon icon={logOutOutline} slot="start"></IonIcon>
      <IonLabel>Sign Out</IonLabel>
    </IonItem>
  );
}

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
      </IonContent>
    </IonPage>
  );
}

export default Settings;

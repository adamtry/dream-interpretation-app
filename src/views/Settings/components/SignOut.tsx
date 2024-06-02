import { IonIcon, IonItem, IonLabel } from "@ionic/react";
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

export default SignOut;

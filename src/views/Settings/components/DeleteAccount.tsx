import { IonButton, IonIcon, IonInput, IonItem, IonLabel } from "@ionic/react";

import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { alertCircleOutline } from "ionicons/icons";
import type { E164Number } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { deleteUserAndAllDreams } from "../../../data/DreamflowApi";

function DeleteAccount() {
  const [flowState, setFlowState] = useState<"deleteBtn" | "setNumber" | "confirmCode">("deleteBtn");
  const [value, setValue] = useState(import.meta.env.VITE_TEST_PHONE as string);
  const auth = getAuth();
  auth.useDeviceLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmitVerificationCode(data: any) {
    data = data as FormData;
    var verificationCode = data.verificationCode;
    var confirmationResult = window.confirmationResult;
    confirmationResult.confirm(verificationCode).then((result) => {
      console.log("Logged in: ", result.user);
      deleteUserAndAllDreams().then(() => {
        auth.currentUser?.delete().then(() => {
          console.log("Account deleted");
        });
      });
    });
  }

  interface FormData {
    phoneNumber: string;
  }
  function onSubmitPhoneNumber(data: any) {
    data = data as FormData;
    var phoneNumber = data.phoneNumber.toString();

    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      .then((confirmationResult) => {
        console.log("Confirmation result: ", confirmationResult);
        window.confirmationResult = confirmationResult;
        setFlowState("confirmCode");
      })
      .catch((error) => {
        console.error("Error signing in: ", error);
      });
  }

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
    }
  }, [window]);

  return (
    <>
      {flowState == "deleteBtn" && (
        <IonItem button={true} onClick={() => setFlowState("setNumber")}>
          <IonIcon icon={alertCircleOutline} slot="start"></IonIcon>
          <IonLabel>Delete Account</IonLabel>
        </IonItem>
      )}
      {flowState == "setNumber" && (
        <>
          <div>
            <div id="recaptcha-container"></div>
          </div>
          <div style={{ display: "ruby-text" }}>
            <h1>Confirm Account Deletion</h1>
            <br />
            <IonItem>
              <form onSubmit={handleSubmit(onSubmitPhoneNumber)}>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={value as E164Number}
                  /* @ts-ignore */
                  onChange={setValue}
                  {...register("phoneNumber", { required: true })}
                />
                <IonButton id="sign-in-button" className="ion-margin-top" type="submit" expand="block">
                  Continue
                </IonButton>
                <input type="submit" style={{ display: "none" }} />
              </form>
            </IonItem>
          </div>
        </>
      )}
      {flowState == "confirmCode" && (
        <div style={{ display: "ruby-text" }}>
          <h1>Delete Account</h1>
          <br />
          <form onSubmit={handleSubmit(onSubmitVerificationCode)}>
            <IonItem>
              <IonInput
                label="Verification Code"
                labelPlacement="floating"
                {...register("verificationCode", { required: true })}
              />
            </IonItem>
            <IonButton id="confirm-code-button" className="ion-margin-top" expand="block" type="submit">
              Confirm & Delete
            </IonButton>
          </form>
        </div>
      )}
    </>
  );
}

export default DeleteAccount;

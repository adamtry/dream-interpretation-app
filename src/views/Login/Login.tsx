import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { ConfirmationResult, RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { tryCreateDreamUser } from "../../data/DreamflowApi";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

export function Login() {
  const [flowState, setFlowState] = useState<"setNumber" | "confirmCode">("setNumber");
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
    confirmationResult
      .confirm(verificationCode)
      .then((result) => {
        tryCreateDreamUser().catch((error) => {
          console.error("Error creating dream user: ", error);
          auth.signOut();
        });
        console.log("Logged in: ", result.user);
      })
      .catch((error) => {
        console.error("Error logging in: ", error);
      });
  }

  interface FormData {
    phoneNumber: string;
  }
  function onSubmitPhoneNumber(data: any) {
    data = data as FormData;
    var phoneNumber = data.phoneNumber.toString();

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

  useIonViewDidEnter(() => {
    console.log("View did enter");
    if (!window.recaptchaVerifier) {
      console.log("Creating recaptchaVerifier");
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
    }
  });

  useIonViewWillLeave(() => {
    console.log("View will leave");
    if (window.recaptchaVerifier) {
      console.log("Clearing recaptchaVerifier");
      window.recaptchaVerifier.clear();
    }
  });

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
    }
  }, [window.recaptchaVerifier]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {flowState == "setNumber" && (
          <form onSubmit={handleSubmit(onSubmitPhoneNumber)}>
            <PhoneInput
              placeholder="Enter phone number"
              value={value}
              /* @ts-ignore */
              onChange={setValue}
              {...register("phoneNumber", { required: true })}
            />
            <div style={{ margin: "2em" }}>
              <div id="recaptcha-container"></div>
            </div>
            <IonButton id="sign-in-button" className="ion-margin-top" type="submit" expand="block">
              Log in
            </IonButton>
            <input type="submit" style={{ display: "none" }} />
          </form>
        )}
        {flowState == "confirmCode" && (
          <form onSubmit={handleSubmit(onSubmitVerificationCode)}>
            <IonItem>
              <IonInput
                label="Verification Code"
                labelPlacement="floating"
                {...register("verificationCode", { required: true })}
              />
            </IonItem>
            <IonButton id="confirm-code-button" className="ion-margin-top" expand="block" type="submit">
              Confirm code
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
}

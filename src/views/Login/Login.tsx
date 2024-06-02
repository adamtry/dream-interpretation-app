import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ConfirmationResult, RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { E164Number } from "libphonenumber-js";
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

function LoginContent() {
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
    <IonContent className="ion-padding" style={{ top: "20%" }}>
      <h1>Enter your phone number</h1>
      <p>Include your area code (e.g. +1 for USA)</p>
      {flowState == "setNumber" && (
        <form onSubmit={handleSubmit(onSubmitPhoneNumber)}>
          <PhoneInput
            value={value as E164Number}
            onChange={setValue}
            placeholder="Enter phone number"
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
  );
}

function Login() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <LoginContent />
      </IonContent>
    </IonPage>
  );
}

export default Login;

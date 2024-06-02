import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ConfirmationResult, RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { E164Number } from "libphonenumber-js";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { tryCreateDreamUser } from "../../data/DreamflowApi";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}

function onSubmitVerificationCode(data: any) {
  data = data as FormData;
  var verificationCode = data.verificationCode;
  var confirmationResult = window.confirmationResult;
  confirmationResult
    .confirm(verificationCode)
    .then((result) => {
      tryCreateDreamUser().catch((error) => {
        console.error("Error creating dream user: ", error);
        getAuth().signOut();
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
function onSubmitPhoneNumber(data: any, action: () => void) {
  const auth = getAuth();
  data = data as FormData;
  var phoneNumber = data.phoneNumber.toString();

  window.recaptchaVerifier.clear();
  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then((confirmationResult) => {
      console.log("Confirmation result: ", confirmationResult);
      window.confirmationResult = confirmationResult;
      action();
    })
    .catch((error) => {
      console.error("Error signing in: ", error);
    });
}

function LoginContent() {
  const [flowState, setFlowState] = useState<"setNumber" | "confirmCode">("setNumber");
  const auth = getAuth();
  auth.useDeviceLanguage();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {});
    }
  }, [window]);

  const initialvalue = import.meta.env.VITE_TEST_PHONE as E164Number;
  return (
    <IonContent className="ion-padding" style={{ top: "20%" }}>
      <h1>Enter your phone number</h1>
      <p>Include your area code (e.g. +1 for USA)</p>
      {flowState == "setNumber" && (
        <form onSubmit={handleSubmit((data) => onSubmitPhoneNumber(data, () => setFlowState("confirmCode")))}>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue={initialvalue}
            rules={{
              validate: (value) => value?.length && isValidPhoneNumber(value),
            }}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                value={value}
                onChange={onChange}
                placeholder="Enter phone number"
              />
            )}
          />
          <div style={{ margin: "2em" }}>
            <div id="recaptcha-container"></div>
          </div>
          {!isValid && <p style={{ color: "red" }}>Please ensure you entered a full valid phone number</p>}
          <IonButton id="sign-in-button" className="ion-margin-top" type="submit" expand="block" disabled={!isValid}>
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

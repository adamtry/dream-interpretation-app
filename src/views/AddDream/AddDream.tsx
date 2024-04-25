import { addDream } from "../../data/DB";
import { Dream, DreamReq } from "../../types/Dream";

import { useForm } from "react-hook-form";

import { RouteComponentProps } from "react-router-dom";
import DreamForm from "../_components/DreamForm";

interface AddDreamProps extends RouteComponentProps {
  addDreamCallback: (dream: Dream) => void;
}
function AddDream({ addDreamCallback, history, ...props }: AddDreamProps) {
  const form = useForm();

  function resetForm() {
    form.reset(
      {
        date: new Date().toISOString().split("T")[0],
        title: "",
        description: "",
      },
      { keepValues: false },
    );
  }

  async function submitAction(data: any) {
    const dreamData = data as DreamReq;
    dreamData.title = dreamData.title || "Untitled";
    await addDream(dreamData, addDreamCallback)
      .then(() => {
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding dream: ", error);
      })
      .finally(() => {
        history.goBack();
      });
  }

  return <DreamForm form={form} formTitle="Add Dream" submitAction={submitAction} redirect="/dreams" />;
}

export default AddDream;

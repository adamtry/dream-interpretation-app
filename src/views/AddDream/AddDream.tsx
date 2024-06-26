import { addDream } from "../../data/DreamflowApi";
import { DreamReq } from "../../types/Dream";

import { useForm } from "react-hook-form";

import { RouteComponentProps } from "react-router-dom";
import DreamForm from "../_components/DreamForm";

interface AddDreamProps extends RouteComponentProps {}
function AddDream({ history }: AddDreamProps) {
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
    await addDream(dreamData)
      .then((newDream) => {
        resetForm();
        history.push(`/dreams/view/${newDream.id}`);
      })
      .catch((error) => {
        console.error("Error adding dream: ", error);
        history.push("/dreams");
      });
  }

  return <DreamForm form={form} formTitle="Add Dream" submitAction={submitAction} />;
}

export default AddDream;

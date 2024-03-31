import React, { Dispatch, SetStateAction, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { addDream } from "../data/DB";
import { Dream } from "../types/Dream";

interface DreamDatePickerProps {
  date: string;
  setDate: Dispatch<SetStateAction<string>>;
}
function DreamDatePicker({ date, setDate }: DreamDatePickerProps) {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="dreamDate" className="form-label">
          Date
        </label>
        <input
          type="date"
          className="form-control"
          id="dreamDate"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
          }}
        />
      </div>
    </>
  );
}

interface AddDreamFormProps {
  addDreamCallback: (dream: Dream) => void;
}

export function AddDreamForm({ addDreamCallback }: AddDreamFormProps) {
  const [titleFieldValue, setTitleFieldValue] = useState("");
  const [descriptionFieldValue, setDescriptionFieldValue] = useState("");
  const [dateFieldValue, setDateFieldValue] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("Form submitted");
    if (!descriptionFieldValue) {
      alert("Please enter a description");
      return;
    }

    var resolvedTitle = titleFieldValue ? titleFieldValue : "Untitled";
    const dream = {
      title: resolvedTitle,
      description: descriptionFieldValue,
      date: dateFieldValue,
    } as Dream;
    await addDream(dream, addDreamCallback);
    // Clear form
    setTitleFieldValue("");
    setDescriptionFieldValue("");
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} onChange={() => setSubmitted(false)}>
      <div className="mb-3" style={{ maxWidth: "30em" }}>
        <label htmlFor="dreamTitle" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="dreamTitle"
          value={titleFieldValue}
          placeholder="Untitled"
          onChange={(event) => setTitleFieldValue(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="dreamDesc" className="form-label">
          Description
        </label>
        <TextareaAutosize
          className="form-control"
          id="dreamDesc"
          minRows={5}
          onChange={(event) => {
            setDescriptionFieldValue(event.target.value);
          }}
          value={descriptionFieldValue}
        ></TextareaAutosize>
      </div>

      <DreamDatePicker date={dateFieldValue} setDate={setDateFieldValue} />

      {submitted && (
        <div className="alert alert-success" role="alert">
          Dream submitted successfully!
        </div>
      )}

      <div className="d-flex justify-content-center">
        <button
          type="submit"
          className="btn btn-primary btn-circle btn-xl"
          style={{ fontSize: "2em", borderRadius: "50%", marginTop: "1em" }}
        >
          <i className="bi bi-floppy-fill"></i>
        </button>
      </div>
    </form>
  );
}

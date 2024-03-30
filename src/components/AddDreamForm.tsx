import React, { Dispatch, SetStateAction, useState } from "react";
import { addDream } from "./DB";

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

export function AddDreamForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("Form submitted");
    if (!description) {
      alert("Please enter a description");
      return;
    }

    if (!title) setTitle("Untitled");
    await addDream({ title, description, date });
    // Clear form
    setTitle("");
    setDescription("");
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3" style={{ maxWidth: "30em" }}>
        <label htmlFor="dreamTitle" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="dreamTitle"
          value={title}
          placeholder="Untitled"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="dreamDesc" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="dreamDesc"
          rows={15}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        ></textarea>
      </div>

      <DreamDatePicker date={date} setDate={setDate} />

      {submitted && (
        <div className="alert alert-success" role="alert">
          Dream submitted successfully!
        </div>
      )}

      {/* Center button horizontally */}
      <div className="d-flex justify-content-center">
        {/* Circular button with plus icon */}
        <button
          type="submit"
          className="btn btn-primary btn-circle btn-xl"
          style={{ fontSize: "2em", borderRadius: "50%", marginTop: "1em" }}
        >
          <i className="bi bi-plus-circle"></i>
        </button>
      </div>
    </form>
  );
}

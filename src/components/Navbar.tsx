import { useState } from "react";
import { AddDreamForm } from "./AddDreamForm";

export function MainMenu() {
  const [activeTab, setActiveTab] = useState("new-dream");
  return (
    <>
      <ul className="nav nav-tabs nav-fill" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-selected="true"
            onClick={() => {
              setActiveTab("new-dream");
            }}
          >
            <i className="bi bi-pencil-fill"></i> New Dream
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-selected="false"
            onClick={() => {
              setActiveTab("my-dreams");
            }}
          >
            <i className="bi bi-book-fill"></i> My Dreams
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className={
            "tab-pane fade" + (activeTab === "new-dream" ? " show active" : "")
          }
          id="home-tab-pane"
          role="tabpanel"
        >
          <div className="container">
            <AddDreamForm />
          </div>
        </div>
        <div
          className={
            "tab-pane fade" + (activeTab === "my-dreams" ? " show active" : "")
          }
          id="profile-tab-pane"
          role="tabpanel"
        >
          ...
        </div>
      </div>
    </>
  );
}

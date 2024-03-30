import { useEffect, useState } from "react";
import { getAllDreams } from "../data/DB";
import { Dream } from "../types/Dream";
import { AddDreamForm } from "./AddDreamForm";
import { MyDreams } from "./MyDreams";

export function MainMenu() {
  const [activeTab, setActiveTab] = useState("new-dream");
  const [dreams, setDreams] = useState<Dream[]>([]);

  function addDreamProp(dream: Dream) {
    setDreams([...dreams, dream]);
  }

  useEffect(() => {
    const initialDreams = getAllDreams();
    initialDreams.then((dreams) => {
      setDreams(dreams);
    });
  }, []);

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
            <AddDreamForm addDreamCallback={addDreamProp} />
          </div>
        </div>
        <div
          className={
            "tab-pane fade" + (activeTab === "my-dreams" ? " show active" : "")
          }
          id="profile-tab-pane"
          role="tabpanel"
        >
          <div className="container">
            <MyDreams dreams={dreams} />
          </div>
        </div>
      </div>
    </>
  );
}

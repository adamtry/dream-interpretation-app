import { useEffect, useState } from "react";
import { getAllDreams } from "../data/DB";
import { Dream } from "../types/Dream";
import { AddDreamForm } from "./AddDreamForm";
import { MyDreams } from "./MyDreams";

enum AppView {
  NewDream = "new-dream",
  MyDreams = "my-dreams",
}

interface NavItemProps {
  icon: string;
  ariaLabel: string;
  onClick: () => void;
  active: boolean;
}
function NavItem({ icon, ariaLabel, onClick, active }: NavItemProps) {
  if (!active) return <></>;
  return (
    <li className="nav-item">
      <button
        type="submit"
        className="btn btn-primary btn-circle btn-xl"
        aria-label={ariaLabel}
        style={{
          fontSize: "2em",
          borderRadius: "50%",
          margin: "1em",
          backgroundColor: "brown",
        }}
        onClick={onClick}
      >
        <i className={icon}></i>
      </button>
    </li>
  );
}

function MainMenu() {
  const [appView, setAppView] = useState(AppView.NewDream);
  const [dreams, setDreams] = useState<Dream[]>([]);

  function addDreamProp(dream: Dream) {
    var dr = [...dreams, dream];
    dr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDreams(dr);
    setAppView(AppView.MyDreams);
  }

  useEffect(() => {
    const initialDreams = getAllDreams();
    initialDreams.then((incomingDreams) => {
      var currentDreamIds = dreams.map((dream) => dream.id);
      var incomingDreamIds = incomingDreams.map((dream) => dream.id);
      var allSet =
        currentDreamIds.length === incomingDreamIds.length &&
        currentDreamIds.sort().join(",") === incomingDreamIds.sort().join(",");
      if (allSet) {
        console.log("No new dreams");
        return;
      }

      incomingDreams.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setDreams(incomingDreams);
    });
  }, [dreams]);

  var viewToRender = null;
  switch (appView) {
    case AppView.NewDream:
      viewToRender = <AddDreamForm addDreamCallback={addDreamProp} />;
      break;
    case AppView.MyDreams:
      viewToRender = <MyDreams dreams={dreams} />;
      break;
    default:
      viewToRender = <AddDreamForm addDreamCallback={addDreamProp} />;
      break;
  }

  return (
    <>
      <div className="container" style={{ marginBottom: "10em" }}>
        {viewToRender}
      </div>
      <div className="navbar fixed-bottom d-flex justify-content-end">
        <ul className="nav">
          <NavItem
            icon="bi bi-plus-circle"
            ariaLabel="Add dream"
            onClick={() => setAppView(AppView.NewDream)}
            active={appView !== AppView.NewDream}
          />

          <NavItem
            icon="bi bi-journal-text"
            ariaLabel="My dreams"
            onClick={() => setAppView(AppView.MyDreams)}
            active={appView !== AppView.MyDreams}
          />
        </ul>
      </div>
    </>
  );
}

export { MainMenu };

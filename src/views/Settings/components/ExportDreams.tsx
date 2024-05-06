import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { download } from "ionicons/icons";
import { getAllDreams } from "../../../data/DB";

function ExportDreams() {
  function exportDreamsToCSV() {
    console.log("Exporting dreams to CSV...");
    getAllDreams().then((dreams) => {
      const csv =
        "date,title,description\n" +
        dreams
          .map((dream) => {
            return `${dream.date},${dream.title},${dream.description}`;
          })
          .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dreams.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  return (
    <IonItem button={true} onClick={exportDreamsToCSV}>
      <IonIcon icon={download} slot="start"></IonIcon>
      <IonLabel>Export Dreams to CSV</IonLabel>
    </IonItem>
  );
}

export default ExportDreams;

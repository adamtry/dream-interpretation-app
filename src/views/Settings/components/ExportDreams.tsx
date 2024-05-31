import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { download } from "ionicons/icons";
import { getAllDreams } from "../../../data/DreamflowApi";

function ExportDreams() {
  function cleanField(field: string) {
    return field
      .replace(/\n/g, " ")
      .replace(/\t/g, " ")
      .replace(/\r/g, " ")
      .replace(/\r\n/g, " ")
      .replace("\\", "\\\\");
  }

  function exportDreamsToTSV() {
    console.log("Exporting dreams to TSV...");
    getAllDreams().then((dreams) => {
      const tsv =
        "date\ttitle\tdescription\n" +
        dreams
          .map((dream) => {
            return `${dream.date}\t${cleanField(dream.title)}\t${cleanField(dream.description)}`;
          })
          .join("\n");

      const blob = new Blob([tsv], { type: "text/tsv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dreams.tsv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  return (
    <IonItem button={true} onClick={exportDreamsToTSV}>
      <IonIcon icon={download} slot="start"></IonIcon>
      <IonLabel>Export Dreams to TSV</IonLabel>
    </IonItem>
  );
}

export default ExportDreams;

import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { Link } from "react-router-dom";
import { Dream } from "../../../types/Dream";

export function DreamCard(dream: Dream) {
  var formattedDate = new Date(dream.date).toLocaleDateString();
  return (
    <Link to={`/dreams/${dream.id}`} style={{ textDecoration: "none" }}>
      <IonCard key={dream.id}>
        <IonCardContent>
          <IonCardTitle>{dream.title}</IonCardTitle>
          <p>{dream.description}</p>
          <IonCardSubtitle>{formattedDate}</IonCardSubtitle>
        </IonCardContent>
      </IonCard>
    </Link>
  );
}

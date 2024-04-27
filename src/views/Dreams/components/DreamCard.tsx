import { IonCard, IonCardContent, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import { Link } from "react-router-dom";
import { Dream } from "../../../types/Dream";

export function DreamCard(dream: Dream) {
  var formattedDate = new Date(dream.date).toLocaleDateString();
  const linkUrl = `/dreams/view/${dream.id}`;
  return (
    <Link
      to={{
        pathname: linkUrl,
        state: {
          dream: dream,
        },
      }}
      style={{ textDecoration: "none" }}
    >
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

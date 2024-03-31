import { Dream } from "../types/Dream";

function DreamCard(dream: Dream) {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <span className="fw-bold">{dream.date}</span>
      </div>
      <div className="card-body">
        <u>
          <h5 className="card-title">{dream.title}</h5>
        </u>
        <p className="card-text">{dream.description}</p>
      </div>
    </div>
  );
}

interface MyDreamsProps {
  dreams: Dream[];
}
export function MyDreams({ dreams }: MyDreamsProps) {
  return (
    <>
      {dreams.map((dream) => (
        <DreamCard {...dream} key={dream.id} />
      ))}
    </>
  );
}

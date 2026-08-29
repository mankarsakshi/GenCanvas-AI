function ActionCard({ title, description }) {
  return (

    <div className="action-card">

      <h3>{title}</h3>

      <p>{description}</p>

      <button>Open</button>

    </div>

  );
}

export default ActionCard;
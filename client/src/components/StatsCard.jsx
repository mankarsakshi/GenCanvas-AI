function StatsCard({ title, value }) {
  return (

    <div className="stats-card">

      <h3>{value}</h3>

      <p>{title}</p>

    </div>

  );
}

export default StatsCard;
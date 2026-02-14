export default function StatsCard({ title, value, type = 'default' }) {
  return (
    <div className={`stats-card ${type}`}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}


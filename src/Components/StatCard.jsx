export default function StatCard({
  title,
  value,
  type,
  icon,
}) {
  return (
    <div
      className={`stat-card ${type || ""}`}
    >
      <div className="stat-card-top">
        <span>{title}</span>

        {icon}
      </div>

      <strong>
        {value}
      </strong>
    </div>
  );
}
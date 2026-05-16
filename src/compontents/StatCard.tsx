type Props = {
  title: string;
  value: string;
  accent?: boolean;
};

export default function StatCard({ title, value, accent = false }: Props) {
  return (
    <div className={`stat-card ${accent ? "accent" : ""}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
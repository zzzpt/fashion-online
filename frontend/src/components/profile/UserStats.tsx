interface StatItem {
  label: string;
  value: string;
}

interface UserStatsProps {
  stats: StatItem[];
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center py-3 rounded-xl bg-gray-50"
        >
          <p className="text-xl font-bold text-gray-700">{stat.value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
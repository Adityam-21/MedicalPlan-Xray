function ProbabilityBar({ label, value }) {
  const colors = {
    Low: "bg-green-500",
    Medium: "bg-yellow-400",
    High: "bg-red-500",
  };

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span>{value.toFixed(2)}%</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colors[label]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default ProbabilityBar;
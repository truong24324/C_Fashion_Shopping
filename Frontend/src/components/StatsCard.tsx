import React from "react";
import Card from "./UI/Card";

interface StatsCardProps {
  title: string;
  value: string;
  color?: string;
  change?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, change }) => {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {change && <p className="text-sm">{change}</p>}
    </Card>
  );
};

export default StatsCard;

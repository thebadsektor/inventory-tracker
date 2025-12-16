import { Package, CheckCircle2, ArrowRightLeft, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalItems: number;
  checkedIn: number;
  checkedOut: number;
  recentScans: number;
}

export function StatsCards({ totalItems, checkedIn, checkedOut, recentScans }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Checked In",
      value: checkedIn,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Checked Out",
      value: checkedOut,
      icon: ArrowRightLeft,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Scans Today",
      value: recentScans,
      icon: Clock,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-3xl font-bold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
            <stat.icon className={`h-12 w-12 ${stat.color} opacity-80`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  children?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, children, className }: StatCardProps) {
  return (
    <Card className={cn("bg-card text-card-foreground overflow-hidden", className)}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{value}</span>
            {change && <span className="text-xs text-success">{change}</span>}
          </div>
          <div className="pt-2 h-24">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

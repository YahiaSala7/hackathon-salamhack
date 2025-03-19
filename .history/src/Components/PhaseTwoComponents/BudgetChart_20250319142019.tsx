import { FC } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#5F6368"];

interface BudgetEntry {
  name: string;
  value: number;
}

interface BudgetChartProps {
  budgetDistribution: BudgetEntry[];
}

const BudgetChart: FC<BudgetChartProps> = ({ budgetDistribution }) => {
  return (
    <div className="mb-12 sm:mb-16">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 sm:mb-8 text-center text-heading">
        Budget Distribution Across Rooms
      </h2>
      <div className="flex flex-col mx-auto">
        <div className="lg:h-[450px] sm:h-[350px] h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetDistribution}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="70%"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}>
                {budgetDistribution.map((entry: BudgetEntry, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mt-6 sm:mt-8 px-4">
          {budgetDistribution.map((entry: BudgetEntry, index: number) => (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-background rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-xs sm:text-sm md:text-base text-text">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetChart;

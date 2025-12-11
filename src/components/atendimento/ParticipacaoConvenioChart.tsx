import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Barros Saúde", value: 28.5, color: "hsl(200 56% 25%)" },
  { name: "Cliente Especial", value: 20.2, color: "hsl(161 51% 43%)" },
  { name: "Unimed", value: 24.5, color: "hsl(40 75% 55%)" },
  { name: "Bradesco Saúde", value: 18.0, color: "hsl(280 40% 55%)" },
  { name: "Amil", value: 8.8, color: "hsl(200 40% 45%)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-premium p-3">
        <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-sm font-medium" style={{ color: payload[0].payload.color }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const ParticipacaoConvenioChart = () => {
  return (
    <div className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: "250ms", animationFillMode: "both" }}>
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Participação por Convênio (%)</h3>
        <p className="text-xs text-muted-foreground mt-1">Percentual de participação de cada convênio</p>
      </div>
      
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
            <span className="text-xs font-semibold text-foreground ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipacaoConvenioChart;

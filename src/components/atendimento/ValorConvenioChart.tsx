import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Barros Saúde", value: 45280.50 },
  { name: "Cliente Especial", value: 32150.00 },
  { name: "Unimed", value: 38920.75 },
  { name: "Bradesco Saúde", value: 28640.25 },
  { name: "Amil", value: 14230.00 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-premium p-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-sm text-primary font-medium">
          R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

const ValorConvenioChart = () => {
  return (
    <div className="card-premium p-6 animate-fade-in-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">Valor por Convênio (R$)</h3>
        <p className="text-xs text-muted-foreground mt-1">Distribuição de valor total por convênio</p>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            <Bar 
              dataKey="value" 
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="hsl(var(--primary))" opacity={0.85 - index * 0.1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-3 h-3 rounded-sm bg-primary" />
        <span className="text-xs text-muted-foreground font-medium">Valor Total</span>
      </div>
    </div>
  );
};

export default ValorConvenioChart;

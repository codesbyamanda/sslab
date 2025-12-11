const tableData = [
  { convenio: "BARROS SAÚDE", requisicoes: 145, exames: 312, valor: 45280.50, participacao: 28.5 },
  { convenio: "CLIENTE ESPECIAL", requisicoes: 98, exames: 215, valor: 32150.00, participacao: 20.2 },
  { convenio: "UNIMED", requisicoes: 132, exames: 289, valor: 38920.75, participacao: 24.5 },
  { convenio: "BRADESCO SAÚDE", requisicoes: 87, exames: 198, valor: 28640.25, participacao: 18.0 },
  { convenio: "AMIL", requisicoes: 52, exames: 118, valor: 14230.00, participacao: 8.8 },
];

const totals = {
  requisicoes: 514,
  exames: 1132,
  valor: 159221.50,
  participacao: 100.0
};

const AtendimentosTable = () => {
  return (
    <div className="card-premium overflow-hidden animate-fade-in-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Atendimentos por Convênio</h3>
        <p className="text-xs text-muted-foreground mt-1">Resumo dos atendimentos por convênio conforme filtros selecionados</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                Convênio/Plano
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                Requisições
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                Exames
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                Valor Total (R$)
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                Participação (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr 
                key={row.convenio}
                className={`border-b border-border/50 transition-colors duration-100 hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
              >
                <td className="px-5 py-4 text-sm font-semibold text-foreground">
                  {row.convenio}
                </td>
                <td className="px-5 py-4 text-sm text-foreground text-right tabular-nums">
                  {row.requisicoes.toLocaleString('pt-BR')}
                </td>
                <td className="px-5 py-4 text-sm text-foreground text-right tabular-nums">
                  {row.exames.toLocaleString('pt-BR')}
                </td>
                <td className="px-5 py-4 text-sm text-foreground text-right tabular-nums">
                  {row.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-4 text-sm text-foreground text-right tabular-nums">
                  {row.participacao.toFixed(1)}%
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-primary/5 border-t-2 border-primary/20">
              <td className="px-5 py-4 text-sm font-bold text-primary">
                TOTAL GERAL
              </td>
              <td className="px-5 py-4 text-sm font-bold text-primary text-right tabular-nums">
                {totals.requisicoes.toLocaleString('pt-BR')}
              </td>
              <td className="px-5 py-4 text-sm font-bold text-primary text-right tabular-nums">
                {totals.exames.toLocaleString('pt-BR')}
              </td>
              <td className="px-5 py-4 text-sm font-bold text-primary text-right tabular-nums">
                {totals.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-5 py-4 text-sm font-bold text-primary text-right tabular-nums">
                {totals.participacao.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AtendimentosTable;

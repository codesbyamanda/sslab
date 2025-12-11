import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import RecentExamsTable from "@/components/dashboard/RecentExamsTable";
import QuickActions from "@/components/dashboard/QuickActions";
import { Users, FlaskConical, FileCheck, Clock } from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Pacientes Ativos"
          value="1.248"
          change="+12% este mês"
          changeType="positive"
          icon={Users}
          iconColor="bg-petroleo"
        />
        <StatCard
          title="Exames Realizados"
          value="3.567"
          change="+8% este mês"
          changeType="positive"
          icon={FlaskConical}
          iconColor="bg-verde-clinico"
        />
        <StatCard
          title="Laudos Emitidos"
          value="2.891"
          change="+5% este mês"
          changeType="positive"
          icon={FileCheck}
          iconColor="bg-ambar-suave"
        />
        <StatCard
          title="Tempo Médio"
          value="24h"
          change="-2h vs. anterior"
          changeType="positive"
          icon={Clock}
          iconColor="bg-petroleo-light"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams - 2 columns */}
        <div className="lg:col-span-2">
          <RecentExamsTable />
        </div>

        {/* Quick Actions - 1 column */}
        <div>
          <QuickActions />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

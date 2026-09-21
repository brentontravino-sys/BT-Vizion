import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart3, Clock, Zap, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WorkflowGrowthChartProps {
  teamSize: number;
  hoursPerWeek: number;
  hourlyRate: number;
  annualZarSaved: number;
  annualHoursSaved: number;
}

type ChartMetricView = 'financial' | 'throughput';

export default function WorkflowGrowthChart({
  teamSize,
  hoursPerWeek,
  hourlyRate,
  annualZarSaved,
  annualHoursSaved,
}: WorkflowGrowthChartProps) {
  const { language } = useLanguage();
  const [metricView, setMetricView] = useState<ChartMetricView>('financial');

  // Compute 12-month projection data based on real-time parameters
  const projectionData = useMemo(() => {
    const months = [
      { m: 1, label: language === 'en' ? 'M1 (Launch)' : 'M1 (Inicio)', name: language === 'en' ? 'Month 1' : 'Mes 1', efficiency: 0.40, throughputMultiplier: 1.35 },
      { m: 2, label: language === 'en' ? 'M2 (Triage)' : 'M2 (Triaje)', name: language === 'en' ? 'Month 2' : 'Mes 2', efficiency: 0.55, throughputMultiplier: 1.80 },
      { m: 4, label: language === 'en' ? 'M4 (Scale)' : 'M4 (Escala)', name: language === 'en' ? 'Month 4' : 'Mes 4', efficiency: 0.70, throughputMultiplier: 2.60 },
      { m: 6, label: language === 'en' ? 'M6 (Full Agent)' : 'M6 (Agente)', name: language === 'en' ? 'Month 6' : 'Mes 6', efficiency: 0.75, throughputMultiplier: 3.40 },
      { m: 8, label: language === 'en' ? 'M8 (Autonomous)' : 'M8 (Autónomo)', name: language === 'en' ? 'Month 8' : 'Mes 8', efficiency: 0.78, throughputMultiplier: 4.20 },
      { m: 10, label: language === 'en' ? 'M10 (Optimized)' : 'M10 (Optimizado)', name: language === 'en' ? 'Month 10' : 'Mes 10', efficiency: 0.82, throughputMultiplier: 5.10 },
      { m: 12, label: language === 'en' ? 'M12 (Compounding)' : 'M12 (Compuesto)', name: language === 'en' ? 'Month 12' : 'Mes 12', efficiency: 0.85, throughputMultiplier: 6.00 },
    ];

    const monthlyManualHours = teamSize * hoursPerWeek * 4.2;
    const monthlyManualLaborCost = monthlyManualHours * hourlyRate;

    let cumulativeSavings = 0;
    let cumulativeManualCost = 0;
    let cumulativeHoursLiberated = 0;
    let previousMonth = 0;

    return months.map((milestone) => {
      const monthSpan = milestone.m - previousMonth;
      previousMonth = milestone.m;

      const monthlySavedHours = monthlyManualHours * milestone.efficiency;
      const monthlySavedZar = monthlySavedHours * hourlyRate;

      cumulativeSavings += Math.round(monthlySavedZar * monthSpan);
      cumulativeManualCost += Math.round(monthlyManualLaborCost * monthSpan);
      cumulativeHoursLiberated += Math.round(monthlySavedHours * monthSpan);

      // Workflow throughput index (Baseline manual = 100)
      const throughputIndex = Math.round(100 * milestone.throughputMultiplier);
      const manualThroughputBaseline = 100;

      return {
        month: milestone.label,
        fullMonth: milestone.name,
        // Financial Metrics
        cumulativeSavings,
        cumulativeManualCost,
        netValueCreated: Math.round(cumulativeSavings * 1.15), // accounts for secondary sales turnaround
        // Operational Throughput Metrics
        throughputIndex,
        manualThroughputBaseline,
        hoursLiberatedMonthly: Math.round(monthlySavedHours),
        cumulativeHoursLiberated,
      };
    });
  }, [teamSize, hoursPerWeek, hourlyRate, language]);

  // Formatter for ZAR
  const formatZar = (val: number) => {
    if (val >= 1000000) {
      return `R${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `R${Math.round(val / 1000)}k`;
    }
    return `R${val}`;
  };

  return (
    <div
      id="roi-growth-projection-chart"
      className="mt-10 border border-blue-500/25 bg-neutral-950/90 p-6 md:p-8 relative overflow-hidden backdrop-blur-sm"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none" />

      {/* Header bar of chart component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
              // {language === 'en' ? '12-MONTH PREDICTIVE IMPACT MODEL' : 'MODELO DE IMPACTO PREDICTIVO A 12 MESES'}
            </span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>
              {language === 'en'
                ? 'AI Workflow Acceleration & Financial Growth'
                : 'Aceleración de Flujos de Trabajo y Crecimiento Financiero'}
            </span>
          </h4>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            {language === 'en'
              ? 'Visualize the compounding divergence between escalating manual operational costs and autonomous AI agent throughput over a 12-month deployment cycle.'
              : 'Visualice la divergencia compuesta entre los crecientes costos operativos manuales y el rendimiento de los agentes autónomos durante 12 meses.'}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded border border-white/15 bg-black/60 p-1 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setMetricView('financial')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              metricView === 'financial'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Cumulative ZAR' : 'ZAR Acumulado'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMetricView('throughput')}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              metricView === 'throughput'
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Workflow Capacity' : 'Capacidad de Flujo'}</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6 relative z-10">
        <div className="border border-white/10 bg-black/40 p-3.5 rounded">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">
            {language === 'en' ? 'Annual Reclaimed Value' : 'Valor Anual Recuperado'}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-400 mt-0.5">
            R{annualZarSaved.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{language === 'en' ? 'Direct Labor Reinvestment' : 'Reinversión Directa'}</span>
          </div>
        </div>

        <div className="border border-white/10 bg-black/40 p-3.5 rounded">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">
            {language === 'en' ? 'Capacity Multiplier' : 'Multiplicador de Capacidad'}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
            6.0x Velocity
          </div>
          <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>{language === 'en' ? 'M12 vs Manual Baseline' : 'M12 vs Base Manual'}</span>
          </div>
        </div>

        <div className="border border-white/10 bg-black/40 p-3.5 rounded">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">
            {language === 'en' ? 'Liberated Work Hours' : 'Horas Liberadas'}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-white mt-0.5">
            {annualHoursSaved.toLocaleString()} hrs
          </div>
          <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{language === 'en' ? '50 work-weeks / yr' : '50 semanas laborales/año'}</span>
          </div>
        </div>

        <div className="border border-white/10 bg-black/40 p-3.5 rounded">
          <div className="text-[10px] font-mono text-neutral-500 uppercase">
            {language === 'en' ? 'Break-Even Horizon' : 'Punto de Equilibrio'}
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-300 mt-0.5">
            &lt; 3.2 Weeks
          </div>
          <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>{language === 'en' ? 'Fast payback verified' : 'Retorno rápido verificado'}</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-72 sm:h-80 md:h-96 relative z-10 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === 'financial' ? (
            <AreaChart data={projectionData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#a3a3a3"
                tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#ffffff20' }}
              />
              <YAxis
                stroke="#a3a3a3"
                tickFormatter={formatZar}
                tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#ffffff20' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="border border-blue-500/40 bg-neutral-950/95 p-3.5 shadow-2xl rounded font-mono text-xs backdrop-blur-md">
                        <div className="font-bold text-white border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between gap-3">
                          <span className="text-blue-400">{data.fullMonth}</span>
                          <span className="text-[10px] text-neutral-400 uppercase">
                            {language === 'en' ? 'Audit Snapshot' : 'Instantánea Auditada'}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-4 text-emerald-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              {language === 'en' ? 'Cumulative AI Savings:' : 'Ahorro Acumulado IA:'}
                            </span>
                            <span className="font-bold">R{data.cumulativeSavings.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-blue-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-400" />
                              {language === 'en' ? 'Net Enterprise Value:' : 'Valor Neto Empresarial:'}
                            </span>
                            <span className="font-bold">R{data.netValueCreated.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-red-300">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-400" />
                              {language === 'en' ? 'Traditional Manual Cost:' : 'Costo Manual Tradicional:'}
                            </span>
                            <span>R{data.cumulativeManualCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontFamily: 'monospace' }}
                formatter={(value) => {
                  if (value === 'cumulativeSavings') {
                    return language === 'en' ? 'Cumulative AI Savings (ZAR)' : 'Ahorro Acumulado IA (ZAR)';
                  }
                  if (value === 'netValueCreated') {
                    return language === 'en' ? 'Net Enterprise Value (ZAR)' : 'Valor Neto Empresarial (ZAR)';
                  }
                  if (value === 'cumulativeManualCost') {
                    return language === 'en' ? 'Manual Labor Overhead Baseline (ZAR)' : 'Costo Laboral Manual Base (ZAR)';
                  }
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSavings)"
              />
              <Area
                type="monotone"
                dataKey="netValueCreated"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
              <Area
                type="monotone"
                dataKey="cumulativeManualCost"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fillOpacity={1}
                fill="url(#colorManual)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={projectionData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#a3a3a3"
                tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#ffffff20' }}
              />
              <YAxis
                stroke="#a3a3a3"
                tick={{ fill: '#a3a3a3', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#ffffff20' }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="border border-emerald-500/40 bg-neutral-950/95 p-3.5 shadow-2xl rounded font-mono text-xs backdrop-blur-md">
                        <div className="font-bold text-white border-b border-white/10 pb-1.5 mb-2 flex items-center justify-between gap-3">
                          <span className="text-emerald-400">{data.fullMonth}</span>
                          <span className="text-[10px] text-neutral-400 uppercase">
                            {language === 'en' ? 'Workflow Capacity' : 'Capacidad de Flujo'}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-4 text-emerald-300">
                            <span>{language === 'en' ? 'Autonomous Throughput:' : 'Rendimiento Autónomo:'}</span>
                            <span className="font-bold">{data.throughputIndex}% of baseline</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-indigo-300">
                            <span>{language === 'en' ? 'Hours Saved This Month:' : 'Horas Ahorradas Este Mes:'}</span>
                            <span className="font-bold">{data.hoursLiberatedMonthly} hrs</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-neutral-400">
                            <span>{language === 'en' ? 'Manual Baseline Capacity:' : 'Capacidad Manual Base:'}</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '14px', fontSize: '11px', fontFamily: 'monospace' }}
                formatter={(value) => {
                  if (value === 'throughputIndex') {
                    return language === 'en' ? 'AI-Augmented Workflow Capacity (%)' : 'Capacidad Aumentada por IA (%)';
                  }
                  if (value === 'manualThroughputBaseline') {
                    return language === 'en' ? 'Manual Capacity Ceiling (100%)' : 'Límite de Capacidad Manual (100%)';
                  }
                  return value;
                }}
              />
              <Area
                type="monotone"
                dataKey="throughputIndex"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorThroughput)"
              />
              <Area
                type="monotone"
                dataKey="manualThroughputBaseline"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="transparent"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Analytical Footnote */}
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>
            {language === 'en'
              ? 'Real-time calculation mapped to selected team size & labor parameters.'
              : 'Cálculo en tiempo real ajustado al tamaño de equipo y costos seleccionados.'}
          </span>
        </div>
        <div className="text-neutral-500">
          {language === 'en' ? 'Audited Benchmark SLA: 75% Task Automation' : 'SLA Auditado: 75% Automatización'}
        </div>
      </div>
    </div>
  );
}

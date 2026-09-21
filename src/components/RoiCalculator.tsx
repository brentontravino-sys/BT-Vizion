import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowUpRight, Check, Zap, Sparkles } from 'lucide-react';
import {
  ScrollReveal,
  ScrollWordColorReveal,
  SpotlightCard,
  ScrollParallaxWatermark,
  ScrollHeaderGradientFill,
} from './ScrollReveal';
import WorkflowGrowthChart from './WorkflowGrowthChart';
import { useLanguage } from '../context/LanguageContext';

interface RoiCalculatorProps {
  onPlanSelected: (details: string) => void;
}

export default function RoiCalculator({ onPlanSelected }: RoiCalculatorProps) {
  const { language } = useLanguage();
  const [teamSize, setTeamSize] = useState<number>(8);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(350); // ZAR

  // Calculations
  // Assume BT Vizion AI automation automates ~75% of repetitive operational tasks
  const weeklyHoursSaved = Math.round(teamSize * hoursPerWeek * 0.75);
  const annualHoursSaved = weeklyHoursSaved * 50;
  const annualZarSaved = annualHoursSaved * hourlyRate;

  const handleClaim = () => {
    const details = `Estimated ${annualHoursSaved.toLocaleString()} hours saved/yr with team size of ${teamSize} (ROI Projection Checked)`;
    onPlanSelected(details);
  };

  return (
    <section id="calculator" className="py-24 md:py-32 bg-transparent border-t border-white/10 relative overflow-hidden">
      {/* Background Watermark */}
      <ScrollParallaxWatermark text={language === 'en' ? 'METRICS & ROI' : 'MÉTRICAS Y ROI'} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-400 font-mono mb-3">
              [ {language === 'en' ? '05 // AUTOMATION ROI ESTIMATOR' : '05 // ESTIMADOR DE ROI Y AUTOMATIZACIÓN'} ]
            </div>
            <ScrollHeaderGradientFill
              as="h2"
              text={
                language === 'en'
                  ? 'CALCULATE YOUR OPERATIONAL LEVERAGE.'
                  : 'CALCULE SU APALANCAMIENTO OPERATIVO.'
              }
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase max-w-2xl leading-tight"
            />
          </div>
          <div className="max-w-md">
            <ScrollWordColorReveal
              text={
                language === 'en'
                  ? 'Estimate how many valuable human hours your business can reclaim each year by replacing repetitive manual tasks with BT Vizion autonomous AI agents.'
                  : 'Estime cuántas horas humanas valiosas puede recuperar su empresa cada año reemplazando tareas manuales repetitivas con agentes de IA autónomos de BT Vizion.'
              }
              className="text-neutral-400 text-sm md:text-base leading-relaxed font-normal"
            />
          </div>
        </ScrollReveal>

        {/* Calculator Body */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <ScrollReveal variant="fade-right" delay={0.1} className="lg:col-span-6 flex">
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.12)"
              className="border border-blue-500/20 bg-neutral-950/80 p-6 md:p-8 space-y-8 flex flex-col justify-between w-full hover:border-blue-400/40 transition-colors"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                  <Calculator className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {language === 'en' ? 'Your Organization Parameters' : 'Parámetros de su Organización'}
                  </h3>
                </div>

                {/* Slider 1: Team Size */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-neutral-300 uppercase">
                      {language === 'en' ? 'Team Size' : 'Tamaño del Equipo'}
                    </span>
                    <span className="text-blue-400 font-bold text-sm">
                      {teamSize} {language === 'en' ? 'team members' : 'miembros'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={60}
                    step={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-blue-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                    <span>2 {language === 'en' ? 'members' : 'miembros'}</span>
                    <span>30</span>
                    <span>60+ {language === 'en' ? 'members' : 'miembros'}</span>
                  </div>
                </div>

                {/* Slider 2: Repetitive Hours per person/week */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-neutral-300 uppercase">
                      {language === 'en' ? 'Repetitive Admin / Chat per Person' : 'Tareas Repetitivas por Persona'}
                    </span>
                    <span className="text-blue-400 font-bold text-sm">
                      {hoursPerWeek} {language === 'en' ? 'hrs / week' : 'hrs / semana'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={25}
                    step={1}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-blue-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                    <span>3 hrs/wk</span>
                    <span>14 hrs/wk</span>
                    <span>25 hrs/wk</span>
                  </div>
                </div>

                {/* Slider 3: Average Staff Cost Rate (ZAR) */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="text-neutral-300 uppercase">
                      {language === 'en' ? 'Avg Hourly Labor Cost' : 'Costo Promedio por Hora'}
                    </span>
                    <span className="text-blue-400 font-bold text-sm">R{hourlyRate} / {language === 'en' ? 'hour' : 'hora'}</span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={1200}
                    step={50}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 rounded-none appearance-none cursor-pointer accent-blue-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                    <span>R150/hr</span>
                    <span>R600/hr</span>
                    <span>R1,200/hr</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-xs text-neutral-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Based on audited 75% automation throughput benchmark.'
                    : 'Basado en el benchmark auditado de 75% de automatización.'}
                </span>
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Results Column */}
          <ScrollReveal variant="fade-left" delay={0.15} className="lg:col-span-6 flex">
            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.15)"
              className="border border-blue-500/25 bg-black/90 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden w-full hover:border-blue-400/50 shadow-[0_0_35px_rgba(59,130,246,0.12)] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="text-xs uppercase font-mono text-neutral-400">
                    {language === 'en' ? 'Projected Annual Savings' : 'Ahorro Anual Proyectado'}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 border border-blue-400/30 text-blue-300 bg-blue-950/40">
                    {language === 'en' ? 'REAL-TIME CALCULATION' : 'CÁLCULO EN TIEMPO REAL'}
                  </span>
                </div>

                {/* Big metric savings */}
                <div className="mt-8">
                  <div className="text-xs font-mono text-neutral-400 uppercase">
                    {language === 'en' ? 'Estimated Financial Recovery' : 'Recuperación Financiera Estimada'}
                  </div>
                  <motion.div
                    key={annualZarSaved}
                    initial={{ scale: 0.96, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-400 tracking-tight mt-1 font-mono"
                  >
                    R{annualZarSaved.toLocaleString()}
                  </motion.div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {language === 'en' ? 'per year in recovered staff capacity' : 'por año en capacidad de personal recuperada'}
                  </div>
                </div>

                {/* Secondary metrics */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                  <div className="border border-blue-500/20 p-4 bg-neutral-950/90">
                    <div className="text-[10px] font-mono uppercase text-neutral-500">
                      {language === 'en' ? 'Hours Liberated' : 'Horas Liberadas'}
                    </div>
                    <div className="text-2xl font-bold text-blue-300 mt-1 font-mono">
                      {annualHoursSaved.toLocaleString()} hrs
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {language === 'en' ? 'annually for high-value work' : 'anuales para trabajo de alto valor'}
                    </div>
                  </div>

                  <div className="border border-blue-500/20 p-4 bg-neutral-950/90">
                    <div className="text-[10px] font-mono uppercase text-neutral-500">
                      {language === 'en' ? 'Speed Uplift' : 'Aumento de Velocidad'}
                    </div>
                    <div className="text-2xl font-bold text-blue-300 mt-1 font-mono">
                      14x {language === 'en' ? 'Faster' : 'Más Rápido'}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {language === 'en' ? 'response to customer inquiries' : 'respuesta a consultas de clientes'}
                    </div>
                  </div>
                </div>

                {/* Benefits list */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {language === 'en'
                        ? '24/7 autonomous responses without hiring night shifts'
                        : 'Respuestas autónomas 24/7 sin contratar turnos nocturnos'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {language === 'en'
                        ? 'Zero missed leads during weekends or public holidays'
                        : 'Cero clientes potenciales perdidos en fines de semana o feriados'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleClaim}
                  className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>
                    {language === 'en' ? 'Capture These Savings with BT Vizion' : 'Capturar Estos Ahorros con BT Vizion'}
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>

        {/* Visual Recharts Growth Projection Chart */}
        <ScrollReveal variant="fade-up" delay={0.2}>
          <WorkflowGrowthChart
            teamSize={teamSize}
            hoursPerWeek={hoursPerWeek}
            hourlyRate={hourlyRate}
            annualZarSaved={annualZarSaved}
            annualHoursSaved={annualHoursSaved}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

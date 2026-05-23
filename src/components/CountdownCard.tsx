import React, { useState, useEffect } from "react";
import { ExamDetails } from "../types";
import { Clock, Calendar, Award, AlertCircle, Sparkles, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CountdownCardProps {
  exam: ExamDetails;
  advice: string[];
}

export default function CountdownCard({ exam, advice }: CountdownCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0,
    totalMs: 0
  });

  // Baselines to calculate study percentage completed
  // ATA AÖF: study period starts March 1, 2026
  // KPSS: study period starts Jan 1, 2026
  const baselineDate = exam.id === "ata-aof" 
    ? new Date("2026-03-01T00:00:00+03:00").getTime() 
    : new Date("2026-01-01T00:00:00+03:00").getTime();

  useEffect(() => {
    const targetTime = new Date(exam.date).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0, totalMs: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const ms = Math.floor((diff % 1000) / 100); // Tenths of seconds for high energy display

      setTimeLeft({ days, hours, minutes, seconds, ms, totalMs: diff });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100); // Update every 100ms for accurate sub-seconds

    return () => clearInterval(interval);
  }, [exam.date]);

  // Calculate percentage of time passed in study schedule
  const getProgressPercentage = () => {
    const targetTime = new Date(exam.date).getTime();
    const totalDuration = targetTime - baselineDate;
    const elapsed = Date.now() - baselineDate;
    if (elapsed <= 0) return 0;
    const percent = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(Math.round(percent * 10) / 10, 0), 100);
  };

  const progressPercent = getProgressPercentage();
  const daysString = String(timeLeft.days).padStart(2, "0");
  const hoursString = String(timeLeft.hours).padStart(2, "0");
  const minutesString = String(timeLeft.minutes).padStart(2, "0");
  const secondsString = String(timeLeft.seconds).padStart(2, "0");

  const [activeAdviceIndex, setActiveAdviceIndex] = useState(0);

  useEffect(() => {
    const adviceInterval = setInterval(() => {
      setActiveAdviceIndex((prev) => (prev + 1) % advice.length);
    }, 12000);
    return () => clearInterval(adviceInterval);
  }, [advice.length]);

  return (
    <div className="relative group overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md p-6 lg:p-8 transition-all hover:border-slate-700/80">
      {/* Background glow matching exam theme colors */}
      <div className={`absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${exam.color} opacity-10 blur-3xl transition-all group-hover:opacity-15`} />

      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-rose-500/10 md:border-slate-800/60 pb-5 mb-6">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r ${exam.color} text-white shadow-sm`}>
            <Award className="w-3.5 h-3.5" />
            {exam.name === "ATA AÖF Final" ? "AÖF Bahar Dönemi" : "Kamu Personeli Seçme"}
          </span>
          <h3 className="mt-3 text-xl lg:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
            {exam.fullName}
          </h3>
          <p className="mt-1 text-sm text-slate-400 font-normal">
            {exam.description}
          </p>
        </div>
        
        <div className="text-left md:text-right shrink-0">
          <div className="text-xs text-slate-500 uppercase font-mono tracking-wider">Sınav Zamanı</div>
          <div className="text-slate-200 font-semibold font-mono flex items-center gap-2 mt-1 md:justify-end">
            <Calendar className="w-4 h-4 text-slate-400" />
            {new Date(exam.date).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </div>
          <div className="text-xs text-slate-400 text-left md:text-right font-mono mt-0.5 font-medium flex items-center md:justify-end gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Saat {exam.time}'da
          </div>
        </div>
      </div>

      {/* Main countdown grid slots */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Days card */}
        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/40 shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>
          <div className="text-3xl md:text-5xl lg:text-6xl font-black font-mono tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            {daysString}
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Gün</div>
        </div>

        {/* Hours card */}
        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/40 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          <div className="text-3xl md:text-5xl lg:text-6xl font-black font-mono tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            {hoursString}
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Saat</div>
        </div>

        {/* Minutes card */}
        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/40 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
          <div className="text-3xl md:text-5xl lg:text-6xl font-black font-mono tracking-tighter bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            {minutesString}
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Dakika</div>
        </div>

        {/* Seconds & Milliseconds Combined card */}
        <div className="flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl bg-slate-950/80 border border-slate-800/40 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl md:text-5xl lg:text-6xl font-black font-mono tracking-tighter bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              {secondsString}
            </span>
            <span className="text-lg md:text-2xl font-semibold font-mono text-pink-500 animate-pulse select-none">
              .{timeLeft.ms}
            </span>
          </div>
          <div className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Saniye</div>
        </div>
      </div>

      {/* Progress Line */}
      <div className="mb-6 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 font-medium text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            Sınava Hazırlık Süreci Tamamlanma Oranı
          </span>
          <span className="font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
            %{progressPercent}
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 p-0.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${exam.color} shadow-[0_0_12px_rgba(235,100,50,0.2)]`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Hazırlık Başlangıcı</span>
          <span>Sınav Günü</span>
        </div>
      </div>

      {/* Dynamic Studying Tip Card in Side Grid */}
      <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 flex gap-3 items-start relative overflow-hidden">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${exam.color} text-white shrink-0 shadow-sm mt-0.5`}>
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            Tavsiye & Çalışma Önerisi
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </h4>
          <div className="min-h-[44px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeAdviceIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.4 }}
                className="text-xs text-slate-300 leading-relaxed font-normal italic"
              >
                "{advice[activeAdviceIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

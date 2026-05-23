import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  CheckSquare,
  Calendar,
  Award,
  Clock,
  Plus,
  Trash2,
  FileText,
  AlertTriangle,
  Smile,
  Compass,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Flame,
  Volume2,
  Play,
  Pause,
  ListTodo,
  TrendingDown
} from 'lucide-react';
import { INITIAL_EXAMS, MOTIVATIONAL_QUOTES, EXAM_STUDY_ADVICE } from './data';
import { ExamDetails, TaskItem, NoteItem, CustomMilestone } from './types';

export default function App() {
  // Current time state
  const [now, setNow] = useState<Date>(new Date());
  
  // Selected Exam for workspace focus (default is 'ata-aof')
  const [selectedExamId, setSelectedExamId] = useState<string>('ata-aof');

  // Currently viewing tab inside active workspace
  const [activeTab, setActiveTab] = useState<'syllabus' | 'helper' | 'notebook' | 'milestones'>('syllabus');

  // Dynamic Quote Index state
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // sound feedback with Web Audio API (to avoid external file dependency)
  const [hapticSound, setHapticSound] = useState<boolean>(true);

  // Vize-Final Grade Target State
  const [vizeScore, setVizeScore] = useState<string>('60');
  const [targetSuccessScore, setTargetSuccessScore] = useState<string>('50');

  // KPSS Practise Score Inputs
  const [kpssGyCorrect, setKpssGyCorrect] = useState<string>('42');
  const [kpssGyIncorrect, setKpssGyIncorrect] = useState<string>('10');
  const [kpssGkCorrect, setKpssGkCorrect] = useState<string>('40');
  const [kpssGkIncorrect, setKpssGkIncorrect] = useState<string>('12');

  // Load / Save persistent tasks from localStorage
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('snv_frosted_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    
    // Default curriculum topics from INITIAL_EXAMS
    const defaultList: TaskItem[] = [];
    INITIAL_EXAMS.forEach(exam => {
      exam.subjects.forEach((subj, idx) => {
        defaultList.push({
          id: `${exam.id}-subject-${idx}`,
          examId: exam.id,
          title: subj,
          completed: false
        });
      });
    });
    return defaultList;
  });

  // Load / Save custom milestones from localStorage
  const [milestones, setMilestones] = useState<CustomMilestone[]>(() => {
    const saved = localStorage.getItem('snv_frosted_milestones');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'm-1', title: 'Branş Denemelerine Başlangıç', date: '2026-06-01', color: 'bg-blue-500' },
      { id: 'm-2', title: 'Genel Kültür Tekrar Kampı', date: '2026-07-20', color: 'bg-purple-500' },
      { id: 'm-3', title: 'Geriye Dönük Çıkmış Sorular Çözümü', date: '2026-08-15', color: 'bg-rose-500' },
    ];
  });

  // Load / Save quick study notes
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('snv_frosted_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'note-aof',
        examId: 'ata-aof',
        title: 'Bahar Dönemi Altın Kuralı',
        content: 'Geçmiş final sorularını çözmek sınav başarısını yarı yarıya kolaylaştırır! Harf notu CC alt sınırını geçebilmek için vize sonrasında finalden en az kaç alınmalı panelinden hesaplayın.',
        updatedAt: '23.05.2026'
      },
      {
        id: 'note-kpss',
        examId: 'kpss-onlisans',
        title: 'Önemli Konu Hatırlatması',
        content: 'Matematikte yüzde ve sayı problemleri her sene yaklaşık 6-8 soru getirmektedir. Tarih dersinde ise inkılap tarihi ve çağdaş Türk tarihi en büyük ağırlığa sahip kısımdır.',
        updatedAt: '23.05.2026'
      }
    ];
  });

  // Simple KPSS net logs
  const [savedKpssLogs, setSavedKpssLogs] = useState<{ id: string; date: string; net: number; desc: string }[]>(() => {
    const saved = localStorage.getItem('snv_frosted_net_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Task form state
  const [newSubjectTitle, setNewSubjectTitle] = useState<string>('');
  
  // Custom Milestone form state
  const [newMTitle, setNewMTitle] = useState<string>('');
  const [newMDate, setNewMDate] = useState<string>('');
  const [newMColor, setNewMColor] = useState<string>('bg-blue-500');

  // Quick memo note editing state
  const [draftNoteTitle, setDraftNoteTitle] = useState<string>('');
  const [draftNoteContent, setDraftNoteContent] = useState<string>('');

  // Audio system helper
  const triggerHapticPing = (frequency = 600, duration = 0.08) => {
    if (!hapticSound) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio permission error safe block
    }
  };

  // Keep state matching in storage
  useEffect(() => {
    localStorage.setItem('snv_frosted_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('snv_frosted_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('snv_frosted_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('snv_frosted_net_logs', JSON.stringify(savedKpssLogs));
  }, [savedKpssLogs]);

  // Seconds ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quotes timer
  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(qInterval);
  }, []);

  // Load Note draft values whenever selected exam changes
  useEffect(() => {
    const foundNote = notes.find(n => n.examId === selectedExamId);
    if (foundNote) {
      setDraftNoteTitle(foundNote.title);
      setDraftNoteContent(foundNote.content);
    } else {
      setDraftNoteTitle('');
      setDraftNoteContent('');
    }
  }, [selectedExamId, notes]);

  // Real-time calculated remaining seconds for exams
  const remainingTimes = useMemo(() => {
    return INITIAL_EXAMS.reduce((acc, exam) => {
      const examDate = new Date(exam.date).getTime();
      const diff = examDate - now.getTime();

      if (diff <= 0) {
        acc[exam.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true, elapsedPct: 100 };
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Calculate progress percentage since academic year start (approx Jan 1, 2026 to exam date)
        const startTimestamp = new Date('2026-01-01T00:00:00+03:00').getTime();
        const totalDuration = examDate - startTimestamp;
        const elapsed = now.getTime() - startTimestamp;
        const elapsedPct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

        acc[exam.id] = { days, hours, minutes, seconds, finished: false, elapsedPct };
      }
      return acc;
    }, {} as Record<string, { days: number; hours: number; minutes: number; seconds: number; finished: boolean; elapsedPct: number }>);
  }, [now]);

  // Selected Exam object helper
  const activeExamObj = useMemo(() => {
    return INITIAL_EXAMS.find(e => e.id === selectedExamId) || INITIAL_EXAMS[0];
  }, [selectedExamId]);

  // Filter tasks for the active exam
  const currentExamTasks = useMemo(() => {
    return tasks.filter(t => t.examId === selectedExamId);
  }, [tasks, selectedExamId]);

  // Active exam checklist progress ratio
  const activeExamTaskProgress = useMemo(() => {
    if (currentExamTasks.length === 0) return 0;
    const completed = currentExamTasks.filter(t => t.completed).length;
    return Math.round((completed / currentExamTasks.length) * 100);
  }, [currentExamTasks]);

  // Custom study milestones progress
  const processedMilestones = useMemo(() => {
    return milestones.map(m => {
      const mDate = new Date(`${m.date}T00:00:00`).getTime();
      const diff = mDate - now.getTime();
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return {
        ...m,
        daysLeft,
        isPast: daysLeft < 0
      };
    });
  }, [milestones, now]);

  // Task List operations
  const handleAddNewSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectTitle.trim()) return;
    const item: TaskItem = {
      id: `custom-task-${Date.now()}`,
      examId: selectedExamId,
      title: newSubjectTitle.trim(),
      completed: false
    };
    setTasks(prev => [...prev, item]);
    setNewSubjectTitle('');
    triggerHapticPing(750, 0.08);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    triggerHapticPing(620, 0.1);
  };

  const removeTaskItem = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    triggerHapticPing(400, 0.12);
  };

  // Milestone operations
  const handleAddNewMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMTitle.trim() || !newMDate) return;
    const mItem: CustomMilestone = {
      id: `milestone-${Date.now()}`,
      title: newMTitle.trim(),
      date: newMDate,
      color: newMColor
    };
    setMilestones(prev => [...prev, mItem].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewMTitle('');
    setNewMDate('');
    triggerHapticPing(850, 0.1);
  };

  const deleteMilestoneItem = (mId: string) => {
    setMilestones(prev => prev.filter(m => m.id !== mId));
    triggerHapticPing(300, 0.1);
  };

  // Note Saver content
  const saveNoteState = () => {
    setNotes(prev => prev.map(n => {
      if (n.examId === selectedExamId) {
        return {
          ...n,
          title: draftNoteTitle.trim() || 'Hızlı Ders Notu',
          content: draftNoteContent,
          updatedAt: new Date().toLocaleDateString('tr-TR')
        };
      }
      return n;
    }));
    triggerHapticPing(900, 0.15);
  };

  // Calculator logic for ATA AÖF
  const calculatedFinalTarget = useMemo(() => {
    const vize = parseFloat(vizeScore);
    const target = parseFloat(targetSuccessScore);
    if (isNaN(vize) || isNaN(target)) return null;

    // Formula: Success score = (Vize * 0.3) + (Final * 0.7)
    // Final = (Success score - (vize * 0.3)) / 0.7
    const finalVal = (target - (vize * 0.3)) / 0.7;
    const safeResult = Math.ceil(finalVal * 100) / 100;

    return {
      finalRequired: Math.max(0, safeResult),
      achievable: safeResult <= 100,
      note: safeResult >= 35 ? 'Finalden en az 35 alma barajını aşmanız gerekiyor.' : 'Hesaplanan değer Final Barajının (35 puan) altındadır. Dersi geçmek için finalden en az 35 almalısınız!'
    };
  }, [vizeScore, targetSuccessScore]);

  // Calculator logic for KPSS
  const calculatedKpssNet = useMemo(() => {
    const gyC = parseFloat(kpssGyCorrect) || 0;
    const gyI = parseFloat(kpssGyIncorrect) || 0;
    const gkC = parseFloat(kpssGkCorrect) || 0;
    const gkI = parseFloat(kpssGkIncorrect) || 0;

    const gyNet = gyC - (gyI * 0.25);
    const gkNet = gkC - (gkI * 0.25);
    const totalNet = gyNet + gkNet;

    // Approximate formula to estimate KPSS Ön Lisans points
    // Base 50 + normalized net scaling
    const projectedResult = 53.5 + (totalNet * 0.385);

    return {
      gy: Math.max(0, gyNet),
      gk: Math.max(0, gkNet),
      total: Math.max(0, totalNet),
      score: Math.min(100, Math.max(10, Math.round(projectedResult * 100) / 100))
    };
  }, [kpssGyCorrect, kpssGyIncorrect, kpssGkCorrect, kpssGkIncorrect]);

  const recordKpssNetLog = () => {
    const logItem = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString('tr-TR'),
      net: calculatedKpssNet.total,
      desc: `GY: ${kpssGyCorrect}D ${kpssGyIncorrect}Y | GK: ${kpssGkCorrect}D ${kpssGkIncorrect}Y (Tahmini Puan: ~${calculatedKpssNet.score})`
    };
    setSavedKpssLogs(prev => [logItem, ...prev]);
    triggerHapticPing(650, 0.08);
  };

  const removeKpssLogItem = (id: string) => {
    setSavedKpssLogs(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white relative overflow-hidden flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-100">
      
      {/* Background Flowing Premium Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] opacity-25 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] opacity-25 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-pink-500 rounded-full blur-[150px] opacity-15 pointer-events-none"></div>

      {/* Primary Interaction Interface Container */}
      <div className="relative z-10 flex flex-col h-full p-4 sm:p-6 md:p-10 lg:p-12 max-w-7xl mx-auto w-full">
        
        {/* Dynamic Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <p className="text-blue-400 font-extrabold tracking-[0.25em] uppercase text-xs mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              Akademik Takip Portalı
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Sınav Geri Sayım
            </h1>
          </div>
          <div className="text-left md:text-right w-full md:w-auto">
            <div className="bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] inline-block w-full md:w-auto">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Bugünün Tarihi ve Canlı Saat</p>
              <p className="text-base font-medium text-slate-100 whitespace-nowrap">
                {now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
              </p>
              <p className="text-xs font-mono text-cyan-400 mt-1 flex items-center justify-start md:justify-end gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Zaman: {now.toLocaleTimeString('tr-TR')}
              </p>
            </div>
          </div>
        </header>

        {/* Motivational Quote banner with auto-toggle */}
        <div className="mb-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/15 rounded-lg text-indigo-300">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="italic text-slate-200 text-xs md:text-sm">"{MOTIVATIONAL_QUOTES[quoteIndex].text}"</p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">— {MOTIVATIONAL_QUOTES[quoteIndex].author}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
              triggerHapticPing(650, 0.05);
            }}
            className="text-xs font-mono font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
          >
            Sözü Değiştir
          </button>
        </div>

        {/* Dynamic Frosted Countdown Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10" id="countdown-deck">
          {INITIAL_EXAMS.map((exam, index) => {
            const tm = remainingTimes[exam.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, finished: false, elapsedPct: 0 };
            const isSelected = selectedExamId === exam.id;

            return (
              <div
                key={exam.id}
                onClick={() => {
                  setSelectedExamId(exam.id);
                  triggerHapticPing(600, 0.06);
                }}
                className={`group relative bg-white/5 backdrop-blur-2xl border rounded-[40px] p-8 md:p-10 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] ${
                  isSelected 
                    ? 'ring-2 ring-indigo-500/70 border-white/20 bg-white/8 shadow-[0_20px_50px_rgba(31,38,135,0.25)]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Glowing selection corner */}
                {isSelected && (
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-[40px] bg-gradient-to-r ${exam.color}`}></div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                    exam.id === 'ata-aof' 
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {exam.id === 'ata-aof' ? 'Açıköğretim Sınavı' : 'Devlet Memurluğu Sınavı'}
                  </div>
                  <div className="text-white/30 text-4xl italic font-serif font-bold select-none pr-1">
                    {index === 0 ? '01' : '02'}
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-1 text-white/95 group-hover:text-white transition-colors">
                    {exam.name}
                  </h2>
                  <p className="text-white/50 text-sm leading-snug line-clamp-2">
                    {exam.fullName}
                  </p>
                </div>

                {/* Main Days Left Display */}
                <div className="my-8 flex items-baseline gap-4">
                  <span className="text-[100px] md:text-[110px] lg:text-[120px] font-black leading-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent tracking-tighter tabular-nums select-none">
                    {tm.days}
                  </span>
                  <span className="text-2xl font-light text-white/40 uppercase tracking-widest">Gün Kaldı</span>
                </div>

                {/* Down to the seconds dynamic subsection bar */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 text-center shadow-inner">
                  {/* Hours */}
                  <div>
                    <span className="block text-xl md:text-2xl font-black font-mono text-slate-100 tabular-nums">
                      {String(tm.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Saat</span>
                  </div>

                  {/* Minutes */}
                  <div>
                    <span className="block text-xl md:text-2xl font-black font-mono text-slate-100 tabular-nums">
                      {String(tm.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Dakika</span>
                  </div>

                  {/* Seconds */}
                  <div className="relative">
                    <span className="block text-xl md:text-2xl font-black font-mono text-cyan-400 tabular-nums animate-pulse">
                      {String(tm.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-bold text-cyan-300 tracking-wider uppercase flex items-center justify-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block"></span>
                      Saniye
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${exam.color} transition-all duration-1000`}
                      style={{ width: `${tm.elapsedPct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Sınav Tarihi: <strong className="text-white font-medium">{exam.id === 'ata-aof' ? '13 - 14 Haz 2026' : '04 Eki 2026'}</strong></span>
                    <span className="font-bold text-[11px] text-cyan-400 bg-cyan-950/20 px-2 py-0.5 rounded-lg border border-cyan-500/20 flex items-center gap-1">
                      <Flame className="h-3 w-3 animate-bounce" /> %{tm.elapsedPct} Tamam
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Focus Space Label */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-indigo-400 shrink-0" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Çalışma Planlayıcınız:</span>
            <span className="text-sm font-black text-white hover:text-indigo-300 transition-colors uppercase">
              {activeExamObj.name}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest align-right">
            Soru Bankaları &amp; Not Defteri
          </span>
        </div>

        {/* Interactive Workspace Area styled as high-fidelity glass */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[36px] p-6 sm:p-8 lg:p-10 shadow-3xl mb-12">
          
          {/* Glass Mode Switcher Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-8 border-b border-white/10 pb-6">
            <button
              onClick={() => { setActiveTab('syllabus'); triggerHapticPing(700, 0.05); }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'syllabus'
                  ? 'bg-white/15 text-white shadow-lg border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <CheckSquare className="h-4 w-4 text-emerald-400" />
              Ders Müfredat Takibi ({currentExamTasks.filter(t => t.completed).length}/{currentExamTasks.length})
            </button>

            <button
              onClick={() => { setActiveTab('helper'); triggerHapticPing(700, 0.05); }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'helper'
                  ? 'bg-white/15 text-white shadow-lg border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-amber-400" />
              {activeExamObj.id === 'ata-aof' ? 'ATA AÖF Not Hesaplayıcı' : 'KPSS Net Hesaplayıcı'}
            </button>

            <button
              onClick={() => { setActiveTab('notebook'); triggerHapticPing(700, 0.05); }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'notebook'
                  ? 'bg-white/15 text-white shadow-lg border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileText className="h-4 w-4 text-blue-400" />
              Ders &amp; Sınav Not Defteri
            </button>

            <button
              onClick={() => { setActiveTab('milestones'); triggerHapticPing(700, 0.05); }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === 'milestones'
                  ? 'bg-white/15 text-white shadow-lg border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Calendar className="h-4 w-4 text-purple-400" />
              Sınav Sınır Çizgisi (Timeline)
            </button>
          </div>

          {/* DYNAMIC TAB COMPONENT OUTPUTS */}
          <div className="min-h-[280px]">

            {/* TAB 1: SYLLABUS CHECKLIST */}
            {activeTab === 'syllabus' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl font-extrabold text-[#fafafa] tracking-tight">Ünite &amp; Konu Kontrol Listesi</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Aşağıdaki listeden çalıştığınız ve tamamladığınız konuları işaretleyin. Yeni konular ekleyerek hedefinizi özelleştirebilirsiniz.
                  </p>

                  <div className="w-full bg-slate-900/60 rounded-2xl p-4 border border-white/5 space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                    {currentExamTasks.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-6">Konu listesi boş.</p>
                    ) : (
                      currentExamTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                            t.completed
                              ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400'
                              : 'bg-white/5 border-white/5 hover:border-white/10 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleTaskCompletion(t.id)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                                t.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-500 hover:border-indigo-400 bg-transparent'
                              }`}
                            >
                              {t.completed && <CheckCircle2 className="h-3 w-3" />}
                            </button>
                            <span className={`text-xs md:text-sm font-medium truncate ${t.completed ? 'line-through opacity-50' : ''}`}>
                              {t.title}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => removeTaskItem(t.id)}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1"
                            title="Öğeyi Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddNewSubject} className="flex gap-2.5 pt-2">
                    <input
                      type="text"
                      placeholder="Listeye özel çalışmak istediğiniz yeni ders, ünite veya konu ekleyin..."
                      value={newSubjectTitle}
                      onChange={(e) => setNewSubjectTitle(e.target.value)}
                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 text-white"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Ekle
                    </button>
                  </form>
                </div>

                {/* Left side: Quick percentage stats chart and expert guidance comments */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#fafafa] mb-3">Çalışma İlerleme Barometresi</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-black font-mono text-emerald-400">% {activeExamTaskProgress}</div>
                      <div className="text-xs text-slate-300">
                        Bu sınava yönelik hazırlanmış olan tüm ünite listelerindeki derslerinizi bitirme oranı. Ne kadar yüksek olursa final şansınız o derece gelişecektir.
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-950/20 border border-indigo-500/15 p-6 rounded-3xl">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3 flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-indigo-400" />
                      Sınav Kurumsal Tavsiyesi
                    </h4>
                    <div className="space-y-3">
                      {EXAM_STUDY_ADVICE[selectedExamId as 'ata-aof' | 'kpss-onlisans']?.map((adv, index) => (
                        <div key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                          <span className="text-indigo-400 font-extrabold">•</span>
                          <p>{adv}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE GRADE CALCULATOR AND ARCHIVABLE TEST SCORE LOGGER */}
            {activeTab === 'helper' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {selectedExamId === 'ata-aof' ? (
                  /* ATA AÖF GRADING PORTAL FORM */
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight mb-2">Vize-Final Başarı Puanı Simülatörü</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Atatürk Üniversitesi ders geçme sisteminde yıl içi **Vize Sınavı %30**, dönem sonu **Final Sınavı %70** etki katsayısına sahiptir. Aşağıda aldığınız vize notu ve hedeflediğiniz harf notu barajını girerek, finalde almanız gereken asgari notu bulun.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">Vize Notunuz (0 - 100):</span>
                          <span className="font-mono text-blue-400 font-bold">{vizeScore} Puan</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={vizeScore}
                            onChange={(e) => setVizeScore(e.target.value)}
                            className="w-full h-1.5 bg-white/10 rounded-xl appearance-none cursor-pointer accent-blue-500"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={vizeScore}
                            onChange={(e) => {
                              const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                              setVizeScore(String(val));
                            }}
                            className="w-16 bg-white/5 border border-white/10 rounded-xl py-1 text-center font-bold text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1.5">Hedeflediğiniz Başarı Seviyesi:</label>
                        <select
                          value={targetSuccessScore}
                          onChange={(e) => setTargetSuccessScore(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-medium"
                        >
                          <option value="35">35 Puan (Geçme Sınırı - DD)</option>
                          <option value="46">46 Puan (Sınırda Geçer - DC)</option>
                          <option value="50">50 Puan (Ortalama Başarı - CC)</option>
                          <option value="57">57 Puan (İyi - CB)</option>
                          <option value="65">65 Puan (Güzel Başarı - BB)</option>
                          <option value="75">75 Puan (Yüksek Onur - BA)</option>
                          <option value="85">85 Puan (Mükemmel - AA)</option>
                        </select>
                      </div>

                      {calculatedFinalTarget && (
                        <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-center">
                          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest leading-none">Hedefe Ulaşmak İçin Finalden Almanız Gereken Not</p>
                          <p className="text-5xl font-black text-white mt-1 mb-1 font-mono tracking-tighter">
                            {calculatedFinalTarget.finalRequired}
                          </p>
                          
                          {calculatedFinalTarget.finalRequired > 100 ? (
                            <div className="text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 mt-2">
                              <AlertTriangle className="h-4 w-4 shrink-0" />
                              Girilen vize notuyla bu harf notunu almak imkansızdır.
                            </div>
                          ) : (
                            <p className="text-emerald-400 text-xs mt-2 font-medium">
                              {calculatedFinalTarget.finalRequired < 35
                                ? 'Final sınavından en az 35 alma koşulu (final barajı) bulunduğundan finalde 35 almalısınız.'
                                : 'Final sınavından bu puanı alırsanız hedefinize ulaşırsınız!'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* KPSS NET CALCULATOR FORM WITH ARCHIVE LISTS */
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight mb-2">Genel Yetenek &amp; Kültür Net Ölçer</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Kamu Personeli Seçme Sınavı’nda (KPSS) **4 Yanlış 1 Doğruyu** elemektedir. Aşağıya deneme sonuçlarınızı yazarak toplam netinizi simüle edin ve kalıcı olarak başarı günlüğüne ekleyin.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Genel Yetenek Inputs */}
                      <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-xs font-bold text-amber-400">Genel Yetenek (60 Soru)</p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] text-slate-400 block uppercase font-bold">Doğru Sayısı</label>
                            <input
                              type="number"
                              min="0"
                              max="60"
                              value={kpssGyCorrect}
                              onChange={(e) => setKpssGyCorrect(String(Math.min(60, Math.max(0, parseInt(e.target.value) || 0))))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-emerald-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block uppercase font-bold">Yanlış Sayısı</label>
                            <input
                              type="number"
                              min="0"
                              max="60"
                              value={kpssGyIncorrect}
                              onChange={(e) => setKpssGyIncorrect(String(Math.min(60, Math.max(0, parseInt(e.target.value) || 0))))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-red-300"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Genel Kültür Inputs */}
                      <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-xs font-bold text-amber-400">Genel Kültür (60 Soru)</p>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] text-slate-400 block uppercase font-bold">Doğru Sayısı</label>
                            <input
                              type="number"
                              min="0"
                              max="60"
                              value={kpssGkCorrect}
                              onChange={(e) => setKpssGkCorrect(String(Math.min(60, Math.max(0, parseInt(e.target.value) || 0))))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-emerald-300"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block uppercase font-bold">Yanlış Sayısı</label>
                            <input
                              type="number"
                              min="0"
                              max="60"
                              value={kpssGkIncorrect}
                              onChange={(e) => setKpssGkIncorrect(String(Math.min(60, Math.max(0, parseInt(e.target.value) || 0))))}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-red-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">Hesaplanan Toplam Net Bilgisi</p>
                        <p className="text-sm text-slate-200 mt-1">
                          GY: <strong className="text-white font-mono">{calculatedKpssNet.gy}</strong> Net | GK: <strong className="text-white font-mono">{calculatedKpssNet.gk}</strong> Net
                        </p>
                        <p className="text-xl font-bold font-mono text-white mt-1">
                           {calculatedKpssNet.total} Net (~Tahmini Puan: {calculatedKpssNet.score})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={recordKpssNetLog}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Neti Başarı Günlüğüne Ekle
                      </button>
                    </div>
                  </div>
                )}

                {/* Right side information ledger logs / statistics info */}
                <div className="lg:col-span-5 space-y-6">
                  {selectedExamId === 'ata-aof' ? (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#fafafa]">ATA AÖF Akademik Geçme Eşikleri</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Atatürk Üniversitesi Harf Dağılım Aralıkları vize ve final performansının ağırlıklı ortalamasıyla oluşan Başarı Puanına göre belirlenir.
                      </p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="font-bold text-blue-300 font-mono">AA</span>
                          <span>85 - 100 Başarı Puanı</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="font-bold text-blue-300 font-mono">CC</span>
                          <span>49 - 56 Başarı Puanı</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-bold text-pink-400 font-mono">DD (Sınırda Geçme)</span>
                          <span>35 - 39 Başarı Puanı</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#fafafa] mb-3">Kaydedilmiş Deneme Sonuçları</h4>
                      <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                        {savedKpssLogs.length === 0 ? (
                          <p className="text-xs text-slate-500 italic text-center py-6">Henüz kaydedilmiş deneme skoru yok. Sol panelden hesaplayarak listeye ekleyin.</p>
                        ) : (
                          savedKpssLogs.map((log) => (
                            <div key={log.id} className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-xs flex justify-between items-center group">
                              <div className="min-w-0 flex-1 pr-2">
                                <span className="font-extrabold text-amber-400 font-mono">{log.net} Net</span>
                                <span className="text-slate-400 mx-1.5">|</span>
                                <span className="text-slate-300 text-[11px] font-sans block truncate mt-0.5">{log.desc}</span>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono font-bold">{log.date}</span>
                                <button
                                  onClick={() => removeKpssLogItem(log.id)}
                                  className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: DESTEK NOT DEFTERI */}
            {activeTab === 'notebook' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12 space-y-4">
                  <h3 className="text-xl font-extrabold tracking-tight">Kritik Sınav Not Defteri</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sınava çalışırken aklınızda tutmak istediğiniz önemli formülleri, soru ipuçlarını veya haftalık hedeflerinizi aşağıya yazın. Yazdığınız her karakter kalıcı olarak yerel hafızanıza işlenecektir.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Not Başlığı</label>
                      <input
                        type="text"
                        value={draftNoteTitle}
                        onChange={(e) => setDraftNoteTitle(e.target.value)}
                        placeholder="Örn: Tarih Özet Kuralı veya KPSS Formülleri..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ayrıntılı İçerik &amp; Karalamalar</label>
                      <textarea
                        value={draftNoteContent}
                        onChange={(e) => setDraftNoteContent(e.target.value)}
                        rows={6}
                        placeholder="Önemli ders özetleri, unutmamanız gereken formül veya pratik kelime bilgisi..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white font-mono leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-between items-center bg-white/5 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs text-slate-400">
                        Seçili Sınav Odağı: <strong className="text-slate-200">{activeExamObj.name}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={saveNoteState}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow cursor-pointer"
                      >
                        Değişiklikleri Not Defterine Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MILESTONES / TIMELINE */}
            {activeTab === 'milestones' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl font-extrabold tracking-tight">Çalışma Yol Haritası &amp; Önemli Günler</h3>
                  <p className="text-xs text-slate-400">
                    Sınav gününe kadar kendinize ait deneme tarihleri, konu tekrar kampları belirleyin ve kalan süreyi günlük olarak takip edin.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {processedMilestones.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6 col-span-2">Kayıtlı kilometre taşı yok.</p>
                    ) : (
                      processedMilestones.map((m) => (
                        <div key={m.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between group">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase text-white font-mono ${m.color}`}>
                                Kamp / Mil taşı
                              </span>
                              <button
                                onClick={() => deleteMilestoneItem(m.id)}
                                className="text-slate-500 hover:text-red-400 text-xs transition-colors"
                              >
                                Kaldır
                              </button>
                            </div>
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-200 line-clamp-1">{m.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">{new Date(m.date).toLocaleDateString('tr-TR')}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                            {m.isPast ? (
                              <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Tamamlandı
                              </span>
                            ) : (
                              <>
                                <span className="text-2xl font-black font-mono text-white leading-none">{m.daysLeft}</span>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Gün Kaldı</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Form to create custom studies */}
                <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 rounded-3xl">
                  <form onSubmit={handleAddNewMilestone} className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#fafafa] mb-1">Yeni Kilometre Taşı Ekleyin</h4>
                    
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Hedef / Kamp Başlığı</label>
                      <input
                        type="text"
                        placeholder="Örn: Türkçe Paragraf Kampına Başla"
                        value={newMTitle}
                        onChange={(e) => setNewMTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Hedef Tarih</label>
                      <input
                        type="date"
                        value={newMDate}
                        onChange={(e) => setNewMDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-2">Aesthetic Renk Ayarı</label>
                      <div className="flex gap-2">
                        {[
                          { color: 'bg-blue-500', name: 'Mavi' },
                          { color: 'bg-emerald-500', name: 'Yeşil' },
                          { color: 'bg-indigo-500', name: 'Mor' },
                          { color: 'bg-rose-500', name: 'Pembe' },
                          { color: 'bg-amber-500', name: 'Sarı' },
                        ].map((col) => (
                          <button
                            key={col.color}
                            type="button"
                            onClick={() => { setNewMColor(col.color); triggerHapticPing(700, 0.03); }}
                            className={`w-5 h-5 rounded-full ${col.color} ${newMColor === col.color ? 'ring-2 ring-white scale-110' : 'opacity-50'} transition-all cursor-pointer`}
                            title={col.name}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Yol Haritasına Kaydet
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Bottom Status / Settings Bar */}
        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase text-white/30 font-bold gap-4 border-t border-white/5 pt-6">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></span>
              Sistem Aktif
            </div>
            <div>Kaynak: ÖSYM &amp; Atatürk Üniversitesi (ATA AÖF)</div>
          </div>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => {
                setHapticSound(!hapticSound);
                triggerHapticPing(500, 0.05);
              }}
              className="hover:text-white transition-colors cursor-pointer font-bold uppercase text-[10px]"
            >
              Ses: {hapticSound ? 'Açık (Zil)' : 'Kapalı'}
            </button>
            <span className="hover:text-white transition-colors cursor-pointer uppercase text-[10px]" onClick={() => alert("Sınav tarihlerine olan süre milisaniyeler cinsinden sürekli hesaplanıp yerel tarayıcınız tarafından güncellenmektedir.")}>Destek</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

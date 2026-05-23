export interface ExamDetails {
  id: string;
  name: string;
  fullName: string;
  date: string; // ISO string or target date
  time: string; // Turkey time string for display (e.g. "09:30")
  totalDaysRemaining: number;
  description: string;
  color: string;
  accentColor: string;
  subjects: string[];
}

export interface TaskItem {
  id: string;
  examId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface CustomMilestone {
  id: string;
  title: string;
  date: string;
  color: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  examId: string;
}

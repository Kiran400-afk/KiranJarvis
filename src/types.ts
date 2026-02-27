export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export type JarvisMode = 'Developer' | 'Exam' | 'Startup' | 'Research' | 'General';

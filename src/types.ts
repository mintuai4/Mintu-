export interface UserProfile {
  name: string;
  interests: string[];
  xp: number;
  streak: number;
  authenticated: boolean;
  phoneOrEmail?: string;
  badges: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  query: string;
  answer: string;
  sources: GroundingSource[];
  category: string;
  youtubeVideos?: { title: string; videoId: string; channel: string }[];
  quizQuestions?: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  cricketData?: any;
}

export interface CricketMatch {
  id: string;
  teamA: { name: string; score: string; wickets: number; overs: string; logo: string };
  teamB: { name: string; score: string; wickets: number; overs: string; logo: string };
  status: string;
  batsman: string;
  bowler: string;
  venue: string;
  isLive: boolean;
  highlights: string[];
  pointsTable?: { team: string; played: number; won: number; points: number; nrr: string }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'technology' | 'education' | 'ai' | 'cricket' | 'trending' | 'india' | 'global';
  source: string;
  time: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ElectricianSubject {
  name: string;
  chapters: {
    title: string;
    description: string;
    year: number;
    notes: string;
    mcqs: QuizQuestion[];
  }[];
}

import { useState, useEffect, useMemo } from 'react';
import Navbar from "../components/Navbar"; // Correct import statement
import Footer from '../components/Footer'; // Correct import statement for Footer

import { 
  Calendar, 
  BookOpen, 
  Trophy, 
  Clock, 
  Star, 
  TrendingUp,
  ChevronRight,
  Loader2 // Added for loading state
} from 'lucide-react';
import API from '../services/api';

// --- TYPES ---
interface Lesson {
  id: number;
  title: string;
  language: string;
  icon: string;
  date: string;
  time: string;
  score: number;
  duration: string;
  points: number;
}

interface StatItem {
  day: string;
  lessons: number;
  points: number;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  time: string;
  icon: string;
}

// --- SUB-COMPONENTS ---
const StatCard = ({ icon: Icon, value, label, colorClass, darkMode }: any) => (
  <div className={`rounded-2xl p-6 transition-all duration-300 border hover:scale-[1.02] ${
    darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100 shadow-sm'
  }`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      </div>
    </div>
  </div>
);

interface Summary {
  totalLessons: number;
  avgScore: number;
  totalPoints: number;
  dayStreak: number;
  learningHours: number;
}

export default function Progress() {
  const darkMode = false;
  // --- STATE MANAGEMENT ---
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalLessons: 0, avgScore: 0, totalPoints: 0, dayStreak: 0, learningHours: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await API.get('/progress');
        const data = response.data;

        setCompletedLessons(data.lessons || []);
        setWeeklyStats(data.stats || []);
        setRecentActivities(data.activities || []);
        if (data.summary) setSummary(data.summary);

      } catch (err: any) {
        console.error("Failed to fetch progress data:", err);
        if (err?.response?.status === 401) {
          setError("Please log in to view your progress.");
        } else {
          setError("Unable to load progress data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, []); 

  const maxLessons = useMemo(() => {
    if (weeklyStats.length === 0) return 1;
    return Math.max(...weeklyStats.map((d) => d.lessons));
  }, [weeklyStats]);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Loading your progress...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center p-8 border rounded-2xl border-red-500/20 bg-red-500/10 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={`flex-1 p-6 lg:p-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          
          <Navbar />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Your Progress</h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Keep it up! You've learned <span className="text-green-500 font-bold">12% more</span> this week.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all">
            <Calendar size={18} />
            Weekly Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={BookOpen} value={summary.totalLessons.toString()} label="Total Lessons" 
            colorClass="bg-blue-500/10 text-blue-500" darkMode={darkMode} 
          />
          <StatCard 
            icon={Trophy} value={`${summary.avgScore}%`} label="Avg. Accuracy" 
            colorClass="bg-yellow-500/10 text-yellow-500" darkMode={darkMode} 
          />
          <StatCard 
            icon={Clock} value={`${summary.learningHours}h`} label="Learning Hours" 
            colorClass="bg-purple-500/10 text-purple-500" darkMode={darkMode} 
          />
          <StatCard 
            icon={TrendingUp} value={`${summary.dayStreak} days`} label="Day Streak" 
            colorClass="bg-green-500/10 text-green-500" darkMode={darkMode} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className={`rounded-3xl p-8 border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">Recent Lessons</h2>
                <button className="text-sm font-semibold text-green-500 hover:underline">View All</button>
              </div>
              
              <div className="space-y-4">
                {completedLessons.length === 0 ? (
                  <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No lessons completed yet.</p>
                ) : (
                  completedLessons.map((lesson) => (
                    <div key={lesson.id} className={`group flex items-center justify-between p-4 rounded-2xl border transition-all hover:bg-green-500/[0.02] ${
                      darkMode ? 'border-gray-700/50 hover:border-green-500/50' : 'border-gray-100 hover:border-green-300'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl bg-gray-100 dark:bg-gray-700 w-12 h-12 flex items-center justify-center rounded-xl">
                          {lesson.icon}
                        </div>
                        <div>
                          <h4 className="font-bold">{lesson.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={12}/> {lesson.duration}</span>
                            <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star size={12} fill="currentColor"/> {lesson.score}%</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h2 className="text-lg font-bold mb-6">Weekly Activity</h2>
              <div className="flex items-end justify-between gap-2 h-40">
                {weeklyStats.map((stat) => (
                  <div key={stat.day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className={`w-full rounded-lg transition-all duration-500 relative ${
                        darkMode ? 'bg-green-500/20 group-hover:bg-green-500' : 'bg-green-100 group-hover:bg-green-400'
                      }`}
                      style={{ height: `${(stat.lessons / maxLessons) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] px-2 py-1 rounded">
                        {stat.lessons}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl p-6 border ${darkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100 shadow-sm'}`}>
              <h2 className="text-lg font-bold mb-6">Recent Milestones</h2>
              <div className="space-y-6">
                {recentActivities.length === 0 ? (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent milestones.</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className="text-2xl bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-none">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer outside main content */}
      <Footer />
    </div>
  );
}

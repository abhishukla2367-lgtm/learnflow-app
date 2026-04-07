import { useMemo } from 'react';
import { COURSE_TITLES } from '../data/courseData';
import { Trophy, Medal, Flame, TrendingUp, MapPin, Award } from 'lucide-react';

const PEERS = [
  { name: "Vijay Saxena",   city: "Thane",     points: 12500, completed: 18, streak: 24, category: "Web Dev"  },
  { name: "Raman Verma",       city: "Bengaluru", points: 9800,  completed: 14, streak: 18, category: "AI / ML"  },
  { name: "Rohan Kulkarni",   city: "Mumbai",    points: 8200,  completed: 11, streak: 12, category: "DSA"      },
  { name: "Sneha Iyer",       city: "Bengaluru", points: 7100,  completed: 10, streak: 9,  category: "Design"   },
  { name: "Omkar Bhosale",    city: "Thane",     points: 6400,  completed: 9,  streak: 7,  category: "Cloud"    },
  { name: "Ananya Krishnan",  city: "Mumbai",    points: 5300,  completed: 7,  streak: 5,  category: "Web Dev"  },
  { name: "Siddharth Reddy",  city: "Bengaluru", points: 4800,  completed: 6,  streak: 4,  category: "Security" },
  { name: "Rutuja Jadhav",    city: "Thane",     points: 4200,  completed: 5,  streak: 6,  category: "Product"  },
  { name: "Aditya Bose",      city: "Mumbai",    points: 3900,  completed: 5,  streak: 3,  category: "Mobile"   },
  { name: "Riya Gupta",       city: "Bengaluru", points: 3400,  completed: 4,  streak: 2,  category: "AI / ML"  },
];

const GRADIENTS = [
  'from-cyan-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-violet-600',
  'from-cyan-600 to-indigo-600',
  'from-slate-500 to-gray-600',
  'from-teal-500 to-cyan-600',
  'from-pink-500 to-rose-600',
];

const initials = (name) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const MEDAL_CONFIG = [
  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: <Trophy className="w-5 h-5 text-amber-500"/> },
  { bg: 'bg-slate-50',  border: 'border-slate-200',   icon: <Medal  className="w-5 h-5 text-slate-400"/> },
  { bg: 'bg-orange-50', border: 'border-orange-200',  icon: <Medal  className="w-5 h-5 text-orange-400"/> },
];

export default function Leaderboard() {
  const userStats = useMemo(() => {
    let totalProgress = 0;
    let completedCount = 0;
    Object.keys(COURSE_TITLES).forEach(cat => {
      const catKey = cat.replace(/\s/g, '');
      COURSE_TITLES[cat].forEach((_, index) => {
        const data = localStorage.getItem(`progress_${catKey}-${index}`);
        if (data) {
          const count = JSON.parse(data).length;
          totalProgress += count;
          if (count === 5) completedCount++;
        }
      });
    });
    return {
      name: 'You',
      city: 'Thane',
      points: totalProgress * 100 + completedCount * 500,
      completed: completedCount,
      streak: 0,
      isUser: true,
    };
  }, []);

  const leaderboardData = useMemo(() =>
    [...PEERS, userStats].sort((a, b) => b.points - a.points),
  [userStats]);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── HERO ── */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(8,145,178,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-60 pointer-events-none"/>
        <div className="absolute top-10 right-10 w-64 h-64 bg-violet-100/20 blur-3xl rounded-full pointer-events-none"/>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-mono font-semibold mb-6">
            <Flame className="w-4 h-4 text-orange-500"/>
            Live Rankings · Refreshed Daily
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-5 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-violet-600">Leaderboard</span>
          </h1>
          <p className="text-slate-500 text-lg font-sans">Complete lessons, finish courses, and hold your streak to climb the ranks.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* ── PODIUM TOP 3 ── */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 mb-6">Top Performers</span>
          <div className="grid grid-cols-3 gap-4 items-end">

            {/* 2nd */}
            <div className={`bg-white border ${MEDAL_CONFIG[1].border} rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
              <div className={`w-10 h-10 rounded-xl ${MEDAL_CONFIG[1].bg} border ${MEDAL_CONFIG[1].border} flex items-center justify-center mb-4`}>
                {MEDAL_CONFIG[1].icon}
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${GRADIENTS[1]} flex items-center justify-center text-white font-bold text-lg mb-3`}>
                {initials(leaderboardData[1]?.name || '')}
              </div>
              <p className="font-bold text-slate-900 text-sm">{leaderboardData[1]?.name}</p>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1 mb-2">
                <MapPin className="w-3 h-3"/>{leaderboardData[1]?.city}
              </p>
              <p className="text-cyan-600 font-bold text-base">{leaderboardData[1]?.points.toLocaleString()} pts</p>
              <p className="text-xs text-slate-400 font-mono mt-1">{leaderboardData[1]?.completed} courses</p>
            </div>

            {/* 1st */}
            <div className="bg-white border-2 border-cyan-400 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-md">
                <Trophy className="w-4 h-4 text-white"/>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 mt-2">
                {MEDAL_CONFIG[0].icon}
              </div>
              <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${GRADIENTS[0]} flex items-center justify-center text-white font-bold text-2xl mb-3`}>
                {initials(leaderboardData[0]?.name || '')}
              </div>
              <p className="font-bold text-slate-900 text-base">{leaderboardData[0]?.name}</p>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1 mb-2">
                <MapPin className="w-3 h-3"/>{leaderboardData[0]?.city}
              </p>
              <p className="text-cyan-600 font-bold text-xl">{leaderboardData[0]?.points.toLocaleString()} pts</p>
              <p className="text-xs text-slate-400 font-mono mt-1">{leaderboardData[0]?.completed} courses</p>
            </div>

            {/* 3rd */}
            <div className={`bg-white border ${MEDAL_CONFIG[2].border} rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
              <div className={`w-10 h-10 rounded-xl ${MEDAL_CONFIG[2].bg} border ${MEDAL_CONFIG[2].border} flex items-center justify-center mb-4`}>
                {MEDAL_CONFIG[2].icon}
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${GRADIENTS[2]} flex items-center justify-center text-white font-bold text-lg mb-3`}>
                {initials(leaderboardData[2]?.name || '')}
              </div>
              <p className="font-bold text-slate-900 text-sm">{leaderboardData[2]?.name}</p>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-1 mb-2">
                <MapPin className="w-3 h-3"/>{leaderboardData[2]?.city}
              </p>
              <p className="text-cyan-600 font-bold text-base">{leaderboardData[2]?.points.toLocaleString()} pts</p>
              <p className="text-xs text-slate-400 font-mono mt-1">{leaderboardData[2]?.completed} courses</p>
            </div>

          </div>
        </div>

        {/* ── FULL RANKINGS ── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Rank & Learner</span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Points</span>
          </div>

          <div className="divide-y divide-slate-50">
            {leaderboardData.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between px-6 py-4 transition-colors ${
                  player.isUser ? 'bg-cyan-50/60 border-l-2 border-l-cyan-400' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-5">
                  {/* Rank */}
                  <span className={`w-7 text-center font-bold text-base ${
                    index === 0 ? 'text-amber-500' :
                    index === 1 ? 'text-slate-400' :
                    index === 2 ? 'text-orange-400' : 'text-slate-300'
                  }`}>#{index + 1}</span>

                  {/* Initials block */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${player.isUser ? 'ring-2 ring-cyan-400 ring-offset-1' : ''}`}>
                    {player.isUser ? 'ME' : initials(player.name)}
                  </div>

                  {/* Name + meta */}
                  <div>
                    <p className={`font-bold text-base ${player.isUser ? 'text-cyan-700' : 'text-slate-900'}`}>
                      {player.name}
                      {player.isUser && <span className="text-xs font-mono text-cyan-500 ml-2">(You)</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3"/>{player.city}
                      </p>
                      <span className="text-xs text-slate-300">·</span>
                      <p className="text-xs text-slate-400 font-mono">{player.completed} courses</p>
                      {player.streak > 0 && (
                        <>
                          <span className="text-xs text-slate-300">·</span>
                          <p className="text-xs text-orange-500 font-mono font-semibold">🔥 {player.streak}-day streak</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-base">{player.points.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-1 text-xs font-semibold text-emerald-500 mt-0.5">
                    <TrendingUp className="w-3 h-3"/> +{Math.max(1, 10 - index)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── YOUR STATS ── */}
        <div className="mt-8 bg-white border border-cyan-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <Award className="w-5 h-5 text-cyan-600"/>
            </div>
            <div>
              <p className="font-bold text-slate-900">Your Progress</p>
              <p className="text-xs text-slate-400 font-mono">Thane · Active learner</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Your Points', value: userStats.points.toLocaleString() },
              { label: 'Courses Done', value: userStats.completed },
              { label: 'Your Rank', value: `#${leaderboardData.findIndex(p => p.isUser) + 1}` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-cyan-600">{value}</p>
                <p className="text-xs text-slate-500 font-mono mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
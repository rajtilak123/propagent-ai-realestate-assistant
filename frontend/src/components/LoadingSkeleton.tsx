import React from 'react';

export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/20">
          <div className="w-12 h-12 rounded-full bg-slate-800/80 shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800/80 rounded w-2/3 shimmer" />
            <div className="h-3 bg-slate-800/80 rounded w-1/2 shimmer" />
          </div>
          <div className="w-8 h-4 bg-slate-800/80 rounded shimmer" />
        </div>
      ))}
    </div>
  );
};

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-6 animate-pulse flex-1 overflow-y-auto">
      <div className="flex justify-start">
        <div className="max-w-[70%] bg-slate-800/20 rounded-2xl rounded-tl-none p-4 space-y-2 w-72">
          <div className="h-3 bg-slate-800/80 rounded w-3/4 shimmer" />
          <div className="h-3 bg-slate-800/80 rounded w-5/6 shimmer" />
          <div className="h-2 bg-slate-800/80 rounded w-1/4 self-end shimmer" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="max-w-[70%] bg-slate-800/40 rounded-2xl rounded-tr-none p-4 space-y-2 w-64">
          <div className="h-3 bg-slate-800/80 rounded w-4/5 shimmer" />
          <div className="h-2 bg-slate-800/80 rounded w-1/5 self-end shimmer" />
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[70%] bg-slate-800/20 rounded-2xl rounded-tl-none p-4 space-y-3 w-80">
          <div className="h-3 bg-slate-800/80 rounded w-2/3 shimmer" />
          <div className="h-3 bg-slate-800/80 rounded w-full shimmer" />
          {/* Card skeleton */}
          <div className="border border-slate-700/30 rounded-xl p-2 space-y-2">
            <div className="h-32 bg-slate-800/80 rounded-lg w-full shimmer" />
            <div className="h-4 bg-slate-800/80 rounded w-1/2 shimmer" />
            <div className="h-3 bg-slate-800/80 rounded w-1/3 shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-800/20 rounded-2xl p-4 space-y-2">
            <div className="h-3 bg-slate-800/60 rounded w-1/2 shimmer" />
            <div className="h-6 bg-slate-800/80 rounded w-1/3 shimmer" />
          </div>
        ))}
      </div>
      <div className="bg-slate-800/20 rounded-2xl p-6 h-48 space-y-4">
        <div className="h-4 bg-slate-800/80 rounded w-1/3 shimmer" />
        <div className="flex items-end justify-between h-24 pt-4 px-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="w-6 bg-slate-800/60 rounded-t shimmer" style={{ height: `${i * 12 + 20}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  Target, 
  FolderKanban, 
  Bot, 
  Home,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, truthStatus }) {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder', label: 'Resume Builder', icon: FileText },
    { id: 'job-analyzer', label: 'AI Job & ATS', icon: Target },
    { id: 'career-vault', label: 'Career Vault', icon: FolderKanban },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-lavender-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight block leading-none">
                AI Resume Builder
              </span>
              <span className="text-xs text-brand-600 font-medium">Career Prep & ATS Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Status / User Profile */}
          <div className="flex items-center space-x-3">
            {/* Truth Guard Indicator */}
            <div 
              onClick={() => setActiveTab('builder')}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                truthStatus?.verified === false
                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Resume Truth Guard Verification Status"
            >
              {truthStatus?.verified === false ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Truth Alert ({truthStatus.unsupportedCount})</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Claims Verified</span>
                </>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-lavender-100 text-lavender-700 border border-lavender-200 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.split(' ').map(n=>n[0]).join('') : 'AD'}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight">{user?.name || 'Ajitha D R'}</p>
                <p className="text-slate-500 text-[10px]">{user?.college || 'National Engg College'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

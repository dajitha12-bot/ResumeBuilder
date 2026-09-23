import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Mail,
  Palette, 
  Edit3, 
  Bot, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, truthStatus, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'my-resumes', label: 'My Resumes', icon: FileText, badge: '3' },
    { id: 'cover-letters', label: 'Cover Letters', icon: Mail, badge: 'New' },
    { id: 'templates', label: 'Templates', icon: Palette, badge: '10' },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Fixed Left Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-lavender-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight block leading-none">
                AI Resume Builder
              </span>
              <span className="text-[10px] text-brand-600 font-bold uppercase tracking-wider">FlowCV Editor Engine</span>
            </div>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white border border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-lavender-100 text-lavender-700 border border-lavender-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('') : 'AD'}
            </div>
            <div className="overflow-hidden text-left">
              <p className="font-bold text-xs text-slate-800 truncate">{user?.name || 'Ajitha D R'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.degree || 'B.Tech IT Student'}</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}

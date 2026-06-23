import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Settings, Shield, User, FileText, ChevronRight } from 'lucide-react';
import { ConfigPanel } from './components/ConfigPanel';
import { AppProvider } from './store/AppContext';
import { Toaster } from './components/ui/sonner';
import { cn } from '../lib/utils';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const NAV_ITEMS = [
    { name: '权限开通首页', icon: User, path: '/' },
    { name: '我发起的申请', icon: FileText, path: '/application-list' },
    { name: '客户已申请详情', icon: FileText, path: '/application-detail' },
    { name: '审批流水列表', icon: Shield, path: '/staff-approval-list' },
    { name: '系统设置', icon: Settings, path: '/system-settings' },
  ];

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f5f7fa] flex font-sans">
        
        {/* Left Sidebar */}
      <aside className="w-56 bg-[#001529] text-white flex flex-col shadow-xl z-20 hidden md:flex sticky top-0 h-screen">
          <div className="h-14 flex items-center px-6 border-b border-white/10 font-bold text-lg tracking-wide">机构业务平台</div>
          <nav className="flex-1 py-4">
            <div className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">业务办理</div>
            {NAV_ITEMS.map(item => {
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/submit-form');
              return (
                <div 
                  key={item.name}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  className={cn(
                    "flex items-center px-6 py-3 cursor-pointer transition-colors border-l-4",
                    isActive 
                      ? "bg-blue-600/20 border-blue-500 text-white" 
                      : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10 text-xs text-white/40">
            Version 2.4.1
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-14 bg-white shadow-sm border-b border-slate-200 flex items-center px-6 sticky top-0 z-10 justify-between">
            <div className="flex items-center text-sm text-slate-500">
              <span>业务办理</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-slate-800 font-medium">交易权限管理</span>
              {location.pathname.includes('submit-form') && (
                <>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-blue-600 font-medium">补充证明材料</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">张</div>
              <span className="text-sm text-slate-700 font-medium">张*三</span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>

        {(location.pathname === '/' || location.pathname === '/submit-form') && <ConfigPanel />}
        <Toaster />
      </div>
    </AppProvider>
  );
}

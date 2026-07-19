import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Settings, Shield, User, FileText, ChevronRight, ArrowLeftRight, Building2, UserCircle, ChevronDown, BarChart3, UserX } from 'lucide-react';
import { ConfigPanel } from './components/ConfigPanel';
import { AppProvider } from './store/AppContext';
import { WarehouseProvider } from './store/WarehouseContext';
import { Toaster } from './components/ui/sonner';
import { cn } from '../lib/utils';

interface NavSubGroup {
  label: string;
  items?: NavItem[];
  children?: NavSubGroup[];
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subGroups: NavSubGroup[];
}

interface NavItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const TRADE_PERMISSION_ITEMS: NavItem[] = [
  { name: '权限开通首页', icon: User, path: '/' },
  { name: '我发起的申请', icon: FileText, path: '/application-list' },
  { name: '客户已申请详情', icon: FileText, path: '/application-detail' },
  { name: '审批流水列表', icon: Shield, path: '/staff-approval-list' },
];

const WAREHOUSE_TRANSFER_ITEMS: NavItem[] = [
  { name: '移仓业务首页', icon: ArrowLeftRight, path: '/warehouse-apply' },
  { name: '我发起的申请', icon: FileText, path: '/warehouse-list' },
  { name: '移仓审批流水', icon: Shield, path: '/warehouse-audit-list' },
];

const NATURAL_PERSON_HEADQUARTERS_ITEMS: NavItem[] = [
  { name: '注销交易编码/权限', icon: UserX, path: '/cancel-permission' },
];

const NATURAL_PERSON_CONFIG_SUB_GROUPS: NavSubGroup[] = [
  {
    label: '协议签署配置',
    items: [
      { name: '协议模板管理', icon: FileText, path: '/protocols' },
      { name: '业务场景配置', icon: Settings, path: '/templates' },
    ],
  },
  {
    label: '特定品种管理',
    items: [
      { name: '特定品种管理', icon: BarChart3, path: '/varieties' },
    ],
  },
  {
    label: '品种权限表',
    items: [
      { name: '品种权限表', icon: Shield, path: '/variety-permission' },
    ],
  },
];

const NAV_GROUPS: NavGroup[] = [
  {
    label: '机构业务办理',
    icon: Building2,
    subGroups: [
      { label: '交易权限申请', items: TRADE_PERMISSION_ITEMS },
      { label: '移仓业务申请', items: WAREHOUSE_TRANSFER_ITEMS },
    ],
  },
  {
    label: '自然人业务办理',
    icon: UserCircle,
    subGroups: [
      { label: '总部', items: NATURAL_PERSON_HEADQUARTERS_ITEMS },
      { label: '配置', children: NATURAL_PERSON_CONFIG_SUB_GROUPS },
    ],
  },
];

const WAREHOUSE_SUB_PAGES = ['/warehouse-apply', '/warehouse-detail', '/warehouse-audit', '/warehouse-audit-list'];

// Maps paths to breadcrumb group labels
const GROUP_BREADCRUMB_MAP: Record<string, string> = {
  '/': '机构业务办理',
  '/submit-form': '机构业务办理',
  '/application-list': '机构业务办理',
  '/application-detail': '机构业务办理',
  '/staff-approval': '机构业务办理',
  '/staff-approval-list': '机构业务办理',
  '/system-settings': '机构业务办理',
  '/warehouse-apply': '机构业务办理',
  '/warehouse-list': '机构业务办理',
  '/warehouse-detail': '机构业务办理',
  '/warehouse-audit': '机构业务办理',
  '/warehouse-audit-list': '机构业务办理',
  '/natural-person': '自然人业务办理',
  '/natural-person-list': '自然人业务办理',
  '/protocols': '自然人业务办理',
  '/templates': '自然人业务办理',
  '/varieties': '自然人业务办理',
  '/variety-permission': '自然人业务办理',
  '/cancel-permission': '自然人业务办理',
};

// Gets the current page name for breadcrumb
function getPageLabel(pathname: string): string {
  function searchItems(subGroups: NavSubGroup[]): string | null {
    for (const subGroup of subGroups) {
      if (subGroup.items) {
        for (const item of subGroup.items) {
          if (item.path === pathname) return item.name;
        }
      }
      if (subGroup.children) {
        const found = searchItems(subGroup.children);
        if (found) return found;
      }
    }
    return null;
  }

  for (const group of NAV_GROUPS) {
    const found = searchItems(group.subGroups);
    if (found) return found;
  }
  if (pathname === '/submit-form') return '补充证明材料';
  if (pathname === '/staff-approval') return '审批详情';
  if (pathname === '/system-settings') return '系统设置';
  if (pathname === '/warehouse-apply') return '移仓业务申请表';
  if (pathname === '/warehouse-detail') return '移仓申请详情';
  if (pathname === '/warehouse-audit') return '移仓审核';
  if (pathname === '/warehouse-audit-list') return '移仓审批流水';
  if (pathname === '/protocols') return '协议模板管理';
  if (pathname === '/templates') return '业务场景配置';
  if (pathname === '/varieties') return '特定品种管理';
  if (pathname === '/variety-permission') return '品种权限表';
  if (pathname === '/cancel-permission') return '注销交易编码/权限';
  return '';
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isWarehouse = location.pathname.startsWith('/warehouse');
  const isNaturalPerson = location.pathname.startsWith('/natural-person')
    || location.pathname.startsWith('/protocols')
    || location.pathname.startsWith('/templates')
    || location.pathname.startsWith('/varieties')
    || location.pathname.startsWith('/variety-permission')
    || location.pathname.startsWith('/cancel-permission');

  // Determine which group is active based on current path
  const getActiveGroup = () => {
    if (isNaturalPerson) return '自然人业务办理';
    return '机构业务办理';
  };

  const activeGroup = getActiveGroup();

  // State for collapsible groups - all collapsed by default
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    '机构业务办理': true,
    '自然人业务办理': true,
  });
  const [collapsedSubGroups, setCollapsedSubGroups] = useState<Record<string, boolean>>({
    '交易权限申请': true,
    '移仓业务申请': true,
    '总部': true,
    '配置': true,
    '协议签署配置': true,
    '特定品种管理': true,
    '品种权限表': true,
  });

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const toggleSubGroup = (label: string) => {
    setCollapsedSubGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Recursive sub-group renderer
  function RenderSubGroups({
    subGroups,
    level = 0,
  }: {
    subGroups: NavSubGroup[];
    level?: number;
  }) {
    return subGroups.map(subGroup => {
      const isSubCollapsed = collapsedSubGroups[subGroup.label];
      const hasChildren = !!subGroup.children?.length;
      const hasItems = !!subGroup.items?.length;
      const isCollapsible = hasChildren || hasItems;
      const indentClass = level === 0 ? 'pl-6' : level === 1 ? 'pl-8' : 'pl-10';
      const itemIndentClass = level === 0 ? 'ml-4' : level === 1 ? 'ml-6' : 'ml-8';

      return (
        <div key={subGroup.label}>
          <div
            className={cn(
              "py-3 flex items-center justify-between text-sm font-medium text-white/50 cursor-pointer hover:text-white/70 transition-colors",
              indentClass
            )}
            onClick={() => isCollapsible && toggleSubGroup(subGroup.label)}
          >
            <span>{subGroup.label}</span>
            {isCollapsible && (
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                isSubCollapsed ? "-rotate-90" : ""
              )} />
            )}
          </div>
          {!isSubCollapsed && hasItems && subGroup.items!.map(item => {
            const isActive = location.pathname === item.path
              || (item.path === '/' && location.pathname === '/submit-form')
              || (item.path === '/warehouse-list' && location.pathname === '/warehouse-detail')
              || (item.path === '/warehouse-audit-list' && location.pathname === '/warehouse-audit');
            return (
              <div
                key={item.name}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className={cn(
                  "flex items-center px-6 py-3 cursor-pointer transition-colors border-l-4",
                  itemIndentClass,
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
          {!isSubCollapsed && hasChildren && (
            <RenderSubGroups subGroups={subGroup.children!} level={level + 1} />
          )}
        </div>
      );
    });
  }

  return (
    <AppProvider>
      <WarehouseProvider>
      <div className="min-h-screen bg-[#f5f7fa] flex font-sans">
        
        {/* Left Sidebar */}
      <aside className="w-64 bg-[#001529] text-white flex flex-col shadow-xl z-20 hidden md:flex sticky top-0 h-screen">
          <div className="h-14 flex items-center px-6 border-b border-white/10 font-bold text-lg tracking-wide">机构业务平台</div>
          <nav className="flex-1 py-2 overflow-y-auto">
            {NAV_GROUPS.map((group, gi) => {
              const isGroupActive = group.label === activeGroup;
              const isCollapsed = collapsedGroups[group.label];
              return (
                <div key={group.label} className={gi > 0 ? 'mt-2' : ''}>
                  {/* Group Header - Clickable to collapse/expand */}
                  <div 
                    className="px-4 py-3 flex items-center justify-between text-sm font-medium text-white/70 cursor-pointer hover:text-white transition-colors"
                    onClick={() => toggleGroup(group.label)}
                  >
                    <div className="flex items-center">
                      <group.icon className="w-4 h-4 mr-2" />
                      {group.label}
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isCollapsed ? "-rotate-90" : ""
                    )} />
                  </div>
                  
                  {/* Sub Groups - Collapsible */}
                  {!isCollapsed && (
                    <RenderSubGroups
                      subGroups={group.subGroups}
                      level={0}
                    />
                  )}
                </div>
              );
            })}

            {/* System Settings - shared across all modules */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div 
                onClick={() => navigate('/system-settings')}
                className={cn(
                  "flex items-center px-6 py-3 cursor-pointer transition-colors border-l-4",
                  location.pathname === '/system-settings'
                    ? "bg-blue-600/20 border-blue-500 text-white" 
                    : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Settings className="w-4 h-4 mr-3" />
                <span className="text-sm font-medium">系统设置</span>
              </div>
            </div>
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
              <span className="text-slate-800 font-medium">
                {GROUP_BREADCRUMB_MAP[location.pathname] || getPageLabel(location.pathname)}
              </span>
              {(location.pathname === '/submit-form' || location.pathname === '/staff-approval' || location.pathname === '/system-settings' || WAREHOUSE_SUB_PAGES.includes(location.pathname)) && (
                <>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-blue-600 font-medium">{getPageLabel(location.pathname)}</span>
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
      </WarehouseProvider>
    </AppProvider>
  );
}

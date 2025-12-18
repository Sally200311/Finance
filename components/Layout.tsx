
import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  PieChart, 
  LogOut,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: any) => void;
  user: any;
  isDemo: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, user, isDemo }) => {
  const handleLogout = () => {
    if (auth) signOut(auth);
  };

  const navItems = [
    { id: 'dashboard', label: '儀表板', icon: LayoutDashboard },
    { id: 'accounts', label: '帳戶管理', icon: Wallet },
    { id: 'transactions', label: '收支紀錄', icon: ArrowRightLeft },
    { id: 'reports', label: '統計報告', icon: PieChart },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="p-2 bg-indigo-600 rounded-lg">
               <Wallet className="w-5 h-5 text-white" />
            </span>
            SmartFinance
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.email || '訪客用戶'}</p>
              {isDemo && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">離線展示模式</span>}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            登出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {isDemo && (
          <div className="bg-amber-50 border-b border-amber-100 p-2 flex items-center justify-center gap-2 text-amber-800 text-sm">
            <ShieldAlert className="w-4 h-4" />
            目前為離線展示模式，數據將不會儲存至資料庫。
          </div>
        )}
        <div className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

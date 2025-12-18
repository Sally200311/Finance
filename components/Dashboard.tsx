
import React, { useMemo } from 'react';
import { BankAccount, Transaction, Category } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';
import AIInsights from './AIInsights';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories }) => {
  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthlyIncome = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.type === 'income';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear && t.type === 'expense';
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalBalance, monthlyIncome, monthlyExpense };
  }, [accounts, transactions]);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">早安，理財管家</h2>
        <p className="text-slate-500 mt-1">這是您的財務概況</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="font-medium opacity-90">總資產</span>
          </div>
          <h3 className="text-3xl font-bold">$ {stats.totalBalance.toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="font-medium text-slate-500">本月收入</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">$ {stats.monthlyIncome.toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="font-medium text-slate-500">本月支出</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">$ {stats.monthlyExpense.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-slate-800">最近活動</h4>
            <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((tx) => {
              const category = categories.find(c => c.id === tx.categoryId);
              const Icon = category ? CATEGORY_ICONS[category.icon] : Wallet;
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${category?.color || 'bg-slate-100'} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{tx.note || category?.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {tx.date}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                  </p>
                </div>
              );
            })}
            {recentTransactions.length === 0 && (
              <p className="text-center text-slate-400 py-8">目前尚無紀錄</p>
            )}
          </div>
        </div>

        {/* AI Insight Section */}
        <AIInsights transactions={transactions} accounts={accounts} categories={categories} />
      </div>
    </div>
  );
};

export default Dashboard;

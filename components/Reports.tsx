
import React, { useMemo } from 'react';
import { Transaction, Category, BankAccount } from '../types';
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: BankAccount[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, categories, accounts }) => {
  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = categories.map(cat => {
      const value = expenses
        .filter(t => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: cat.name, value, color: cat.color.replace('bg-', '') };
    }).filter(c => c.value > 0);
    return grouped;
  }, [transactions, categories]);

  const monthlyTrend = useMemo(() => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const currentYear = new Date().getFullYear();
    
    return months.map((m, i) => {
      const income = transactions
        .filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === i && d.getFullYear() === currentYear && t.type === 'income';
        })
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expense = transactions
        .filter(t => {
          const d = new Date(t.date);
          return d.getMonth() === i && d.getFullYear() === currentYear && t.type === 'expense';
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return { name: m, 收入: income, 支出: expense };
    });
  }, [transactions]);

  // Map Tailwind color names to Hex for Recharts
  const COLORS = {
    orange: '#f97316', blue: '#3b82f6', pink: '#ec4899', indigo: '#6366f1', 
    yellow: '#eab308', red: '#ef4444', green: '#22c55e', emerald: '#10b981', 
    purple: '#a855f7', cyan: '#06b6d4', slate: '#64748b'
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">統計報告</h2>
        <p className="text-slate-500 mt-1">透過圖表洞察您的財務狀況</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Distribution */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">支出比例分析</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => {
                    const colorKey = entry.color.split('-')[0] as keyof typeof COLORS;
                    return <Cell key={`cell-${index}`} fill={COLORS[colorKey] || '#6366f1'} />;
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '金額']}
                />
                <Legend iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-800 mb-6">年度收支趨勢</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend iconType="circle" verticalAlign="top" align="right" height={36} />
                <Bar dataKey="收入" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="支出" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

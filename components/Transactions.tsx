
import React, { useState } from 'react';
import { Transaction, BankAccount, Category } from '../types';
import { Plus, Search, Calendar, Tag, DollarSign, X } from 'lucide-react';
import { CATEGORY_ICONS } from '../constants';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  categories: Category[];
  onAdd: (tx: Omit<Transaction, 'id'>) => Promise<void>;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, accounts, categories, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form State
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const filteredTransactions = transactions
    .filter(t => t.note.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId || !categoryId) return;
    
    await onAdd({
      type,
      amount: parseFloat(amount),
      accountId,
      categoryId,
      date,
      note
    });
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setAccountId('');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <header>
          <h2 className="text-3xl font-bold text-slate-800">收支紀錄</h2>
          <p className="text-slate-500 mt-1">追蹤您的每一筆開銷與收入</p>
        </header>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> 新增紀錄
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜尋紀錄或備註..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-8 py-5">日期</th>
                <th className="px-8 py-5">類別</th>
                <th className="px-8 py-5">備註</th>
                <th className="px-8 py-5">帳戶</th>
                <th className="px-8 py-5 text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map(tx => {
                const category = categories.find(c => c.id === tx.categoryId);
                const account = accounts.find(a => a.id === tx.accountId);
                const Icon = category ? CATEGORY_ICONS[category.icon] : Tag;
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-sm text-slate-500 whitespace-nowrap">{tx.date}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category?.color || 'bg-slate-200'} text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800">{category?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">{tx.note || '-'}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">{account?.name || '未知帳戶'}</span>
                    </td>
                    <td className={`px-8 py-5 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">目前尚無收支紀錄</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">新增收支</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${type === 'expense' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                >支出</button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >收入</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">金額</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="number"
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">日期</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="date"
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">帳戶</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  >
                    <option value="">選擇帳戶</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">類別</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">選擇類別</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">備註</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 h-24"
                  placeholder="輸入紀錄詳細內容..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
              >
                儲存紀錄
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;


import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Trash2, Edit2, Wallet, X } from 'lucide-react';

interface AccountsProps {
  accounts: BankAccount[];
  onAdd: (account: Omit<BankAccount, 'id'>) => Promise<void>;
  onUpdate: (id: string, updates: Partial<BankAccount>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Checking');
  const [color, setColor] = useState('bg-indigo-600');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      name,
      balance: parseFloat(balance),
      type,
      color
    });
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setBalance('');
    setType('Checking');
    setColor('bg-indigo-600');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <header>
          <h2 className="text-3xl font-bold text-slate-800">帳戶管理</h2>
          <p className="text-slate-500 mt-1">管理您的銀行帳戶與錢包</p>
        </header>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> 新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 ${acc.color} rounded-2xl text-white`}>
                <Wallet className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onDelete(acc.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-800">{acc.name}</h4>
            <p className="text-slate-400 text-sm">{acc.type}</p>
            <div className="mt-4 pt-4 border-t border-slate-50">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">目前餘額</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">$ {acc.balance.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">新增帳戶</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">帳戶名稱</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  placeholder="例如：中國信託、我的錢包"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">初始餘額</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  placeholder="0.00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">帳戶類型</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Checking">活期存款</option>
                  <option value="Savings">儲蓄帳戶</option>
                  <option value="Credit">信用卡</option>
                  <option value="Cash">現金</option>
                  <option value="Investment">投資帳戶</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">標籤顏色</label>
                <div className="flex gap-3">
                  {['bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-slate-600'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-4 ring-slate-100 ring-offset-2' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-indigo-100"
              >
                儲存帳戶
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;

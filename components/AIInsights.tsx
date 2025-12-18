
import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Transaction, BankAccount, Category } from '../types';
import { getFinancialAdvice } from '../geminiService';

interface AIInsightsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  categories: Category[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions, accounts, categories }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const advice = await getFinancialAdvice(transactions, accounts, categories);
      setInsight(advice);
    } catch (err) {
      setInsight("獲取建議時發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="w-32 h-32" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold">AI 智慧理財建議</h4>
        </div>

        {!insight && !loading ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
            <p className="text-indigo-100 text-lg">讓 Gemini AI 分析您的近期收支狀況，為您提供個人化的財務建議。</p>
            <button 
              onClick={fetchAdvice}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg"
            >
              開始分析
            </button>
          </div>
        ) : loading ? (
          <div className="flex-1 flex flex-col justify-center items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-white/50" />
            <p className="text-indigo-100 animate-pulse">正在深度分析您的財務數據...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
              <p className="text-indigo-50 leading-relaxed whitespace-pre-wrap">
                {insight}
              </p>
            </div>
            <button 
              onClick={fetchAdvice}
              className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4" /> 重新分析
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;

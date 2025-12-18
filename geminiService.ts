
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, Category } from "./types";

export const getFinancialAdvice = async (
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "AI 服務目前未設定。請在 GitHub Secrets 中配置 API_KEY 以獲得建議。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare context for the prompt
    const summary = transactions.slice(0, 50).map(t => {
      const cat = categories.find(c => c.id === t.categoryId)?.name || '未知';
      return `${t.date}: ${t.type === 'income' ? '+' : '-'}${t.amount} (${cat}) - ${t.note}`;
    }).join('\n');

    const accountSummary = accounts.map(a => `${a.name}: ${a.balance}`).join(', ');

    const prompt = `
      你是一位專業的個人理財顧問。請根據以下財務紀錄提供 3 點具體的建議：
      
      帳戶餘額：${accountSummary}
      近期紀錄（前50筆）：
      ${summary}
      
      請直接回覆 3 個條列式的重點，字數簡潔。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
    });

    return response.text || "AI 暫時無法生成建議，請稍後再試。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "呼叫 AI 服務時發生錯誤。";
  }
};

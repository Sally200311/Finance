
import React from 'react';
import { 
  Utensils, Car, ShoppingBag, Home, Zap, 
  Heart, GraduationCap, Briefcase, TrendingUp, 
  PiggyBank, MoreHorizontal 
} from 'lucide-react';

export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: '飲食', icon: 'Utensils', color: 'bg-orange-500' },
  { id: 'cat-2', name: '交通', icon: 'Car', color: 'bg-blue-500' },
  { id: 'cat-3', name: '購物', icon: 'ShoppingBag', color: 'bg-pink-500' },
  { id: 'cat-4', name: '居住', icon: 'Home', color: 'bg-indigo-500' },
  { id: 'cat-5', name: '娛樂', icon: 'Zap', color: 'bg-yellow-500' },
  { id: 'cat-6', name: '醫療', icon: 'Heart', color: 'bg-red-500' },
  { id: 'cat-7', name: '教育', icon: 'GraduationCap', color: 'bg-green-500' },
  { id: 'cat-8', name: '薪資', icon: 'Briefcase', color: 'bg-emerald-500' },
  { id: 'cat-9', name: '投資', icon: 'TrendingUp', color: 'bg-purple-500' },
  { id: 'cat-10', name: '儲蓄', icon: 'PiggyBank', color: 'bg-cyan-500' },
  { id: 'cat-other', name: '其他', icon: 'MoreHorizontal', color: 'bg-slate-500' },
];

export const CATEGORY_ICONS: Record<string, any> = {
  Utensils, Car, ShoppingBag, Home, Zap, 
  Heart, GraduationCap, Briefcase, TrendingUp, 
  PiggyBank, MoreHorizontal
};

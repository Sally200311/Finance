
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, where, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { auth, db, isDemoMode } from './firebase';
import { UserProfile, BankAccount, Transaction, Category } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import Layout from './components/Layout';
import AuthView from './components/Auth';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeView, setActiveView] = useState<'dashboard' | 'accounts' | 'transactions' | 'reports'>('dashboard');

  // Load Auth State
  useEffect(() => {
    if (isDemoMode) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth!, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync Data with Firestore
  useEffect(() => {
    if (!currentUser || !db) {
      if (isDemoMode) {
        // Sample data for demo mode
        setAccounts([
          { id: '1', name: '中國信託', balance: 50000, color: 'bg-green-600', type: 'Savings' },
          { id: '2', name: '國泰世華', balance: 12000, color: 'bg-red-600', type: 'Checking' }
        ]);
        setTransactions([
          { id: 't1', accountId: '1', amount: 30000, type: 'income', categoryId: 'cat-8', date: '2024-03-01', note: '薪資轉帳' },
          { id: 't2', accountId: '1', amount: 150, type: 'expense', categoryId: 'cat-1', date: '2024-03-02', note: '午餐' },
          { id: 't3', accountId: '2', amount: 1200, type: 'expense', categoryId: 'cat-2', date: '2024-03-03', note: '加油' }
        ]);
      }
      return;
    }

    const qAccounts = query(collection(db, 'accounts'), where('userId', '==', currentUser.uid));
    const unsubAccounts = onSnapshot(qAccounts, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BankAccount)));
    });

    const qTransactions = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });

    return () => {
      unsubAccounts();
      unsubTransactions();
    };
  }, [currentUser]);

  const handleAddAccount = async (account: Omit<BankAccount, 'id'>) => {
    if (isDemoMode) return;
    await addDoc(collection(db!, 'accounts'), { ...account, userId: currentUser!.uid });
  };

  const handleUpdateAccount = async (id: string, updates: Partial<BankAccount>) => {
    if (isDemoMode) return;
    await updateDoc(doc(db!, 'accounts', id), updates);
  };

  const handleDeleteAccount = async (id: string) => {
    if (isDemoMode) return;
    await deleteDoc(doc(db!, 'accounts', id));
  };

  const handleAddTransaction = async (tx: Omit<Transaction, 'id'>) => {
    if (isDemoMode) return;
    await addDoc(collection(db!, 'transactions'), { ...tx, userId: currentUser!.uid });
    
    // Update account balance
    const account = accounts.find(a => a.id === tx.accountId);
    if (account) {
      const newBalance = tx.type === 'income' ? account.balance + tx.amount : account.balance - tx.amount;
      await updateDoc(doc(db!, 'accounts', tx.accountId), { balance: newBalance });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentUser && !isDemoMode) {
    return <AuthView />;
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} user={currentUser} isDemo={isDemoMode}>
      {activeView === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} categories={categories} />}
      {activeView === 'accounts' && <Accounts accounts={accounts} onAdd={handleAddAccount} onUpdate={handleUpdateAccount} onDelete={handleDeleteAccount} />}
      {activeView === 'transactions' && <Transactions transactions={transactions} accounts={accounts} categories={categories} onAdd={handleAddTransaction} />}
      {activeView === 'reports' && <Reports transactions={transactions} categories={categories} accounts={accounts} />}
    </Layout>
  );
};

export default App;

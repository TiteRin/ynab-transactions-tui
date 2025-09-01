import { Amount } from './Amount.js';

export interface Transaction {
  id: string;
  date: string;
  payee_name: string;
  amount: Amount;
  cleared: 'cleared' | 'uncleared' | 'reconciled';
  category_name: string;
}
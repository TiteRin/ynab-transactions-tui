import axios, { AxiosError } from 'axios';
import { Transaction } from '../types/Transaction.js';
import { Amount } from '../types/Amount.js';

interface YnabTransaction {
  id: string;
  date: string;
  payee_name: string;
  amount: number;
  cleared: 'cleared' | 'uncleared' | 'reconciled';
  category_name: string;
}

interface YnabTransactionsResponse {
  data: {
    transactions: YnabTransaction[];
  };
}

export class YnabClient {
  private readonly baseUrl = 'https://api.youneedabudget.com/v1';
  private readonly token: string;

  constructor(token: string) {
    if (!token || token.trim() === '') {
      throw new Error('Token is required');
    }
    this.token = token;
  }

  async getUnclearedTransactions(budgetId: string): Promise<Transaction[]> {
    if (!budgetId || budgetId.trim() === '') {
      throw new Error('Budget ID is required');
    }

    try {
      const response = await axios.get<YnabTransactionsResponse>(
        `${this.baseUrl}/budgets/${budgetId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );

      const ynabTransactions = response.data.data.transactions;
      
      // Filter only uncleared transactions and transform to our format
      return ynabTransactions
        .filter(transaction => transaction.cleared === 'uncleared')
        .map(this.transformYnabTransaction);

    } catch (error) {
      // Handle axios errors specifically
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          const message = (axiosError.response.data as any)?.error?.detail || 'Authentication failed';
          throw new Error(`Authentication failed: ${message}`);
        }
      }
      
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch transactions: ${message}`);
    }
  }

  async clearTransaction(budgetId: string, transactionId: string): Promise<void> {
    if (!budgetId || budgetId.trim() === '') {
      throw new Error('Budget ID is required');
    }
    if (!transactionId || transactionId.trim() === '') {
      throw new Error('Transaction ID is required');
    }

    try {
      await axios.patch(
        `${this.baseUrl}/budgets/${budgetId}/transactions/${transactionId}`,
        {
          transaction: {
            cleared: 'cleared'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );
    } catch (error) {
      // Handle axios errors specifically
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          const message = (axiosError.response.data as any)?.error?.detail || 'Authentication failed';
          throw new Error(`Authentication failed: ${message}`);
        }
      }
      
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to clear transaction: ${message}`);
    }
  }

  private transformYnabTransaction(ynabTransaction: YnabTransaction): Transaction {
    return {
      id: ynabTransaction.id,
      date: ynabTransaction.date,
      payee_name: ynabTransaction.payee_name,
      amount: Amount.fromMilliunits(ynabTransaction.amount),
      cleared: ynabTransaction.cleared,
      category_name: ynabTransaction.category_name
    };
  }
}
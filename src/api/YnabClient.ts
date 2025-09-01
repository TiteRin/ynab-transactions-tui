import axios, { AxiosError } from 'axios';
import type { Transaction } from '../types/Transaction.js';
import { Amount } from '../types/Amount.js';

interface YnabTransaction {
  id: string;
  date: string;
  amount: number;
  memo?: string;
  cleared: 'cleared' | 'uncleared' | 'reconciled';
  approved: boolean;
  flag_color?: string;
  flag_name?: string;
  account_id: string;
  payee_id?: string;
  category_id?: string;
  transfer_account_id?: string;
  transfer_transaction_id?: string;
  matched_transaction_id?: string;
  import_id?: string;
  import_payee_name?: string;
  import_payee_name_original?: string;
  debt_transaction_type?: string;
  deleted: boolean;
  account_name: string;
  payee_name?: string;
  category_name?: string;
  subtransactions: any[];
}

interface YnabTransactionsResponse {
  data: {
    transactions: YnabTransaction[];
  };
}

export class YnabClient {
  private readonly baseUrl = 'https://api.ynab.com/v1/';
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
        `${this.baseUrl}budgets/${budgetId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );

      const ynabTransactions = response.data.data.transactions;
      
      // Filter only uncleared transactions (not deleted) and transform to our format
      return ynabTransactions
        .filter(transaction => 
          transaction.cleared === 'uncleared' && 
          !transaction.deleted
        )
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
        `${this.baseUrl}budgets/${budgetId}/transactions/${transactionId}`,
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

  private transformYnabTransaction = (ynabTransaction: YnabTransaction): Transaction => {
    return {
      id: ynabTransaction.id,
      date: ynabTransaction.date,
      payee_name: ynabTransaction.payee_name || 'Unknown Payee',
      amount: Amount.fromMilliunits(ynabTransaction.amount),
      cleared: ynabTransaction.cleared,
      category_name: ynabTransaction.category_name || 'Uncategorized'
    };
  }
}

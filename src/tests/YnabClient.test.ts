import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YnabClient } from '../api/YnabClient.js';
import { Transaction } from '../types/Transaction.js';
import { Amount } from '../types/Amount.js';

// Mock axios
vi.mock('axios');

describe('YnabClient', () => {
  let client: YnabClient;
  const mockToken = 'test-token';
  const mockBudgetId = 'test-budget-id';

  beforeEach(() => {
    vi.clearAllMocks();
    client = new YnabClient(mockToken);
  });

  describe('getUnclearedTransactions', () => {
    it('should fetch and transform uncleared transactions from YNAB API', async () => {
      const mockYnabResponse = {
        data: {
          data: {
            transactions: [
              {
                id: 'txn-1',
                date: '2025-08-20',
                payee_name: 'Coffee Shop',
                amount: -4500,
                cleared: 'uncleared',
                category_name: 'Dining Out'
              },
              {
                id: 'txn-2',
                date: '2025-08-19',
                payee_name: 'Supermarket',
                amount: -32100,
                cleared: 'cleared', // This should be filtered out
                category_name: 'Groceries'
              },
              {
                id: 'txn-3',
                date: '2025-08-18',
                payee_name: 'Gas Station',
                amount: -6500,
                cleared: 'uncleared',
                category_name: 'Transportation'
              }
            ]
          }
        }
      };

      // Mock axios get method
      const axios = await import('axios');
      vi.mocked(axios.default.get).mockResolvedValue(mockYnabResponse);

      const transactions = await client.getUnclearedTransactions(mockBudgetId);

      expect(transactions).toHaveLength(2); // Only uncleared transactions
      expect(transactions[0]).toEqual({
        id: 'txn-1',
        date: '2025-08-20',
        payee_name: 'Coffee Shop',
        amount: Amount.fromMilliunits(-4500),
        cleared: 'uncleared',
        category_name: 'Dining Out'
      });
      expect(transactions[1]).toEqual({
        id: 'txn-3',
        date: '2025-08-18',
        payee_name: 'Gas Station',
        amount: Amount.fromMilliunits(-6500),
        cleared: 'uncleared',
        category_name: 'Transportation'
      });

      // Verify API call
      expect(axios.default.get).toHaveBeenCalledWith(
        `https://api.youneedabudget.com/v1/budgets/${mockBudgetId}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
    });

    it('should handle empty response', async () => {
      const mockEmptyResponse = {
        data: {
          data: {
            transactions: []
          }
        }
      };

      const axios = await import('axios');
      vi.mocked(axios.default.get).mockResolvedValue(mockEmptyResponse);

      const transactions = await client.getUnclearedTransactions(mockBudgetId);

      expect(transactions).toEqual([]);
    });

    it('should throw error when API request fails', async () => {
      const axios = await import('axios');
      vi.mocked(axios.default.get).mockRejectedValue(new Error('Network error'));

      await expect(client.getUnclearedTransactions(mockBudgetId))
        .rejects.toThrow('Failed to fetch transactions: Network error');
    });

    it('should throw error for invalid token (401)', async () => {
      const axios = await import('axios');
      const error = {
        response: {
          status: 401,
          data: { error: { detail: 'Invalid token' } }
        }
      };
      vi.mocked(axios.default.get).mockRejectedValue(error);

      await expect(client.getUnclearedTransactions(mockBudgetId))
        .rejects.toThrow('Authentication failed: Invalid token');
    });
  });

  describe('clearTransaction', () => {
    it('should mark a transaction as cleared', async () => {
      const mockResponse = {
        data: {
          data: {
            transaction: {
              id: 'txn-1',
              cleared: 'cleared'
            }
          }
        }
      };

      const axios = await import('axios');
      vi.mocked(axios.default.patch).mockResolvedValue(mockResponse);

      await client.clearTransaction(mockBudgetId, 'txn-1');

      expect(axios.default.patch).toHaveBeenCalledWith(
        `https://api.youneedabudget.com/v1/budgets/${mockBudgetId}/transactions/txn-1`,
        {
          transaction: {
            cleared: 'cleared'
          }
        },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
    });

    it('should throw error when clearing transaction fails', async () => {
      const axios = await import('axios');
      vi.mocked(axios.default.patch).mockRejectedValue(new Error('Network error'));

      await expect(client.clearTransaction(mockBudgetId, 'txn-1'))
        .rejects.toThrow('Failed to clear transaction: Network error');
    });
  });

  describe('validation', () => {
    it('should throw error for empty token', () => {
      expect(() => new YnabClient('')).toThrow('Token is required');
    });

    it('should throw error for empty budget ID', async () => {
      await expect(client.getUnclearedTransactions(''))
        .rejects.toThrow('Budget ID is required');
    });
  });
});
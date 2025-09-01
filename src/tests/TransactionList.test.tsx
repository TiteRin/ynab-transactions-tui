import React from 'react';
import { render } from 'ink-testing-library';
import { describe, it, expect } from 'vitest';
import { TransactionList } from '../components/TransactionList.js';
import { Transaction } from '../types/Transaction.js';
import { Amount } from '../types/Amount.js';

describe('TransactionList', () => {
  it('should display a list of transactions', () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2025-08-20',
        payee_name: 'Coffee Shop',
        amount: Amount.fromMilliunits(-4500),
        cleared: 'uncleared',
        category_name: 'Dining Out'
      },
      {
        id: '2', 
        date: '2025-08-19',
        payee_name: 'Supermarket',
        amount: Amount.fromMilliunits(-32100),
        cleared: 'uncleared',
        category_name: 'Groceries'
      }
    ];

    const { lastFrame } = render(<TransactionList transactions={mockTransactions} />);
    
    expect(lastFrame()).toContain('Coffee Shop');
    expect(lastFrame()).toContain('Supermarket');
    expect(lastFrame()).toContain('-4.50');
    expect(lastFrame()).toContain('-32.10');
  });
});
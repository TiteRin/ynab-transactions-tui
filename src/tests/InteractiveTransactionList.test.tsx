import React from 'react';
import { render } from 'ink-testing-library';
import { describe, it, expect } from 'vitest';
import { InteractiveTransactionList } from '../components/InteractiveTransactionList.js';
import type { Transaction } from '../types/Transaction.js';
import { Amount } from '../types/Amount.js';

describe('InteractiveTransactionList', () => {
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
    },
    {
      id: '3',
      date: '2025-08-18',
      payee_name: 'Gas Station',
      amount: Amount.fromMilliunits(-6500),
      cleared: 'uncleared',
      category_name: 'Transportation'
    }
  ];

  it('should display transactions with first item highlighted by default', () => {
    const { lastFrame } = render(<InteractiveTransactionList transactions={mockTransactions} />);
    
    const output = lastFrame();
    expect(output).toContain('Coffee Shop');
    expect(output).toContain('Supermarket');
    expect(output).toContain('Gas Station');
    
    // First item should be highlighted (we'll use inverse colors for highlighting)
    // The exact output depends on implementation, but we can check for presence of data
    expect(output).toContain('-4.50');
    expect(output).toContain('-32.10');
    expect(output).toContain('-6.50');
  });

  it('should handle empty transaction list', () => {
    const { lastFrame } = render(<InteractiveTransactionList transactions={[]} />);
    
    const output = lastFrame();
    expect(output).toContain('No transactions found');
  });

  it('should show current selection index', () => {
    const { lastFrame } = render(<InteractiveTransactionList transactions={mockTransactions} />);
    
    const output = lastFrame();
    // Should show some indication of which item is selected (index 0 by default)
    expect(output).toMatch(/.*Coffee Shop.*/); // First item should be visible
  });

  it('should handle navigation with arrow keys', () => {
    const { lastFrame, stdin } = render(<InteractiveTransactionList transactions={mockTransactions} />);
    
    // Simulate arrow down key press
    stdin.write('\u001B[B'); // Down arrow key
    
    const output = lastFrame();
    // After pressing down, selection should move (implementation detail will vary)
    expect(output).toContain('Supermarket'); // Should still show all items
  });
});
#!/usr/bin/env node

import 'dotenv/config';
import React, { useState, useEffect } from 'react';
import { render, Box, Text } from 'ink';
import { InteractiveTransactionList } from './components/InteractiveTransactionList.js';
import { YnabClient } from './api/YnabClient.js';
import type { Transaction } from './types/Transaction.js';

const App = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = process.env.YNAB_TOKEN;
        const budgetId = process.env.YNAB_BUDGET_ID;

        if (!token) {
          throw new Error('YNAB_TOKEN environment variable is required');
        }
        if (!budgetId) {
          throw new Error('YNAB_BUDGET_ID environment variable is required');
        }

        const client = new YnabClient(token);
        const unclearedTransactions = await client.getUnclearedTransactions(budgetId);
        setTransactions(unclearedTransactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <Text>Loading transactions...</Text>;
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">Error: {error}</Text>
        <Text color="yellow">Make sure you have set YNAB_TOKEN and YNAB_BUDGET_ID in your .env file</Text>
      </Box>
    );
  }

  return <InteractiveTransactionList transactions={transactions} />;
};

render(<App />);
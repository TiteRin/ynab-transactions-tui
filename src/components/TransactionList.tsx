import React from 'react';
import { Box, Text } from 'ink';
import type { Transaction } from '../types/Transaction.js';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <Box flexDirection="column">
      {transactions.map((transaction) => (
        <Box key={transaction.id} flexDirection="row">
          <Text>{transaction.date} | </Text>
          <Text>{transaction.payee_name} | </Text>
          <Text>{transaction.amount.format()} | </Text>
          <Text>{transaction.cleared}</Text>
        </Box>
      ))}
    </Box>
  );
};
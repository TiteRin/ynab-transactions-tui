import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Transaction } from '../types/Transaction.js';

interface InteractiveTransactionListProps {
  transactions: Transaction[];
}

export const InteractiveTransactionList: React.FC<InteractiveTransactionListProps> = ({ transactions }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle keyboard input
  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => Math.min(transactions.length - 1, prev + 1));
    }
  });

  // Reset selection when transactions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <Box>
        <Text color="yellow">No transactions found</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="blue">Uncleared Transactions:</Text>
      <Text color="gray">Use ↑/↓ arrows to navigate</Text>
      <Box height={1} />
      
      {transactions.map((transaction, index) => {
        const isSelected = index === selectedIndex;
        
        return (
          <Box key={transaction.id} flexDirection="row">
            {isSelected ? (
              <Text backgroundColor="blue" color="white">
                {transaction.date} | {transaction.payee_name.padEnd(20)} | {transaction.amount.format().padStart(8)} | {transaction.category_name}
              </Text>
            ) : (
              <Text>
                {transaction.date} | {transaction.payee_name.padEnd(20)} | {transaction.amount.format().padStart(8)} | {transaction.category_name}
              </Text>
            )}
          </Box>
        );
      })}
      
      <Box height={1} />
      <Text color="gray">
        Selected: {selectedIndex + 1} of {transactions.length}
      </Text>
    </Box>
  );
};
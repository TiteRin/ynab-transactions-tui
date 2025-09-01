#!/usr/bin/env node

import React from 'react';
import { render, Text } from 'ink';

const App = () => {
  return <Text color="green">🎉 YNAB TUI is working!</Text>;
};

render(<App />);
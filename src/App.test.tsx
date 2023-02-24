import React from 'react';
import { render, screen } from '@testing-library/react';
import App, {appHeader} from './App';
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(appHeader);
  expect(linkElement).toBeInTheDocument();
});

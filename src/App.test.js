import { render, screen } from '@testing-library/react';
import App from './App';
import RouteNav from './routes/RouteNav';

test('renders learn react link', () => {
  render(<RouteNav/>);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

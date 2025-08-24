import { render } from '@testing-library/react';
import App from './App';

test('renders application container', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.vezir-app')).toBeInTheDocument();
});

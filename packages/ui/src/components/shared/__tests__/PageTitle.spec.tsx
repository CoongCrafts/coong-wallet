import { cleanup, render, screen } from '@testing-library/react';
import PageTitle from '../PageTitle';

afterEach(() => {
  cleanup();
});

describe('PageTitle', () => {
  it('should render page title', () => {
    render(<PageTitle className='custom-class'>Accounts</PageTitle>);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toHaveClass('text-3xl font-bold custom-class');
  });
});

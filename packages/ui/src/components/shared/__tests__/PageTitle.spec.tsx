import { render, screen } from '__tests__/testUtils';
import PageTitle from '../PageTitle';

describe('PageTitle', () => {
  it('should render page title', () => {
    render(<PageTitle className='custom-class'>Accounts</PageTitle>);
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toHaveClass('text-3xl font-bold custom-class');
  });
});

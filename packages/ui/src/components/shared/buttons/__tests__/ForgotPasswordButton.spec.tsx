import { UserEvent, render, newUser, screen } from '__tests__/testUtils';
import { beforeEach } from 'vitest';
import ForgotPasswordButton from '../ForgotPasswordButton';

describe('ForgotPasswordButton', () => {
  let user: UserEvent;
  beforeEach(() => {
    render(<ForgotPasswordButton />);

    user = newUser();
  });

  it('should show the button', async () => {
    expect(await screen.findByRole('button', { name: /Forgot your password/ })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: /Forgot your password/ })).not.toBeInTheDocument();
  });

  it('should show the dialog when clicking the button', async () => {
    await user.click(await screen.findByRole('button', { name: /Forgot your password/ }));
    expect(await screen.findByRole('dialog', { name: /Forgot your password/ })).toBeInTheDocument();
    expect(await screen.findByLabelText(/Reset wallet/)).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Reset Wallet/ })).toBeDisabled();
  });
});

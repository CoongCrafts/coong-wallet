import { waitFor } from '@testing-library/react';
import { encodeAddress } from '@polkadot/util-crypto';
import { defaultNetwork, networks } from '@coong/base';
import { AccountInfo } from '@coong/keyring/types';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, PASSWORD, render, screen } from '__tests__/testUtils';
import Accounts from '../index';

const preloadedState = { app: { addressPrefix: defaultNetwork.prefix } };

describe('Accounts', () => {
  describe('have no accounts', () => {
    it('should show a message to create new account', async () => {
      render(<Accounts />, { preloadedState });
      expect(await screen.findByText(/No accounts found in wallet/)).toBeInTheDocument();
      expect(await screen.findByText(/Create your first account now/)).toBeEnabled();
    });
  });

  describe('have accounts', () => {
    let account01: AccountInfo, account02: AccountInfo, user: UserEvent;
    beforeEach(async () => {
      const keyring = await initializeKeyring();
      account01 = await keyring.createNewAccount('Account 01', PASSWORD);
      account02 = await keyring.createNewAccount('Account 02', PASSWORD);

      user = newUser({ writeToClipboard: true });
    });

    it('should list the accounts', async () => {
      render(<Accounts />, { preloadedState });
      expect(await screen.findByText(/Account 01/)).toBeInTheDocument();
      expect(await screen.findByText(account01.address)).toBeInTheDocument();

      expect(await screen.findByText(/Account 02/)).toBeInTheDocument();
      expect(await screen.findByText(account02.address)).toBeInTheDocument();
    });

    it('should only show searched accounts', async () => {
      render(<Accounts />, { preloadedState });
      const searchField = await screen.findByLabelText('Search by name');
      await user.type(searchField, '01');

      expect(await screen.findByText(/Account 01/)).toBeInTheDocument();
      expect(await screen.findByText(account01.address)).toBeInTheDocument();

      expect(screen.queryByText(/Account 02/)).not.toBeInTheDocument();
      expect(screen.queryByText(account02.address)).not.toBeInTheDocument();
    });

    it('should show no accounts found message', async () => {
      render(<Accounts />, { preloadedState });
      const searchField = await screen.findByLabelText('Search by name');
      await user.type(searchField, 'random-word');

      expect(await screen.findByText(/No accounts meet search query:/)).toBeInTheDocument();
      expect(screen.queryByText(/Account 01/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Account 02/)).not.toBeInTheDocument();
    });

    it('should change address format', async () => {
      render(<Accounts />, { preloadedState });
      const searchField = await screen.findByLabelText('Address format');
      await user.click(searchField);

      const acalaOption = await screen.findByText('Acala');
      await user.click(acalaOption);

      expect(searchField).toHaveDisplayValue('Acala');
      const { prefix } = networks.find((one) => one.displayName === 'Acala')!;
      expect(await screen.findByText(encodeAddress(account01.address, prefix))).toBeInTheDocument();
      expect(await screen.findByText(encodeAddress(account02.address, prefix))).toBeInTheDocument();
    });

    it('should show click to copy address popup', async () => {
      // prevent showing error when copy method does not work
      vi.spyOn(window, 'prompt').mockImplementation(() => '');

      render(<Accounts />, { preloadedState });
      const addressText = await screen.findByText(account01.address);
      expect(addressText).toBeInTheDocument();

      await user.hover(addressText);

      expect(await screen.findByText('Click to copy address')).toBeVisible();

      await user.click(addressText);

      expect(await screen.findByText('Address copied!')).toBeVisible();

      await user.unhover(addressText);
      expect(await screen.queryByText('Address copied!')).not.toBeVisible();
    });

    describe('AccountControls', () => {
      it('should show account settings menu', async () => {
        render(<Accounts />, { preloadedState });

        const accountControlsButtons = await screen.findAllByTitle(/Open account controls/);
        // clicking on account settings of account 01
        await user.click(accountControlsButtons[0]);

        expect(await screen.findByRole('menuitem', { name: /Remove/ })).toBeInTheDocument();
      });

      it('should not list the account was removed', async () => {
        render(<Accounts />, { preloadedState });

        const accountControlsButtons = await screen.findAllByTitle(/Open account controls/);
        // clicking on account settings of account 01
        await user.click(accountControlsButtons[0]);

        const removeActionButton = await screen.findByRole('menuitem', { name: /Remove/ });
        await user.click(removeActionButton);

        const removeAccountButton = await screen.findByRole('button', { name: /Remove this account/ });
        await user.click(removeAccountButton);

        await waitFor(() => {
          expect(screen.queryByText(/Account 01 removed/)).toBeInTheDocument();
          expect(screen.queryByText(/Account 01/)).not.toBeInTheDocument();
          expect(screen.queryByText(/Account 02/)).toBeInTheDocument();
        });
      });
    });
  });
});

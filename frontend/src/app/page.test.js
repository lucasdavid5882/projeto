// tests/page.test.js
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import Home from '../app/page';
import axios from 'axios';
import '@testing-library/jest-dom';

// 1. Mock axios and Next.js Link
jest.mock('axios');
jest.mock('next/link', () => ({ children, href }) => (
  <a href={href}>{children}</a>
));

describe('Home Component', () => {
  const mockCharacters = [
    {
      characterGameId: 1,
      name: 'Kazuya',
      pictureUrl: '/kazuya.jpg'
    },
    {
      characterGameId: 2,
      name: 'Jin',
      pictureUrl: '/jin.jpg'
    }
  ];

  // 2. Setup and teardown
  beforeEach(() => {
    axios.get.mockReset();
    axios.get.mockResolvedValue({ data: mockCharacters });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // 3. Main test cases
  describe('Initial Render', () => {
    it('shows loading state then displays characters', async () => {
        render(<Home />);

        // Assert loading state
        expect(await screen.findByText('Loading characters...')).toBeInTheDocument();
      
        // Wait for characters to appear
        await waitFor(() => {
          expect(screen.getByText('Kazuya')).toBeInTheDocument();
          expect(screen.getByText('Jin')).toBeInTheDocument();
        });
      
        // Ensure loading is gone
        expect(screen.queryByText('Loading characters...')).toBeNull();
    });

    it('renders game selector with default value', async () => {
      await act(async () => {
        render(<Home />);
      });

      const selector = screen.getByRole('combobox');
      expect(selector).toHaveValue('tk8');
      expect(screen.getAllByRole('option').length).toBe(2);
    });
  });

  describe('Game Selection', () => {
    it('changes game and fetches new characters', async () => {
      await act(async () => {
        render(<Home />);
      });

      await act(async () => {
        fireEvent.change(screen.getByRole('combobox'), {
          target: { value: 'tk7' }
        });
      });

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:3001/character/tk7'
      );
    });
  });

  describe('Error Handling', () => {
    it('displays error message when fetch fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValueOnce(new Error('API Error'));

      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        expect(screen.getByText('We had a problem loading the data')).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Character Display', () => {
    it('renders correct character links and images', async () => {
      await act(async () => {
        render(<Home />);
      });

      await waitFor(() => {
        const links = screen.getAllByRole('link', { name: /View Moves/i });
        expect(links[0]).toHaveAttribute('href', '/tk8/kazuya');
        expect(links[1]).toHaveAttribute('href', '/tk8/jin');

        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', '/kazuya.jpg');
        expect(images[1]).toHaveAttribute('src', '/jin.jpg');
      });
    });
  });
});
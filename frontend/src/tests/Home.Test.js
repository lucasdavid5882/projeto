import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Home from '../app/page';  // Adjust the path if needed

jest.mock('axios');  // Mock axios for API calls

describe('Home Page', () => {
  it('should display a loading message initially', () => {
    render(<Home />);
    expect(screen.getByText(/Loading characters.../i)).toBeInTheDocument();
  });

  it('should render characters when API returns data', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ characterGameId: 1, name: 'Character 1', pictureUrl: 'https://placeimg.com/200/200/any' }]
    });

    render(<Home />);
    
    await waitFor(() => screen.getByText(/Character 1/));

    expect(screen.getByText(/Character 1/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Moves/i })).toHaveAttribute('href', '/tk8/character 1');
  });

  it('should handle error if no characters are fetched', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching characters'));

    render(<Home />);
    
    await waitFor(() => screen.getByText(/We had a problem loading the data/i));
    
    expect(screen.getByText(/We had a problem loading the data/i)).toBeInTheDocument();
  });

  it('should allow game selection change', () => {
    render(<Home />);
    
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'tk7' } });

    expect(selectElement.value).toBe('tk7');
  });
});

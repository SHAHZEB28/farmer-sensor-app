
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionForm from './submissionForm';

describe('SubmissionForm', () => {
  test('renders the form and submits data', () => {
    const mockOnNewData = jest.fn();
    render(<SubmissionForm onNewData={mockOnNewData} />);

   
    expect(screen.getByText('Submit a Reading')).toBeInTheDocument();

  
    const valueInput = screen.getByLabelText('Value');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    
    fireEvent.change(valueInput, { target: { value: '25' } });
    expect(valueInput.value).toBe('25');

  
    fireEvent.click(submitButton);
  });
});
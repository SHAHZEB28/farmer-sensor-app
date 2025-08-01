// frontend/src/Components/submissionForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubmissionForm from './submissionForm';

describe('SubmissionForm', () => {
  test('renders the form and submits data', () => {
    const mockOnNewData = jest.fn();
    render(<SubmissionForm onNewData={mockOnNewData} />);

    // Check if the main heading is there
    expect(screen.getByText('Submit a Reading')).toBeInTheDocument();

    // Find the value input and the submit button
    const valueInput = screen.getByLabelText('Value');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Simulate user typing a value
    fireEvent.change(valueInput, { target: { value: '25' } });
    expect(valueInput.value).toBe('25');

    // Simulate clicking the submit button
    fireEvent.click(submitButton);
  });
});
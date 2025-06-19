import React, { useEffect, useState } from 'react';
import { formService } from '../services/api';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to create a test form
        const testForm = {
          title: 'Test Form',
          fields: [
            {
              type: 'text',
              label: 'Test Field',
              required: true
            }
          ]
        };

        const response = await formService.createForm(testForm);
        setStatus('Connection successful! Form created with ID: ' + response.id);
      } catch (err) {
        setError(err.message);
        setStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      <div className={`p-4 rounded ${error ? 'bg-red-100' : 'bg-green-100'}`}>
        <p className="font-semibold">{status}</p>
        {error && (
          <p className="text-red-600 mt-2">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestConnection; 
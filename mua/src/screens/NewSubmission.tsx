import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  insuredName: string;
  address: string;
  lineOfBusiness: string;
  broker: string;
}

// MCP tracking and component context logic has been fully removed from user-facing code.
// If MCP developer/automation tracking is needed, see src/devtools/MCPProvider.tsx and src/devtools/useMCP.ts.

const NewSubmission: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    insuredName: '',
    address: '',
    lineOfBusiness: '',
    broker: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.insuredName.trim()) {
      newErrors.insuredName = 'Insured name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.lineOfBusiness.trim()) {
      newErrors.lineOfBusiness = 'Line of business is required';
    }
    if (!formData.broker.trim()) {
      newErrors.broker = 'Broker is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement actual submission logic
      // For now, just navigate back to dashboard
      navigate('/');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Submission</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="insuredName" className="block text-sm font-medium text-gray-700">
            Insured Name
          </label>
          <input
            type="text"
            id="insuredName"
            name="insuredName"
            value={formData.insuredName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.insuredName ? 'border-red-300' : 'border-gray-300'
            } focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.insuredName && (
            <p className="mt-1 text-sm text-red-600">{errors.insuredName}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            } focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div>
          <label htmlFor="lineOfBusiness" className="block text-sm font-medium text-gray-700">
            Line of Business
          </label>
          <input
            type="text"
            id="lineOfBusiness"
            name="lineOfBusiness"
            value={formData.lineOfBusiness}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.lineOfBusiness ? 'border-red-300' : 'border-gray-300'
            } focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.lineOfBusiness && (
            <p className="mt-1 text-sm text-red-600">{errors.lineOfBusiness}</p>
          )}
        </div>

        <div>
          <label htmlFor="broker" className="block text-sm font-medium text-gray-700">
            Broker
          </label>
          <input
            type="text"
            id="broker"
            name="broker"
            value={formData.broker}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.broker ? 'border-red-300' : 'border-gray-300'
            } focus:border-primary-500 focus:ring-primary-500`}
          />
          {errors.broker && (
            <p className="mt-1 text-sm text-red-600">{errors.broker}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create Submission
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewSubmission;
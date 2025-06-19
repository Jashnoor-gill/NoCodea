import React from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const FormTemplates = ({ isOpen, onClose, onLoadTemplate }) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'contact',
      name: 'Contact Form',
      description: 'Basic contact form with name, email, and message fields',
      icon: <EnvelopeIcon className="h-8 w-8 text-blue-500" />,
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
        { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
        { id: '3', type: 'text', label: 'Subject', required: true, placeholder: 'Enter subject' },
        { id: '4', type: 'textarea', label: 'Message', required: true, placeholder: 'Enter your message' }
      ]
    },
    {
      id: 'registration',
      name: 'Registration Form',
      description: 'User registration form with personal details',
      icon: <UserIcon className="h-8 w-8 text-green-500" />,
      fields: [
        { id: '1', type: 'text', label: 'First Name', required: true, placeholder: 'Enter first name' },
        { id: '2', type: 'text', label: 'Last Name', required: true, placeholder: 'Enter last name' },
        { id: '3', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter email address' },
        { id: '4', type: 'text', label: 'Phone Number', required: false, placeholder: 'Enter phone number' },
        { id: '5', type: 'text', label: 'Company', required: false, placeholder: 'Enter company name' },
        { id: '6', type: 'checkbox', label: 'I agree to the terms and conditions', required: true }
      ]
    },
    {
      id: 'survey',
      name: 'Survey Form',
      description: 'Customer satisfaction survey with multiple choice questions',
      icon: <ClipboardDocumentListIcon className="h-8 w-8 text-purple-500" />,
      fields: [
        { id: '1', type: 'text', label: 'Your Name', required: false, placeholder: 'Enter your name (optional)' },
        { id: '2', type: 'select', label: 'How did you hear about us?', required: true, options: ['Social Media', 'Search Engine', 'Friend/Colleague', 'Advertisement', 'Other'] },
        { id: '3', type: 'radio', label: 'How would you rate our service?', required: true },
        { id: '4', type: 'textarea', label: 'Additional Comments', required: false, placeholder: 'Share your thoughts with us' }
      ]
    },
    {
      id: 'job-application',
      name: 'Job Application',
      description: 'Professional job application form',
      icon: <BuildingOfficeIcon className="h-8 w-8 text-orange-500" />,
      fields: [
        { id: '1', type: 'text', label: 'Full Name', required: true, placeholder: 'Enter your full name' },
        { id: '2', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
        { id: '3', type: 'text', label: 'Phone Number', required: true, placeholder: 'Enter your phone number' },
        { id: '4', type: 'text', label: 'Position Applied For', required: true, placeholder: 'Enter the position' },
        { id: '5', type: 'textarea', label: 'Cover Letter', required: true, placeholder: 'Write your cover letter' },
        { id: '6', type: 'select', label: 'Experience Level', required: true, options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'] }
      ]
    },
    {
      id: 'feedback',
      name: 'Feedback Form',
      description: 'Product or service feedback collection',
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-500" />,
      fields: [
        { id: '1', type: 'text', label: 'Product/Service Name', required: true, placeholder: 'Enter product or service name' },
        { id: '2', type: 'select', label: 'Category', required: true, options: ['Product', 'Service', 'Website', 'App', 'Other'] },
        { id: '3', type: 'radio', label: 'Overall Rating', required: true },
        { id: '4', type: 'textarea', label: 'Detailed Feedback', required: true, placeholder: 'Please provide detailed feedback' },
        { id: '5', type: 'checkbox', label: 'I would recommend this to others', required: false }
      ]
    }
  ];

  const handleTemplateSelect = (template) => {
    onLoadTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Form Templates</h2>
            <p className="text-gray-600 mt-1">Choose a pre-built template to get started quickly</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {template.fields.length} fields
                        </span>
                      </div>
                      <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-200">
                        Use Template →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-600">💡</span>
              <h4 className="text-sm font-medium text-blue-900">Template Tips</h4>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Templates provide a starting point - you can customize them after loading</li>
              <li>• All templates include common form fields and proper validation</li>
              <li>• You can save your customized templates for future use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTemplates; 
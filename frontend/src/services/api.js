import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const formService = {
  // Get all forms
  getForms: async () => {
    try {
      const response = await api.get('/forms');
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  },

  // Create a new form
  createForm: async (formData) => {
    try {
      const response = await api.post('/forms', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  },

  // Get a single form
  getForm: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  },

  // Update a form
  updateForm: async (formId, formData) => {
    try {
      const response = await api.put(`/forms/${formId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating form:', error);
      throw error;
    }
  },

  // Delete a form
  deleteForm: async (formId) => {
    try {
      await api.delete(`/forms/${formId}`);
      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
  },

  // Submit a form
  submitForm: async (formId, formData) => {
    try {
      const response = await api.post(`/forms/${formId}/submit`, formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  // Get form submissions
  getFormSubmissions: async (formId) => {
    try {
      const response = await api.get(`/forms/${formId}/submissions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      throw error;
    }
  },
};

export const savePage = async (htmlContent, pageName) => {
  try {
    const response = await api.post('/save-page', { html_content: htmlContent, page_name: pageName });
    return response.data;
  } catch (error) {
    console.error('Error saving page:', error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getComponents = async () => {
  try {
    const response = await api.get('/scan');
    return response.data;
  } catch (error) {
    console.error('Error fetching components:', error);
    throw error;
  }
};

export const getTemplates = async () => {
  try {
    const response = await api.get('/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const saveTemplate = async (htmlContent, templateName) => {
  try {
    const response = await api.post('/templates', {
      html_content: htmlContent,
      template_name: templateName,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving template:', error);
    throw error;
  }
}; 
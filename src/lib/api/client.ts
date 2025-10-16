// src/lib/api/client.ts
const API_BASE = 'http://localhost:8000/api';

export const apiClient = {
  async createUser(userData: any) {
    const response = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  
  async getQuestions(subject: string) {
    const response = await fetch(`${API_BASE}/assessment/questions?subject=${subject}`);
    return response.json();
  },
  
  async submitAssessment(results: any) {
    const response = await fetch(`${API_BASE}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results),
    });
    return response.json();
  }
};
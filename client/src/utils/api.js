import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchExpenses = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  const response = await api.get(`/expenses?${params.toString()}`);
  return response.data;
};

export const fetchSummary = async () => {
  const response = await api.get('/expenses/summary');
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post('/expenses', data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export const fetchBudgets = async () => {
  const response = await api.get('/budgets');
  return response.data;
};

export const upsertBudget = async (category, amount) => {
  const response = await api.post('/budgets', { category, amount });
  return response.data;
};

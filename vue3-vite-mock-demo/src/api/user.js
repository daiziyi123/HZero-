import axios from 'axios';

export function getUserList(params = {}) {
  return axios.get('/api/users', { params });
}

const MOCK_BASE_URL = 'https://1d8ea325-fef8-4dcf-babf-a86a03eaa444.mock.pstmn.io';

export const api = {
  // Servers
  async getServers() {
    const response = await fetch(`${MOCK_BASE_URL}/servers`);
    if (!response.ok) throw new Error('Failed to fetch servers');
    return response.json();
  },

  async getServer(id: string) {
    const response = await fetch(`${MOCK_BASE_URL}/servers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch server');
    return response.json();
  },

  async createServer(data: { name: string; image: string; size: string }) {
    const response = await fetch(`${MOCK_BASE_URL}/servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create server');
    return response.json();
  },

  async updateServer(id: string, data: { name: string; status: string }) {
    const response = await fetch(`${MOCK_BASE_URL}/servers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update server');
    return response.json();
  },

  async deleteServer(id: string) {
    const response = await fetch(`${MOCK_BASE_URL}/servers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete server');
    return response.json();
  },

  // Databases
  async getDatabases() {
    const response = await fetch(`${MOCK_BASE_URL}/databases`);
    if (!response.ok) throw new Error('Failed to fetch databases');
    return response.json();
  },

  async getDatabase(id: string) {
    const response = await fetch(`${MOCK_BASE_URL}/databases/${id}`);
    if (!response.ok) throw new Error('Failed to fetch database');
    return response.json();
  },

  async createDatabase(data: { name: string; engine: string; version: string }) {
    const response = await fetch(`${MOCK_BASE_URL}/databases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create database');
    return response.json();
  },

  async updateDatabase(id: string, data: { name: string; version: string }) {
    const response = await fetch(`${MOCK_BASE_URL}/databases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update database');
    return response.json();
  },

  async deleteDatabase(id: string) {
    const response = await fetch(`${MOCK_BASE_URL}/databases/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete database');
    return response.json();
  },

  // Networking
  async getNetworkingResources() {
    const response = await fetch(`${MOCK_BASE_URL}/networking`);
    if (!response.ok) throw new Error('Failed to fetch networking resources');
    return response.json();
  },

  async getNetworkingResource(id: string) {
    const response = await fetch(`${MOCK_BASE_URL}/networking/${id}`);
    if (!response.ok) throw new Error('Failed to fetch networking resource');
    return response.json();
  },

  async createNetworkingResource(data: { name: string; cidrBlock: string }) {
    const response = await fetch(`${MOCK_BASE_URL}/networking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create networking resource');
    return response.json();
  },

  async updateNetworkingResource(id: string, data: { name: string; cidrBlock: string }) {
    const response = await fetch(`${MOCK_BASE_URL}/networking/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update networking resource');
    return response.json();
  },

  async deleteNetworkingResource(id: string) {
    const response = await fetch(`${MOCK_BASE_URL}/networking/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete networking resource');
    return response.json();
  },
};

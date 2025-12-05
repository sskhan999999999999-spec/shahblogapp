import conf from '../conf/conf.js';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    const user = await this.account.create(ID.unique(), email, password, name);
    if (user) return this.login(email, password);
    return user;
  }

  async login(email, password) {
    return await this.account.createEmailPasswordSession(email, password);
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (err) {
      console.warn("No active user:", err.message);
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSession('current'); 
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
  
}

const authService = new AuthService();
export default authService;

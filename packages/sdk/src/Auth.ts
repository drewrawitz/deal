import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default class Auth {
  private static baseURL = `${API_URL}/v1/auth`;

  static async login(email: string, password: string): Promise<any> {
    const response = await axios.post(`${this.baseURL}/login`, {
      email,
      password,
    });

    return response.data;
  }
}

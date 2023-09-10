import { CurrentUser } from "@deal/types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default class Auth {
  private static baseURL = `${API_URL}/v1/auth`;

  static async me(): Promise<CurrentUser> {
    const response = await axios.get(`${this.baseURL}/me`);

    return response.data;
  }

  static async login(email: string, password: string): Promise<any> {
    const response = await axios.post(`${this.baseURL}/login`, {
      email,
      password,
    });

    return response.data;
  }
}

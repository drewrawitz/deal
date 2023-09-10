import { CurrentUser } from "@deal/types";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default class Me {
  private static baseURL = `${API_URL}/v1/me`;

  static async user(): Promise<CurrentUser> {
    const response = await axios.get(this.baseURL);

    return response.data;
  }
}

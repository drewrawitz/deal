import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default class Games {
  private static baseURL = `${API_URL}/v1/games`;

  static async list(): Promise<any> {
    const response = await axios.get(this.baseURL);

    return response.data;
  }
}

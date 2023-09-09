import axios from "axios";
import { GetGamesDto } from "@deal/dto";
import type { ListGamesResponse } from "@deal/types";

const API_URL = import.meta.env.VITE_API_URL;

export default class Games {
  private static baseURL = `${API_URL}/v1/games`;

  static async list(options: GetGamesDto): Promise<ListGamesResponse[]> {
    const response = await axios.get(this.baseURL, {
      params: {
        ...options,
      },
    });

    return response.data;
  }
}

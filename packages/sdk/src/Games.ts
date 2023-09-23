import axios from "axios";
import { GetGamesDto } from "@deal/dto";
import type {
  PaginatedResult,
  ListGamesResponse,
  JoinGameResponse,
  LeaveGameResponse,
  CreateGameResponse,
} from "@deal/types";

const API_URL = import.meta.env.VITE_API_URL;

export default class Games {
  private static baseURL = `${API_URL}/v1/games`;

  static async list(
    options: GetGamesDto
  ): Promise<PaginatedResult<ListGamesResponse[]>> {
    const response = await axios.get(this.baseURL, {
      params: {
        ...options,
      },
    });

    return response.data;
  }

  static async retreive(game_id: number): Promise<ListGamesResponse> {
    const response = await axios.get(`${this.baseURL}/${game_id}`);

    return response.data;
  }

  static async create(): Promise<CreateGameResponse> {
    const response = await axios.post(this.baseURL);

    return response.data;
  }

  static async join(game_id: number): Promise<JoinGameResponse> {
    const response = await axios.post(`${this.baseURL}/${game_id}/join`);

    return response.data;
  }

  static async start(game_id: number): Promise<any> {
    const response = await axios.post(`${this.baseURL}/${game_id}/start`);

    return response.data;
  }

  static async leave(game_id: number): Promise<LeaveGameResponse> {
    const response = await axios.post(`${this.baseURL}/${game_id}/leave`);

    return response.data;
  }

  static async kickPlayer(
    game_id: number,
    player_id: string
  ): Promise<JoinGameResponse> {
    const response = await axios.post(`${this.baseURL}/${game_id}/kick`, {
      player_id,
    });

    return response.data;
  }
}

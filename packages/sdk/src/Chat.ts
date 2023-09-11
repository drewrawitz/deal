import axios from "axios";
import { GetChatMessagesDto } from "@deal/dto";
import type { PaginatedResult, ListChatMessagesResponse } from "@deal/types";

const API_URL = import.meta.env.VITE_API_URL;

export default class Chat {
  private static baseURL = `${API_URL}/v1/chat`;

  static async list(
    options: GetChatMessagesDto
  ): Promise<PaginatedResult<ListChatMessagesResponse[]>> {
    const response = await axios.get(this.baseURL, {
      params: {
        ...options,
      },
    });

    return response.data;
  }
}

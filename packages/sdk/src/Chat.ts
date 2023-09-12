import axios from "axios";
import { CreateChatMessageDto, GetChatMessagesDto } from "@deal/dto";
import type {
  PaginatedResult,
  ListChatMessagesResponse,
  CreateMessageReturn,
} from "@deal/types";

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

  static async create(
    options: CreateChatMessageDto
  ): Promise<CreateMessageReturn> {
    const response = await axios.post(this.baseURL, {
      ...options,
    });

    return response.data;
  }
}

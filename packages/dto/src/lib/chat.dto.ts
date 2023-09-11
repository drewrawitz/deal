import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const CreateChatMessageSchema = z.object({
  content: z.string().min(1).max(600),
  game_id: z.number().optional(),
});

export class CreateChatMessageDto extends createZodDto(
  CreateChatMessageSchema
) {}

const GetChatMessagesSchema = z.object({
  take: z.coerce.number().min(1).optional().default(15),
  page: z.coerce.number().min(1).optional().default(1),
});

export class GetChatMessagesDto extends createZodDto(GetChatMessagesSchema) {}

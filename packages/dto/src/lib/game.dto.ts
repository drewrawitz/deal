import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export class GameIdParamDto extends createZodDto(
  z.object({
    game_id: z.coerce.number(),
  })
) {}

const GameActionBodySchema = z.object({
  action: z.union([z.literal("drawCards"), z.literal("endTurn")]),
});

export class GameActionBodyDto extends createZodDto(GameActionBodySchema) {}

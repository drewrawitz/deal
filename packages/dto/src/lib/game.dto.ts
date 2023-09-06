import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export class GameIdParamDto extends createZodDto(
  z.object({
    game_id: z.coerce.number(),
  })
) {}

const GameActionBodySchema = z.object({
  action: z.union([
    z.literal("drawCards"),
    z.literal("placeCard"),
    z.literal("endTurn"),
  ]),
  data: z
    .object({
      card: z.number().optional(),
      placement: z.union([
        z.literal("bank"),
        z.literal("board"),
        z.literal("discard"),
      ]),
      color: z.string().optional(),
    })
    .optional(),
});

export class GameActionBodyDto extends createZodDto(GameActionBodySchema) {}

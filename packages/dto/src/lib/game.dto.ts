import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { GameStatus } from "@deal/types";

export class GameIdParamDto extends createZodDto(
  z.object({
    game_id: z.coerce.number(),
  })
) {}

const GameActionBodySchema = z.object({
  action: z.union([
    z.literal("drawCards"),
    z.literal("placeCard"),
    z.literal("discard"),
    z.literal("endTurn"),
  ]),
  data: z
    .object({
      card: z.number().optional(),
      placement: z.union([z.literal("bank"), z.literal("board")]).optional(),
      color: z.string().optional(),
      isFlipped: z.boolean().optional(),
    })
    .optional(),
});

export class GameActionBodyDto extends createZodDto(GameActionBodySchema) {}

const GetGamesSchema = z.object({
  status: z.nativeEnum(GameStatus).optional(),
  take: z.coerce.number().min(1).optional().default(15),
  page: z.coerce.number().min(1).optional().default(1),
});

export class GetGamesDto extends createZodDto(GetGamesSchema) {}

const KickPlayerFromGameSchema = z.object({
  player_id: z.string(),
});

export class KickPlayerFromGameBodyDto extends createZodDto(
  KickPlayerFromGameSchema
) {}

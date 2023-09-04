import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export class GameIdParamDto extends createZodDto(
  z.object({
    game_id: z.coerce.number(),
  })
) {}

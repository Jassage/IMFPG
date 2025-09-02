import { z } from 'zod';
import { UESelectObjectSchema } from './objects/UESelect.schema';
import { UEIncludeObjectSchema } from './objects/UEInclude.schema';
import { UECreateInputObjectSchema } from './objects/UECreateInput.schema';
import { UEUncheckedCreateInputObjectSchema } from './objects/UEUncheckedCreateInput.schema';

export const UECreateOneSchema = z.object({ select: UESelectObjectSchema.optional(), include: UEIncludeObjectSchema.optional(), data: z.union([UECreateInputObjectSchema, UEUncheckedCreateInputObjectSchema])  })
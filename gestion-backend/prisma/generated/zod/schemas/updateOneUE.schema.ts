import { z } from 'zod';
import { UESelectObjectSchema } from './objects/UESelect.schema';
import { UEIncludeObjectSchema } from './objects/UEInclude.schema';
import { UEUpdateInputObjectSchema } from './objects/UEUpdateInput.schema';
import { UEUncheckedUpdateInputObjectSchema } from './objects/UEUncheckedUpdateInput.schema';
import { UEWhereUniqueInputObjectSchema } from './objects/UEWhereUniqueInput.schema';

export const UEUpdateOneSchema = z.object({ select: UESelectObjectSchema.optional(), include: UEIncludeObjectSchema.optional(), data: z.union([UEUpdateInputObjectSchema, UEUncheckedUpdateInputObjectSchema]), where: UEWhereUniqueInputObjectSchema  })
import { z } from 'zod';
import { UESelectObjectSchema } from './objects/UESelect.schema';
import { UEIncludeObjectSchema } from './objects/UEInclude.schema';
import { UEWhereUniqueInputObjectSchema } from './objects/UEWhereUniqueInput.schema';

export const UEFindUniqueOrThrowSchema = z.object({ select: UESelectObjectSchema.optional(), include: UEIncludeObjectSchema.optional(), where: UEWhereUniqueInputObjectSchema })
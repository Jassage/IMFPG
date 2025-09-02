import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const AnalyticsCreateManyInputObjectSchema: z.ZodType<Prisma.AnalyticsCreateManyInput, z.ZodTypeDef, Prisma.AnalyticsCreateManyInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]),
  generatedDate: z.date().optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema])
}).strict();
export const AnalyticsCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]),
  generatedDate: z.date().optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema])
}).strict();

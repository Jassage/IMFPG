import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const AnalyticsCreateInputObjectSchema: z.ZodType<Prisma.AnalyticsCreateInput, z.ZodTypeDef, Prisma.AnalyticsCreateInput> = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]),
  generatedDate: z.date().optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema])
}).strict();
export const AnalyticsCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]),
  generatedDate: z.date().optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema])
}).strict();

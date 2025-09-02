import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const AnalyticsUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.AnalyticsUncheckedUpdateInput, z.ZodTypeDef, Prisma.AnalyticsUncheckedUpdateInput> = z.object({
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  generatedDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema]).optional()
}).strict();
export const AnalyticsUncheckedUpdateInputObjectZodSchema = z.object({
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  generatedDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema]).optional()
}).strict();

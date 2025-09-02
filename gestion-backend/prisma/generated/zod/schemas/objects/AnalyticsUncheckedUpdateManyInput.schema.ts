import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { JsonNullValueInputSchema } from '../enums/JsonNullValueInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema'

import { JsonValueSchema as jsonSchema } from './helpers/json-helpers';

export const AnalyticsUncheckedUpdateManyInputObjectSchema: z.ZodType<Prisma.AnalyticsUncheckedUpdateManyInput, z.ZodTypeDef, Prisma.AnalyticsUncheckedUpdateManyInput> = z.object({
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  generatedDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema]).optional()
}).strict();
export const AnalyticsUncheckedUpdateManyInputObjectZodSchema = z.object({
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  data: z.union([JsonNullValueInputSchema, jsonSchema]).optional(),
  generatedDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  parameters: z.union([JsonNullValueInputSchema, jsonSchema]).optional()
}).strict();

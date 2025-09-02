import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema } from './ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInput.schema'

export const ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedUpdateWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedUpdateWithoutScholarshipInput> = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUncheckedUpdateWithoutScholarshipInputObjectZodSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  studentId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  applicationDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  motivation: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  status: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  reviewNotes: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedUpdateManyWithoutScholarshipApplicationNestedInputObjectSchema).optional()
}).strict();

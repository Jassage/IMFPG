import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { StudentUpdateOneRequiredWithoutTranscriptsNestedInputObjectSchema } from './StudentUpdateOneRequiredWithoutTranscriptsNestedInput.schema';
import { GradeUpdateManyWithoutTranscriptNestedInputObjectSchema } from './GradeUpdateManyWithoutTranscriptNestedInput.schema'

export const TranscriptUpdateInputObjectSchema: z.ZodType<Prisma.TranscriptUpdateInput, z.ZodTypeDef, Prisma.TranscriptUpdateInput> = z.object({
  semester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  academicYear: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  gpa: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  totalCredits: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).nullish(),
  creditsEarned: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).nullish(),
  generatedDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutTranscriptsNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutTranscriptNestedInputObjectSchema).optional()
}).strict();
export const TranscriptUpdateInputObjectZodSchema = z.object({
  semester: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  academicYear: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  gpa: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).nullish(),
  totalCredits: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).nullish(),
  creditsEarned: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).nullish(),
  generatedDate: z.union([z.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  student: z.lazy(() => StudentUpdateOneRequiredWithoutTranscriptsNestedInputObjectSchema).optional(),
  grades: z.lazy(() => GradeUpdateManyWithoutTranscriptNestedInputObjectSchema).optional()
}).strict();

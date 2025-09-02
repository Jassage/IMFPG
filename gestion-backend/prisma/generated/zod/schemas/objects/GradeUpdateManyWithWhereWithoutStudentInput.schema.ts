import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema';
import { GradeUpdateManyMutationInputObjectSchema } from './GradeUpdateManyMutationInput.schema';
import { GradeUncheckedUpdateManyWithoutStudentInputObjectSchema } from './GradeUncheckedUpdateManyWithoutStudentInput.schema'

export const GradeUpdateManyWithWhereWithoutStudentInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithWhereWithoutStudentInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithWhereWithoutStudentInput> = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();
export const GradeUpdateManyWithWhereWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutStudentInputObjectSchema)])
}).strict();

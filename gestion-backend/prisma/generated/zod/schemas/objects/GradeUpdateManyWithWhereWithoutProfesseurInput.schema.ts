import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeScalarWhereInputObjectSchema } from './GradeScalarWhereInput.schema';
import { GradeUpdateManyMutationInputObjectSchema } from './GradeUpdateManyMutationInput.schema';
import { GradeUncheckedUpdateManyWithoutProfesseurInputObjectSchema } from './GradeUncheckedUpdateManyWithoutProfesseurInput.schema'

export const GradeUpdateManyWithWhereWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.GradeUpdateManyWithWhereWithoutProfesseurInput, z.ZodTypeDef, Prisma.GradeUpdateManyWithWhereWithoutProfesseurInput> = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutProfesseurInputObjectSchema)])
}).strict();
export const GradeUpdateManyWithWhereWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateManyMutationInputObjectSchema), z.lazy(() => GradeUncheckedUpdateManyWithoutProfesseurInputObjectSchema)])
}).strict();

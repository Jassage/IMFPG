import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutProfesseurInputObjectSchema } from './GradeUpdateWithoutProfesseurInput.schema';
import { GradeUncheckedUpdateWithoutProfesseurInputObjectSchema } from './GradeUncheckedUpdateWithoutProfesseurInput.schema'

export const GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.GradeUpdateWithWhereUniqueWithoutProfesseurInput, z.ZodTypeDef, Prisma.GradeUpdateWithWhereUniqueWithoutProfesseurInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();
export const GradeUpdateWithWhereUniqueWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => GradeUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutProfesseurInputObjectSchema)])
}).strict();

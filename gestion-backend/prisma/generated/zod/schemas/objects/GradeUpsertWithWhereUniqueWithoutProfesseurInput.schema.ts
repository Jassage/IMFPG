import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeUpdateWithoutProfesseurInputObjectSchema } from './GradeUpdateWithoutProfesseurInput.schema';
import { GradeUncheckedUpdateWithoutProfesseurInputObjectSchema } from './GradeUncheckedUpdateWithoutProfesseurInput.schema';
import { GradeCreateWithoutProfesseurInputObjectSchema } from './GradeCreateWithoutProfesseurInput.schema';
import { GradeUncheckedCreateWithoutProfesseurInputObjectSchema } from './GradeUncheckedCreateWithoutProfesseurInput.schema'

export const GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.GradeUpsertWithWhereUniqueWithoutProfesseurInput, z.ZodTypeDef, Prisma.GradeUpsertWithWhereUniqueWithoutProfesseurInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const GradeUpsertWithWhereUniqueWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => GradeUpdateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedUpdateWithoutProfesseurInputObjectSchema)]),
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();

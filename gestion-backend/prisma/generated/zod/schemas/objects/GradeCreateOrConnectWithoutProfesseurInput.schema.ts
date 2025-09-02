import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeWhereUniqueInputObjectSchema } from './GradeWhereUniqueInput.schema';
import { GradeCreateWithoutProfesseurInputObjectSchema } from './GradeCreateWithoutProfesseurInput.schema';
import { GradeUncheckedCreateWithoutProfesseurInputObjectSchema } from './GradeUncheckedCreateWithoutProfesseurInput.schema'

export const GradeCreateOrConnectWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.GradeCreateOrConnectWithoutProfesseurInput, z.ZodTypeDef, Prisma.GradeCreateOrConnectWithoutProfesseurInput> = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();
export const GradeCreateOrConnectWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => GradeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => GradeCreateWithoutProfesseurInputObjectSchema), z.lazy(() => GradeUncheckedCreateWithoutProfesseurInputObjectSchema)])
}).strict();

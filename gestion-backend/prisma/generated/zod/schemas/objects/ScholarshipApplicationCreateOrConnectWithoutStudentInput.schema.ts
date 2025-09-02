import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationWhereUniqueInputObjectSchema } from './ScholarshipApplicationWhereUniqueInput.schema';
import { ScholarshipApplicationCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationCreateWithoutStudentInput.schema';
import { ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema } from './ScholarshipApplicationUncheckedCreateWithoutStudentInput.schema'

export const ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateOrConnectWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateOrConnectWithoutStudentInput> = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();
export const ScholarshipApplicationCreateOrConnectWithoutStudentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScholarshipApplicationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScholarshipApplicationCreateWithoutStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema)])
}).strict();

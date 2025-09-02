import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutGuardiansInputObjectSchema } from './StudentCreateWithoutGuardiansInput.schema';
import { StudentUncheckedCreateWithoutGuardiansInputObjectSchema } from './StudentUncheckedCreateWithoutGuardiansInput.schema'

export const StudentCreateOrConnectWithoutGuardiansInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutGuardiansInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutGuardiansInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutGuardiansInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutGuardiansInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutGuardiansInputObjectSchema)])
}).strict();

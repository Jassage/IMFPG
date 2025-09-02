import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutRetakesInputObjectSchema } from './StudentCreateWithoutRetakesInput.schema';
import { StudentUncheckedCreateWithoutRetakesInputObjectSchema } from './StudentUncheckedCreateWithoutRetakesInput.schema'

export const StudentCreateOrConnectWithoutRetakesInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutRetakesInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutRetakesInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutRetakesInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)])
}).strict();

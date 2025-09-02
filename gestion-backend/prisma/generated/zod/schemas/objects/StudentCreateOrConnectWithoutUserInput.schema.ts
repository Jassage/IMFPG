import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema';
import { StudentCreateWithoutUserInputObjectSchema } from './StudentCreateWithoutUserInput.schema';
import { StudentUncheckedCreateWithoutUserInputObjectSchema } from './StudentUncheckedCreateWithoutUserInput.schema'

export const StudentCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.StudentCreateOrConnectWithoutUserInput, z.ZodTypeDef, Prisma.StudentCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const StudentCreateOrConnectWithoutUserInputObjectZodSchema = z.object({
  where: z.lazy(() => StudentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();

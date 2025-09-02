import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutUserInputObjectSchema } from './StudentCreateWithoutUserInput.schema';
import { StudentUncheckedCreateWithoutUserInputObjectSchema } from './StudentUncheckedCreateWithoutUserInput.schema';
import { StudentCreateOrConnectWithoutUserInputObjectSchema } from './StudentCreateOrConnectWithoutUserInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutUserInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutUserInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutUserInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutUserInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutUserInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutUserInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();

import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateWithoutRetakesInputObjectSchema } from './StudentCreateWithoutRetakesInput.schema';
import { StudentUncheckedCreateWithoutRetakesInputObjectSchema } from './StudentUncheckedCreateWithoutRetakesInput.schema';
import { StudentCreateOrConnectWithoutRetakesInputObjectSchema } from './StudentCreateOrConnectWithoutRetakesInput.schema';
import { StudentWhereUniqueInputObjectSchema } from './StudentWhereUniqueInput.schema'

export const StudentCreateNestedOneWithoutRetakesInputObjectSchema: z.ZodType<Prisma.StudentCreateNestedOneWithoutRetakesInput, z.ZodTypeDef, Prisma.StudentCreateNestedOneWithoutRetakesInput> = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();
export const StudentCreateNestedOneWithoutRetakesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => StudentCreateWithoutRetakesInputObjectSchema), z.lazy(() => StudentUncheckedCreateWithoutRetakesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => StudentCreateOrConnectWithoutRetakesInputObjectSchema).optional(),
  connect: z.lazy(() => StudentWhereUniqueInputObjectSchema).optional()
}).strict();

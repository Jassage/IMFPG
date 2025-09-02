import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutSchedulesInputObjectSchema } from './ProfesseurCreateWithoutSchedulesInput.schema';
import { ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutSchedulesInput.schema';
import { ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema } from './ProfesseurCreateOrConnectWithoutSchedulesInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema'

export const ProfesseurCreateNestedOneWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateNestedOneWithoutSchedulesInput, z.ZodTypeDef, Prisma.ProfesseurCreateNestedOneWithoutSchedulesInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateNestedOneWithoutSchedulesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutSchedulesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();

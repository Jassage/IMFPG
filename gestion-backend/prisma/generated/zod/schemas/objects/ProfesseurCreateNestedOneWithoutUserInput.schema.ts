import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutUserInputObjectSchema } from './ProfesseurCreateWithoutUserInput.schema';
import { ProfesseurUncheckedCreateWithoutUserInputObjectSchema } from './ProfesseurUncheckedCreateWithoutUserInput.schema';
import { ProfesseurCreateOrConnectWithoutUserInputObjectSchema } from './ProfesseurCreateOrConnectWithoutUserInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema'

export const ProfesseurCreateNestedOneWithoutUserInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateNestedOneWithoutUserInput, z.ZodTypeDef, Prisma.ProfesseurCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutUserInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProfesseurCreateNestedOneWithoutUserInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutUserInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutUserInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutUserInputObjectSchema).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional()
}).strict();

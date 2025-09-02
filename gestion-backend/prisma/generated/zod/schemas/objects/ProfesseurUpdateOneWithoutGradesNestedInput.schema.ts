import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ProfesseurCreateWithoutGradesInputObjectSchema } from './ProfesseurCreateWithoutGradesInput.schema';
import { ProfesseurUncheckedCreateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedCreateWithoutGradesInput.schema';
import { ProfesseurCreateOrConnectWithoutGradesInputObjectSchema } from './ProfesseurCreateOrConnectWithoutGradesInput.schema';
import { ProfesseurUpsertWithoutGradesInputObjectSchema } from './ProfesseurUpsertWithoutGradesInput.schema';
import { ProfesseurWhereInputObjectSchema } from './ProfesseurWhereInput.schema';
import { ProfesseurWhereUniqueInputObjectSchema } from './ProfesseurWhereUniqueInput.schema';
import { ProfesseurUpdateToOneWithWhereWithoutGradesInputObjectSchema } from './ProfesseurUpdateToOneWithWhereWithoutGradesInput.schema';
import { ProfesseurUpdateWithoutGradesInputObjectSchema } from './ProfesseurUpdateWithoutGradesInput.schema';
import { ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema } from './ProfesseurUncheckedUpdateWithoutGradesInput.schema'

export const ProfesseurUpdateOneWithoutGradesNestedInputObjectSchema: z.ZodType<Prisma.ProfesseurUpdateOneWithoutGradesNestedInput, z.ZodTypeDef, Prisma.ProfesseurUpdateOneWithoutGradesNestedInput> = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutGradesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();
export const ProfesseurUpdateOneWithoutGradesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ProfesseurCreateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedCreateWithoutGradesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProfesseurCreateOrConnectWithoutGradesInputObjectSchema).optional(),
  upsert: z.lazy(() => ProfesseurUpsertWithoutGradesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProfesseurWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProfesseurWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProfesseurUpdateToOneWithWhereWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUpdateWithoutGradesInputObjectSchema), z.lazy(() => ProfesseurUncheckedUpdateWithoutGradesInputObjectSchema)]).optional()
}).strict();

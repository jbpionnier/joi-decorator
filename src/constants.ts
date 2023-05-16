import * as Joi from 'joi'

export type PropertyValidationSchema = Joi.Schema | Joi.Schema[];

export const METADATA_KEY = {
  VALIDATION_RULES: 'VALIDATION_RULES',
}

import * as Joi from 'joi'
import { METADATA_KEY, PropertyValidationSchema } from './constants'

interface Type<T = any> extends Function {
  new(...args: any[]): T
}

export async function validate<T>(instance: T, clss: Type<T>, options: Joi.ValidationOptions = {}): Promise<any> {
  const metadata = Reflect.getMetadata(METADATA_KEY.VALIDATION_RULES, clss)
  if (metadata == null) {
    return instance
  }

  const schema = getSchemaOrCreateOne(metadata, clss)
  const { value, error } = schema.validate(instance, options)
  if (error) {
    throw error
  }
  return value
}

function getSchemaOrCreateOne(metadata: Map<string, PropertyValidationSchema> | Joi.Schema, constructor: Type): Joi.Schema {
  if (Joi.isSchema(metadata)) {
    return metadata
  }
  const schema = createSchemaFromMetadata(metadata)
  Reflect.defineMetadata(METADATA_KEY.VALIDATION_RULES, schema, constructor)
  return schema
}

function createSchemaFromMetadata(metadata: Map<string, PropertyValidationSchema>): Joi.Schema {
  const obj: Joi.SchemaMap = {}
  const keys = metadata.keys()
  const keyArr = Array.from(keys)
  keyArr.forEach((key: string): void => {
    obj[key] = metadata.get(key)
  })
  return Joi.object().keys(obj)
}

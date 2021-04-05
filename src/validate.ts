import * as Joi from 'joi'
import { METADATA_KEY } from './constants'

interface Type<T = any> extends Function {
  new(...args: any[]): T
}

export async function validate<T>(instance: T, clss: Type<T>, options: Joi.ValidationOptions = {}): Promise<any> {
  const metadata = Reflect.getMetadata(METADATA_KEY.VALIDATION_RULES, clss)
  if (metadata == null) {
    return instance
  }
  const schema = createSchemaFromMetadata(metadata)
  const { value, error } = schema.validate(instance, options)
  if (error) {
    throw error
  }
  return value
}

function createSchemaFromMetadata(metadata: any): Joi.Schema {
  const obj: Joi.SchemaMap = {}
  const keys = metadata.keys()
  const keyArr = Array.from(keys)
  keyArr.forEach((key: any): void => {
    obj[key] = metadata.get(key)
  })
  return Joi.object().keys(obj)
}

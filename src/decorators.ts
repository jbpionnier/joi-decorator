import { METADATA_KEY, PropertyValidationSchema } from './constants'


export function mustBe(propertyValidationSchema: PropertyValidationSchema) {
  // eslint-disable-next-line func-names
  return function (target: any, propertyKey: string) {
    // eslint-disable-next-line prefer-rest-params
    if (getArgumentsLength(arguments) > 2) {
      throw new Error(decoratorIsForPropertiesOnly(propertyKey))
    }
    const constructor = target.constructor
    let metadataMap: (Map<string, PropertyValidationSchema> | undefined) = Reflect.getMetadata(
      METADATA_KEY.VALIDATION_RULES,
      constructor,
    )
    if (metadataMap === undefined) {
      metadataMap = new Map<string, PropertyValidationSchema>()
      Reflect.defineMetadata(
        METADATA_KEY.VALIDATION_RULES,
        metadataMap,
        constructor,
      )
    } else if (metadataMap.has(propertyKey)) {
      throw new Error(decoratorCanOnlyBeAppliedOnce(propertyKey))
    }

    metadataMap.set(propertyKey, propertyValidationSchema)
  }
}

function getArgumentsLength(args: IArguments): number {
  const keys = Object.keys(args)
  return keys.map((key: any) => args[key])
    .filter((value: unknown) => value !== undefined).length
}

function decoratorIsForPropertiesOnly(propertyKey: string): string {
  return 'The @mustBe decorator can only be applied to properties '
    + `but it has been applied the method ${propertyKey}`
}

function decoratorCanOnlyBeAppliedOnce(propertyKey: string): string {
  return 'The @mustBe decorator can only be applied once '
    + `but it has been applied multipl times to ${propertyKey}`
}

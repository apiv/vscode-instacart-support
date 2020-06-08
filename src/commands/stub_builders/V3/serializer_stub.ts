export function buildSerializerStub(modules: string[]) {
  const className = modules[modules.length - 1]

  return [
    `class ${className} < ActiveModel::Serializer`,
    '  include ::ApiV3::PageModules::Concerns::SerializableModule',
    'end'
  ]
}
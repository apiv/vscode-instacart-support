export function buildModuleStub(modules: string[]) {
  const className = modules[modules.length - 1]

  return [
    `class ${className} < NextGenModuleBase`,
    '  def serializer',
    `    ::ApiV3::${modules.slice(1).join('::')}Serializer`,
    '  end',
    '',
    '  def title',
    '    ""',
    '  end',
    'end'
  ]
}
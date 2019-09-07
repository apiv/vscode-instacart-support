export function buildContainerStub(modules: string[]) {
  const className = modules[modules.length - 1]

  return [
    `class ${className} < NextGenContainerBase`,
    '  def modules',
    '    []',
    '  end',
    '',
    '  def title',
    '    ""',
    '  end',
    'end'
  ]
}
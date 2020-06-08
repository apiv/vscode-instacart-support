export function buildContainerStub(modules: string[]) {
  const className = modules[modules.length - 1]

  return [
    `class ${className} < NextGenContainerBase`,
    '',
    '  MODULE_CLASSES = []',
    '',
    '  def title',
    '    ""',
    '  end',
    '',
    '  def module_classes',
    '    MODULE_CLASSES',
    '  end',
    'end'
  ]
}
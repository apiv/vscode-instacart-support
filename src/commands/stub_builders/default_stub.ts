export function buildDefaultStub(modules: string[]) {
  const className = modules[modules.length - 1]

  return [
    `class ${className}`,
    'end'
  ]
}
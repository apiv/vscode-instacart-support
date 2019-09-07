const INDENT_UNIT = '  '

function buildIndent(level: number) {
	return Array(level).fill(INDENT_UNIT).join('')
}

function buildModulesOpen(modules: string[]) {
  let str = ''
  for (let i = 0; i < modules.length - 1; i++) {
    str += `\n${buildIndent(i)}module ${modules[i]}`
  }
  return str
}

function buildModulesClose(modules: string[]) {
  let str = ''
  for (let i = modules.length - 2; i >= 0; i--) {
    str += `\n${buildIndent(i)}end`
  }
  return str
}

export function buildStub(modules: string[], stubBuilder: Function) {
  let str = ''
  str += buildModulesOpen(modules)

  const templateIndent = buildIndent(modules.length - 1)
  const definition = stubBuilder(modules)

  for (let i = 0; i < definition.length; i++) {
    let line = definition[i]
    str += `\n${line.length > 0 ? templateIndent: ''}${line}`
  }

  str += buildModulesClose(modules)
  return str
}
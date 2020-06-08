export function buildFeaturePolicyStub(modules: string[]) {
  const className = modules[modules.length - 1]

  return [
    `class ${className} < CustomersFeatureBase`,
    '  EXPERIMENT_NAME = :ep_category_merchandising_v0',
    '',
    `  IOS_VERSION = '7.32.0'`,
    `  ANDROID_VERSION = '6.10'`,
    `  WEB_VERSION = true`,
    '',
    '  flipper EXPERIMENT_NAME',
    '  client_support ios: IOS_VERSION, android: ANDROID_VERSION, web: WEB_VERSION',
    'end'
  ]
}

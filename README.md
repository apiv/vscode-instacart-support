# This is a WIP...

...And pull requests are welcome.

## Setup

1. Clone this repository.
2. Run `yarn ext-install` to install the plugin. This will build the code and symlink the build path to your vscode installation's extension path.
3. Restart vscode.

## Updating

When new changes are released, you can update your local extension by doing the following:

1. `git pull --rebase`
2. Run `yarn ext-install` to rebuild your local extension with the latest code.

## Features

- Instacart: Create Stub (default binding: `cmd+shift+c`)
   - Calling this command from any supported file type (by naming/filepath convention) will insert the relevant stub automatically.
   - V3 stubs:
      - container class
      - container spec
      - module class
      - module serializer
      - feature policy class
   - V4 stubs:
      - Stay tuned
- Instacart: V3: Go to Serializer (default binding: `cmd+shift+s`)
   - For V3 modules or containers, will go to the serializer defined in the `serializer_class` method of the current file.
     Prompts user to create the file if it does not exist.
- Instacart: Ruby: Copy module path (default binding: `cmd+shift+m`)
   - Copies the full path of the main module of the current file.

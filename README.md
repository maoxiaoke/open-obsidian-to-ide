# Open Obsidian To IDE

This plugin allows you to open your Obsidian vault or current file in your favorite IDE or text editor. Support VSCode, Cursor, Windsurf, or any custom editor of your choice.

Support the development of my plugins and themes [@xiaokedada](https://twitter.com/xiaokedada) on Twitter/X or visit my [blog](https://www.nazha.co).

## Features

- 🚀 Open your vault in VSCode, Cursor, or Windsurf with one click
- ⚙️ Configure custom editors with custom command-line arguments
- 🎨 Clean and native Obsidian-style settings interface
- 💻 macOS support (Windows and Linux support coming soon)

## Installation

Since this plugin hasn't been released to the Obsidian community plugin store yet, you'll need to install it manually:

1. Open a terminal and navigate to your vault's plugins directory:
   ```bash
   cd path/to/vault/.obsidian/plugins
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/maoxiaoke/open-obsidian-to-ide.git
   ```

3. Enter the plugin directory and install dependencies:
   ```bash
   cd open-obsidian-to-ide
   npm install
   ```

4. Build the plugin:
   ```bash
   npm run build
   ```

5. Restart Obsidian and enable the plugin in Settings → Community plugins

## Usage

1. After installation, you'll see a new ribbon icon (looks like a cable) in the left sidebar
2. Click the icon to open your vault in your configured editor
3. Configure your preferred editor in the plugin settings:
   - Choose from VSCode, Cursor, or Windsurf
   - Or set up a custom editor with your own command and arguments

### Configuration

You can configure the plugin in Obsidian's settings under the "Open Obsidian To IDE" section:

1. **Editor Selection**: Choose your preferred editor from the dropdown menu
   - VSCode (default)
   - Cursor
   - Windsurf
   - Custom Command

2. **Custom Editor Setup** (if "Custom Command" is selected):
   - **Command**: Enter the path or command for your editor
   - **Arguments**: Add any additional command-line arguments (the vault path will be added automatically at the end)

## Support

- Follow me on Twitter/X [@xiaokedada](https://twitter.com/xiaokedada)
- Visit my blog at [nazha.co](https://www.nazha.co)
- Report issues on [GitHub](https://github.com/maoxiaoke/open-obsidian-to-ide/issues)

## License

[MIT License](LICENSE)

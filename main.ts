import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { spawnSync } from 'child_process';

interface OpenObsidianToIDESettings {
	editorType: 'vscode' | 'cursor' | 'windsurf' | 'custom';
	customCommand: string;
	customArgs: string;
	mySetting: string;
}

const DEFAULT_SETTINGS: OpenObsidianToIDESettings = {
	editorType: 'vscode',
	customCommand: '',
	customArgs: '',
	mySetting: 'default'
};

export default class OpenObsidianToIDE extends Plugin {
	settings: OpenObsidianToIDESettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new OpenObsidianToIDESettingTab(this.app, this));

		// Add ribbon icon for opening in IDE
		this.addRibbonIcon('cable', 'Open in IDE', async () => {
			try {
				// Get the vault path
				const vaultPath = (this.app.vault.adapter as any).basePath;

				new Notice(`Opening in ${this.settings.editorType}: ${vaultPath}`);

				const editorCommands: Record<string, { command: string; args: string[] }> = {
					vscode: { command: 'open', args: ['-n', '-b', 'com.microsoft.VSCode', '--args'] },
					cursor: { command: 'cursor', args: [] },
					windsurf: {
						command: '/Applications/Windsurf.app/Contents/MacOS/Electron',
						args: []
					},
					custom: {
						command: this.settings.customCommand,
						args: this.settings.customArgs.split(' ').filter((arg) => arg.length > 0)
					}
				};

				const { command, args } = editorCommands[this.settings.editorType];
				const finalArgs =
					this.settings.editorType === 'vscode' ? [...args, vaultPath] : [vaultPath];

				if (this.settings.editorType === 'custom' && !this.settings.customCommand) {
					throw new Error('Custom command is not configured');
				}

				process.env.VSCODE_CWD = vaultPath;

				const result = spawnSync(command, finalArgs, {
					env: {
						...process.env,
						PATH:
							'/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:' +
							(process.env.PATH || '')
					},
					shell: true,
					cwd: vaultPath
				});

				if (result.error) {
					throw result.error;
				}

				if (result.status !== 0) {
					throw new Error(
						`Process exited with status ${result.status}: ${result.stderr?.toString()}`
					);
				}
			} catch (error) {
				console.error('Error opening in IDE:', error);
				new Notice(`Error opening in ${this.settings.editorType}. Check console for details.`);
			}
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class OpenObsidianToIDESettingTab extends PluginSettingTab {
	plugin: OpenObsidianToIDE;

	constructor(app: App, plugin: OpenObsidianToIDE) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Open Obsidian To IDE' });
		containerEl.createEl('p', {
			text: 'This plugin allows you to open your Obsidian vault or current file in your favorite IDE or text editor. Configure your preferred editor below.'
		}).style.color = 'var(--text-muted)';

		new Setting(containerEl)
			.setName('Which editor to use?')
			.setDesc('Choose which editor to open files with')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('vscode', 'VS Code')
					.addOption('cursor', 'Cursor')
					.addOption('windsurf', 'Windsurf')
					.addOption('custom', 'Custom Command')
					.setValue(this.plugin.settings.editorType)
					.onChange(async (value) => {
						this.plugin.settings.editorType = value as OpenObsidianToIDESettings['editorType'];
						await this.plugin.saveSettings();
						// Show/hide custom command settings based on selection
						this.display();
					})
			);

		if (this.plugin.settings.editorType === 'custom') {
			new Setting(containerEl)
				.setName('Custom Command')
				.setDesc('Enter the command to execute (e.g., /path/to/editor)')
				.addText((text) =>
					text
						.setPlaceholder('Enter command')
						.setValue(this.plugin.settings.customCommand)
						.onChange(async (value) => {
							this.plugin.settings.customCommand = value;
							await this.plugin.saveSettings();
						})
				);

			new Setting(containerEl)
				.setName('Custom Arguments')
				.setDesc(
					'Enter additional arguments (space-separated, the file path will be added at the end)'
				)
				.addText((text) =>
					text
						.setPlaceholder('Enter arguments')
						.setValue(this.plugin.settings.customArgs)
						.onChange(async (value) => {
							this.plugin.settings.customArgs = value;
							await this.plugin.saveSettings();
						})
				);
		}

		// Add author information
		containerEl.createEl('hr', { cls: 'author-separator' }).style.marginTop = '2em';

		const authorSection = containerEl.createEl('div', { cls: 'author-info' });
		authorSection.style.textAlign = 'center';
		authorSection.style.color = 'var(--text-muted)';
		authorSection.style.marginTop = '1em';

		authorSection.createEl('p', {
			text: 'Created by 那吒'
		});

		const socialLinks = authorSection.createEl('p', { cls: 'social-links' });
		socialLinks.style.marginTop = '0.5em';

		const twitterLink = socialLinks.createEl('a', {
			text: 'Twitter/X: @xiaokedada',
			href: 'https://twitter.com/xiaokedada'
		});
		twitterLink.style.marginRight = '1em';

		const blogLink = socialLinks.createEl('a', {
			text: 'Blog',
			href: 'https://www.nazha.co'
		});

		// Style links
		[twitterLink, blogLink].forEach((link) => {
			link.style.color = 'var(--text-accent)';
			link.style.textDecoration = 'none';
		});
	}
}

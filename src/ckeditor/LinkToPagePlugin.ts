import {Plugin, ButtonView, MenuBarMenuListItemButtonView} from 'ckeditor5';
import iconLinkToPage from '/images/link-to-page.svg?raw';

export interface LinkToPagePluginConfig {
    onOpenDialog?: () => void;
    label?: string;
}

function getConfig(editor: import('ckeditor5').Editor): LinkToPagePluginConfig | undefined {
    return editor.config.get('linkToPage') as LinkToPagePluginConfig | undefined;
}

export default class LinkToPagePlugin extends Plugin {
    static get pluginName(): string {
        return 'LinkToPagePlugin';
    }

    init(): void {
        const editor = this.editor;

        editor.ui.componentFactory.add('linkToPage', (locale) => {
            const button = new ButtonView(locale);
            const config = getConfig(editor);

            button.set({
                label: config?.label ?? 'Link to Page',
                tooltip: true,
                icon: iconLinkToPage,
            });

            button.on('execute', () => config?.onOpenDialog?.());

            return button;
        });

        editor.ui.componentFactory.add('menuBar:linkToPage', (locale) => {
            const button = new MenuBarMenuListItemButtonView(locale);
            const config = getConfig(editor);

            button.set({
                label: config?.label ?? 'Link to Page',
                icon: iconLinkToPage,
            });

            button.on('execute', () => config?.onOpenDialog?.());

            return button;
        });
    }
}

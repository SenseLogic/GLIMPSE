// -- IMPORTS

const { Plugin, PluginSettingTab, Setting } = require( 'obsidian' );

// -- TYPES

class GlimpseSettingTab
    extends PluginSettingTab
{
    // -- CONSTRUCTORS

    constructor(
        app,
        plugin
        )
    {
        super( app, plugin );

        this.plugin = plugin;
    }

    // ~~

    display(
        )
    {
        const { containerEl } = this;

        containerEl.empty();

        new Setting( containerEl )
            .setName( 'Image top margin' )
            .addText(
                text =>
                text
                    .setPlaceholder( '16px' )
                    .setValue( this.plugin.settings.imageTopMargin )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.imageTopMargin = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Image bottom margin' )
            .addText(
                text =>
                text
                    .setPlaceholder( '0px' )
                    .setValue( this.plugin.settings.imageBottomMargin )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.imageBottomMargin = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Image maximum height' )
            .addText(
                text =>
                text
                    .setPlaceholder( '80vh' )
                    .setValue( this.plugin.settings.imageMaximumHeight )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.imageMaximumHeight = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Image height' )
            .addText(
                text =>
                text
                    .setPlaceholder( 'auto' )
                    .setValue( this.plugin.settings.imageHeight )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.imageHeight = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Image width' )
            .addText(
                text =>
                text
                    .setPlaceholder( '100%' )
                    .setValue( this.plugin.settings.imageWidth )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.imageWidth = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video top margin' )
            .addText(
                text =>
                text
                    .setPlaceholder( '16px' )
                    .setValue( this.plugin.settings.videoTopMargin )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoTopMargin = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video bottom margin' )
            .addText(
                text =>
                text
                    .setPlaceholder( '0px' )
                    .setValue( this.plugin.settings.videoBottomMargin )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoBottomMargin = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video maximum height' )
            .addText(
                text =>
                text
                    .setPlaceholder( '80vh' )
                    .setValue( this.plugin.settings.videoMaximumHeight )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoMaximumHeight = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video height' )
            .addText(
                text =>
                text
                    .setPlaceholder( 'auto' )
                    .setValue( this.plugin.settings.videoHeight )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoHeight = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video width' )
            .addText(
                text =>
                text
                    .setPlaceholder( '100%' )
                    .setValue( this.plugin.settings.videoWidth )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoWidth = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );
    }
}

// ~~

module.exports = class Glimpse extends Plugin
{
    // -- OPERATIONS

    async loadSettings(
        )
    {
        this.settings
            = Object.assign(
                  {},
                  {
                      imageTopMargin: '16px',
                      imageBottomMargin: '0px',
                      imageMaximumHeight: '80vh',
                      imageHeight: 'auto',
                      imageWidth: '100%',
                      videoTopMargin: '16px',
                      videoBottomMargin: '0px',
                      videoMaximumHeight: '80vh',
                      videoHeight: 'auto',
                      videoWidth: '100%'
                  },
                  await this.loadData()
                  );
    }

    // ~~

    async saveSettings(
        )
    {
        await this.saveData( this.settings );
    }

    // ~~

    async onload(
        )
    {
        console.log( 'Glimpse plugin loaded' );

        await this.loadSettings();

        this.registerMarkdownPostProcessor(
            ( element ) =>
            {
console.log( element.innerHTML );
console.log( element );
                let activeFilePath = this.app.workspace.getActiveFile().path;
                let activeFolderPath = '';

                if ( activeFilePath.indexOf( '/' ) >= 0 )
                {
                    activeFolderPath = activeFilePath.slice( 0, activeFilePath.lastIndexOf( '/' ) + 1 );
                }

                element.querySelectorAll( 'div.internal-embed[src$=".gif"], div.internal-embed[src$=".jpg"], div.internal-embed[src$=".png"], div.internal-embed[src$=".webp"], span.internal-embed[src$=".gif"], span.internal-embed[src$=".jpg"], span.internal-embed[src$=".png"], span.internal-embed[src$=".webp"]' ).forEach(
                    ( linkElement ) =>
                    {
                        let imagePath = linkElement.getAttribute( 'src' );

                        if ( !imagePath.startsWith( 'http:' )
                             && !imagePath.startsWith( 'https:' ) )
                        {
                            imagePath = this.app.vault.adapter.getResourcePath( activeFolderPath + imagePath );
                        }

                        let imageElement = document.createElement( 'img' );
                        imageElement.src = imagePath;
                        imageElement.alt = linkElement.getAttribute( 'alt' );
                        imageElement.style.marginTop = this.settings.imageTopMargin;
                        imageElement.style.marginBottom = this.settings.imageBottomMargin;
                        imageElement.style.maxHeight = this.settings.imageMaximumHeight;
                        imageElement.style.height = this.settings.imageHeight;
                        imageElement.style.width = this.settings.imageWidth;
                        imageElement.style.objectFit = 'contain';
                        imageElement.style.objectPosition = 'left';

                        linkElement.parentNode.replaceChild( imageElement, linkElement );
                    }
                    );

                element.querySelectorAll( 'div.internal-embed[src$=".mp4"], div.internal-embed[src$=".webm"], span.internal-embed[src$=".mp4"], span.internal-embed[src$=".webm"]' ).forEach(
                    ( linkElement ) =>
                    {
                        let videoPath = linkElement.getAttribute( 'src' );

                        if ( !videoPath.startsWith( 'http:' )
                             && !videoPath.startsWith( 'https:' ) )
                        {
                            videoPath = this.app.vault.adapter.getResourcePath( activeFolderPath + videoPath );
                        }

                        let videoElement = document.createElement( 'video' );
                        videoElement.src = videoPath;
                        videoElement.autoplay = false;
                        videoElement.loop = false;
                        videoElement.controls = true;
                        videoElement.title = linkElement.getAttribute( 'alt' );
                        videoElement.style.marginTop = this.settings.videoTopMargin;
                        videoElement.style.marginBottom = this.settings.videoBottomMargin;
                        videoElement.style.maxHeight = this.settings.videoMaximumHeight;
                        videoElement.style.height = this.settings.videoHeight;
                        videoElement.style.width = this.settings.videoWidth;

                        linkElement.parentNode.replaceChild( videoElement, linkElement );
                    }
                    );

                element.querySelectorAll( 'a[href$=".mp4"], a[href$=".webm"]' ).forEach(
                    ( linkElement ) =>
                    {
                        let videoPath = linkElement.getAttribute( 'href' );

                        if ( !videoPath.startsWith( 'http:' )
                             && !videoPath.startsWith( 'https:' ) )
                        {
                            videoPath = this.app.vault.adapter.getResourcePath( activeFolderPath + videoPath );
                        }

                        let videoElement = document.createElement( 'video' );
                        videoElement.src = videoPath;
                        videoElement.autoplay = false;
                        videoElement.loop = false;
                        videoElement.controls = true;
                        videoElement.title = linkElement.textContent;
                        videoElement.style.marginTop = this.settings.videoTopMargin;
                        videoElement.style.marginBottom = this.settings.videoBottomMargin;
                        videoElement.style.maxHeight = this.settings.videoMaximumHeight;
                        videoElement.style.height = this.settings.videoHeight;
                        videoElement.style.width = this.settings.videoWidth;

                        linkElement.parentNode.replaceChild( videoElement, linkElement );
                    }
                    );
            }
            );

        this.addSettingTab(
            new GlimpseSettingTab( this.app, this )
            );
    }

    // ~~

    onunload(
        )
    {
        console.log( 'Glimpse plugin unloaded' );
    }
};

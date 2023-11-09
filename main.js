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
            .setName( 'Video player top margin' )
            .addText(
                text =>
                text
                    .setPlaceholder( '16px' )
                    .setValue( this.plugin.settings.videoPlayerTopMargin )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoPlayerTopMargin = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video player bottom margin' )
            .addText(
                text =>
                text
                    .setPlaceholder( '0px' )
                    .setValue( this.plugin.settings.videoPlayerBottomMargin )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoPlayerBottomMargin = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video player maximum height' )
            .addText(
                text =>
                text
                    .setPlaceholder( '80vh' )
                    .setValue( this.plugin.settings.videoPlayerMaximumHeight )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoPlayerMaximumHeight = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video player height' )
            .addText(
                text =>
                text
                    .setPlaceholder( 'auto' )
                    .setValue( this.plugin.settings.videoPlayerHeight )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoPlayerHeight = value;
                            await this.plugin.saveSettings();
                        }
                        )
                );

        new Setting( containerEl )
            .setName( 'Video player width' )
            .addText(
                text =>
                text
                    .setPlaceholder( '100%' )
                    .setValue( this.plugin.settings.videoPlayerWidth )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoPlayerWidth = value;
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
                      videoPlayerTopMargin: '16px',
                      videoPlayerBottomMargin: '0px',
                      videoPlayerMaximumHeight: '80vh',
                      videoPlayerHeight: 'auto',
                      videoPlayerWidth: '100%'
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
                let activeFilePath = this.app.workspace.getActiveFile().path;
                let activeFolderPath = '';

                if ( activeFilePath.indexOf( '/' ) >= 0 )
                {
                    activeFolderPath = activeFilePath.slice( 0, activeFilePath.lastIndexOf( '/' ) + 1 );
                }

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
                        videoElement.style.marginTop = this.settings.videoPlayerTopMargin;
                        videoElement.style.marginBottom = this.settings.videoPlayerBottomMargin;
                        videoElement.style.maxHeight = this.settings.videoPlayerMaximumHeight;
                        videoElement.style.height = this.settings.videoPlayerHeight;
                        videoElement.style.width = this.settings.videoPlayerWidth;

                        linkElement.parentNode.replaceChild( videoElement, linkElement );
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
                        videoElement.style.marginTop = this.settings.videoPlayerTopMargin;
                        videoElement.style.marginBottom = this.settings.videoPlayerBottomMargin;
                        videoElement.style.maxHeight = this.settings.videoPlayerMaximumHeight;
                        videoElement.style.height = this.settings.videoPlayerHeight;
                        videoElement.style.width = this.settings.videoPlayerWidth;

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

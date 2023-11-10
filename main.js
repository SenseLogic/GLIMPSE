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
            .setName( 'Image maximum width' )
            .addText(
                text =>
                text
                    .setPlaceholder( '100%' )
                    .setValue( this.plugin.settings.imageMaximumWidth )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.imageMaximumWidth = value;
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
            .setName( 'Video maximum width' )
            .addText(
                text =>
                text
                    .setPlaceholder( '100%' )
                    .setValue( this.plugin.settings.videoMaximumWidth )
                    .onChange(
                        async ( value ) =>
                        {
                            this.plugin.settings.videoMaximumWidth = value;
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
                      imageWidth: '100%',
                      imageHeight: 'auto',
                      imageMaximumWidth: '100%',
                      imageMaximumHeight: '80vh',
                      videoWidth: '100%',
                      videoHeight: 'auto',
                      videoMaximumWidth: '100%',
                      videoMaximumHeight: '80vh'
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

    getLinkDataArray(
        linkText
        )
    {
        let linkDataArray = [ '', '100%', 'auto' ];
        let partArray = linkText.split( '¨' );
        linkDataArray[ 0 ] = partArray[ 0 ];

        if ( partArray.length > 1 )
        {
            partArray = partArray[ 1 ].split( ':' );

            if ( partArray.length >= 1 )
            {
                linkDataArray[ 1 ] = partArray[ 0 ];
            }

            if ( partArray.length >= 2 )
            {
                linkDataArray[ 2 ] = partArray[ 1 ];
            }
        }

        if ( linkDataArray[ 1 ] === '' )
        {
            linkDataArray[ 1 ] = 'auto';
        }

        return linkDataArray;
    }

    // ~~

    async onload(
        )
    {
        console.log( 'Glimpse plugin loaded' );

        await this.loadSettings();

        let imageMaximumWidth = 'min(' + this.settings.imageWidth + ', ' + this.settings.imageMaximumWidth + ')';
        let imageMaximumHeight = this.settings.imageMaximumHeight;
        let videoMaximumWidth = 'min(' + this.settings.videoWidth + ', ' + this.settings.videoMaximumWidth + ')';
        let videoMaximumHeight = this.settings.videoMaximumHeight;

        this.registerMarkdownPostProcessor(
            ( element ) =>
            {
                let activeFilePath = this.app.workspace.getActiveFile().path;
                let activeFolderPath = '';

                if ( activeFilePath.indexOf( '/' ) >= 0 )
                {
                    activeFolderPath = activeFilePath.slice( 0, activeFilePath.lastIndexOf( '/' ) + 1 );
                }

                element.querySelectorAll( 'div.internal-embed, span.internal-embed' ).forEach(
                    ( linkElement ) =>
                    {
                        let linkPath = linkElement.getAttribute( 'src' );

                        if ( linkPath.endsWith( '.gif' )
                             || linkPath.endsWith( '.jpg' )
                             || linkPath.endsWith( '.png' )
                             || linkPath.endsWith( '.webp' ) )
                        {
                            if ( !linkPath.startsWith( 'http:' )
                                 && !linkPath.startsWith( 'https:' ) )
                            {
                                linkPath = this.app.vault.adapter.getResourcePath( activeFolderPath + linkPath );
                            }

                            let [ imageTitle, imageWidth, imageHeight ] = this.getLinkDataArray( linkElement.getAttribute( 'alt' ) );

                            let imageElement = document.createElement( 'img' );
                            imageElement.src = linkPath;
                            imageElement.alt = imageTitle;
                            imageElement.style.width = imageWidth;
                            imageElement.style.height = imageHeight;
                            imageElement.style.maxWidth = imageMaximumWidth;
                            imageElement.style.maxHeight = imageMaximumHeight;
                            imageElement.style.objectFit = 'contain';

                            linkElement.parentNode.replaceChild( imageElement, linkElement );
                        }

                        if ( linkPath.endsWith( '.mp4' )
                             || linkPath.endsWith( '.webm' ) )
                        {
                            if ( !linkPath.startsWith( 'http:' )
                                 && !linkPath.startsWith( 'https:' ) )
                            {
                                linkPath = this.app.vault.adapter.getResourcePath( activeFolderPath + linkPath );
                            }

                            let [ videoTitle, videoWidth, videoHeight ] = this.getLinkDataArray( linkElement.getAttribute( 'alt' ) );

                            let videoElement = document.createElement( 'video' );
                            videoElement.src = linkPath;
                            videoElement.autoplay = false;
                            videoElement.loop = false;
                            videoElement.controls = true;
                            videoElement.title = videoTitle;
                            videoElement.style.width = videoWidth;
                            videoElement.style.height = videoHeight;
                            videoElement.style.maxWidth = videoMaximumWidth;
                            videoElement.style.maxHeight = videoMaximumHeight;
                            videoElement.style.objectFit = 'contain';

                            linkElement.parentNode.replaceChild( videoElement, linkElement );
                        }
                    }
                    );

                element.querySelectorAll( 'a' ).forEach(
                    ( linkElement ) =>
                    {
                        let linkPath = linkElement.getAttribute( 'href' );

                        if ( linkPath.endsWith( '.mp4' )
                             || linkPath.endsWith( '.webm' ) )
                        {
                            if ( !linkPath.startsWith( 'http:' )
                                 && !linkPath.startsWith( 'https:' ) )
                            {
                                linkPath = this.app.vault.adapter.getResourcePath( activeFolderPath + linkPath );
                            }

                            let [ videoTitle, videoWidth, videoHeight ] = this.getLinkDataArray( linkElement.textContent );

                            let videoElement = document.createElement( 'video' );
                            videoElement.src = linkPath;
                            videoElement.autoplay = false;
                            videoElement.loop = false;
                            videoElement.controls = true;
                            videoElement.title = videoTitle;
                            videoElement.style.width = videoWidth;
                            videoElement.style.height = videoHeight;
                            videoElement.style.maxWidth = videoMaximumWidth;
                            videoElement.style.maxHeight = videoMaximumHeight;
                            videoElement.style.objectFit = 'contain';

                            linkElement.parentNode.replaceChild( videoElement, linkElement );
                        }
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

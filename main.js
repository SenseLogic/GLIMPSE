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

    getMediumData(
        mediumTitle,
        defaultWidth,
        defaultHeight
        )
    {
        let mediumWidth = '';
        let mediumHeight = '';
        let partArray = mediumTitle.split( '¨' );
        mediumTitle = partArray[ 0 ];

        if ( partArray.length > 1 )
        {
            partArray = partArray[ 1 ].split( ':' );

            if ( partArray.length >= 1 )
            {
                mediumWidth = partArray[ 0 ];
            }

            if ( partArray.length >= 2 )
            {
                mediumHeight = partArray[ 1 ];
            }
        }

        if ( mediumWidth === ''
             && mediumHeight !== '' )
        {
            mediumWidth = 'auto';
        }
        else if ( mediumHeight === ''
                  && mediumWidth !== '' )
        {
            mediumHeight = 'auto';
        }

        if ( mediumWidth === '' )
        {
            mediumWidth = defaultWidth;
        }

        if ( mediumHeight === '' )
        {
            mediumHeight = defaultHeight;
        }

        return { mediumTitle, mediumWidth, mediumHeight };
    }

    // ~~

    getImageData(
        imageTitle
        )
    {
        return this.getMediumData( imageTitle, this.settings.imageWidth, this.settings.imageHeight );
    }

    // ~~

    getVideoData(
        videoTitle
        )
    {
        return this.getMediumData( videoTitle, this.settings.videoWidth, this.settings.videoHeight );
    }

    // ~~

    getMaximumSize(
        size,
        maximumSize
        )
    {
        if ( size === 'auto' )
        {
            return maximumSize;
        }
        else if ( size === maximumSize )
        {
            return size;
        }
        else
        {
            return 'min(' + size + ', ' + maximumSize + ')';
        }
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

                element.querySelectorAll( 'div.internal-embed, span.internal-embed' ).forEach(
                    ( linkElement ) =>
                    {
                        let mediumPath = linkElement.getAttribute( 'src' );

                        if ( mediumPath.endsWith( '.gif' )
                             || mediumPath.endsWith( '.jpg' )
                             || mediumPath.endsWith( '.png' )
                             || mediumPath.endsWith( '.webp' ) )
                        {
                            if ( !mediumPath.startsWith( 'http:' )
                                 && !mediumPath.startsWith( 'https:' ) )
                            {
                                mediumPath = this.app.vault.adapter.getResourcePath( activeFolderPath + mediumPath );
                            }

                            let { mediumTitle, mediumWidth, mediumHeight } = this.getImageData( linkElement.getAttribute( 'alt' ) );
                            let mediumMaximumWidth = this.getMaximumSize( mediumWidth, this.settings.imageMaximumWidth );
                            let mediumMaximumHeight = this.getMaximumSize( mediumHeight, this.settings.imageMaximumHeight );

                            let mediumElement = document.createElement( 'img' );
                            mediumElement.src = mediumPath;
                            mediumElement.alt = mediumTitle;
                            mediumElement.style.width = mediumWidth;
                            mediumElement.style.height = mediumHeight;
                            mediumElement.style.maxWidth = mediumMaximumWidth;
                            mediumElement.style.maxHeight = mediumMaximumHeight;
                            mediumElement.style.objectFit = 'contain';

                            linkElement.parentNode.replaceChild( mediumElement, linkElement );
                        }

                        if ( mediumPath.endsWith( '.mp4' )
                             || mediumPath.endsWith( '.webm' ) )
                        {
                            if ( !mediumPath.startsWith( 'http:' )
                                 && !mediumPath.startsWith( 'https:' ) )
                            {
                                mediumPath = this.app.vault.adapter.getResourcePath( activeFolderPath + mediumPath );
                            }

                            let { mediumTitle, mediumWidth, mediumHeight } = this.getVideoData( linkElement.getAttribute( 'alt' ) );
                            let mediumMaximumWidth = this.getMaximumSize( mediumWidth, this.settings.videoMaximumWidth );
                            let mediumMaximumHeight = this.getMaximumSize( mediumHeight, this.settings.videoMaximumHeight );

                            let mediumElement = document.createElement( 'video' );
                            mediumElement.src = mediumPath;
                            mediumElement.autoplay = false;
                            mediumElement.loop = false;
                            mediumElement.controls = true;
                            mediumElement.title = mediumTitle;
                            mediumElement.style.width = mediumWidth;
                            mediumElement.style.height = mediumHeight;
                            mediumElement.style.maxWidth = mediumMaximumWidth;
                            mediumElement.style.maxHeight = mediumMaximumHeight;
                            mediumElement.style.objectFit = 'contain';

                            linkElement.parentNode.replaceChild( mediumElement, linkElement );
                        }
                    }
                    );

                element.querySelectorAll( 'a' ).forEach(
                    ( linkElement ) =>
                    {
                        let mediumPath = linkElement.getAttribute( 'href' );

                        if ( mediumPath.endsWith( '.mp4' )
                             || mediumPath.endsWith( '.webm' ) )
                        {
                            if ( !mediumPath.startsWith( 'http:' )
                                 && !mediumPath.startsWith( 'https:' ) )
                            {
                                mediumPath = this.app.vault.adapter.getResourcePath( activeFolderPath + mediumPath );
                            }

                            let { mediumTitle, mediumWidth, mediumHeight } = this.getVideoData( linkElement.textContent );
                            let mediumMaximumWidth = this.getMaximumSize( mediumWidth, this.settings.videoMaximumWidth );
                            let mediumMaximumHeight = this.getMaximumSize( mediumHeight, this.settings.videoMaximumHeight );

                            let mediumElement = document.createElement( 'video' );
                            mediumElement.src = mediumPath;
                            mediumElement.autoplay = false;
                            mediumElement.loop = false;
                            mediumElement.controls = true;
                            mediumElement.title = mediumTitle;
                            mediumElement.style.width = mediumWidth;
                            mediumElement.style.height = mediumHeight;
                            mediumElement.style.maxWidth = mediumMaximumWidth;
                            mediumElement.style.maxHeight = mediumMaximumHeight;
                            mediumElement.style.objectFit = 'contain';

                            linkElement.parentNode.replaceChild( mediumElement, linkElement );
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

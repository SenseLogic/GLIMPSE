// -- IMPORTS

const { Plugin } = require( 'obsidian' );

// -- TYPES

module.exports = class Glimpse extends Plugin
{
    // -- OPERATIONS

    onload(
        )
    {
        this.registerMarkdownPostProcessor(
            ( element ) =>
            {
                let documentPath = this.app.workspace.getActiveFile().path;
                let basePath = documentPath.slice( 0, documentPath.lastIndexOf( '/' ) + 1 );

                element.querySelectorAll( 'a[ href$=".mp4" ], a[ href$=".webm" ]' ).forEach(
                    ( anchorElement ) =>
                    {
                        let videoPath = basePath + anchorElement.getAttribute( 'href' );
                        let videoElement = document.createElement( 'video' );
                        videoElement.src = this.app.vault.adapter.getResourcePath( videoPath );
                        videoElement.autoplay = false;
                        videoElement.loop = false;
                        videoElement.controls = true;
                        videoElement.style.marginTop = '16px';
                        videoElement.style.height = 'auto';
                        videoElement.style.maxHeight = '80vh';
                        videoElement.style.width = '100%';
                        anchorElement.insertAdjacentElement( 'afterend', videoElement );
                    }
                    );
            }
            );
    }

    // ~~

    onunload(
        )
    {
    }
};

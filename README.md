![](https://github.com/senselogic/GLIMPSE/blob/master/LOGO/glimpse.png)

# Glimpse

Customizable image and video rendering for Obsidian.

## Description

This plugin renders GIF/JPG/PNG/WEBP images and MP4/WEBM videos defined using the following formats :

*   `[title](path/to/video.ext)`
*   `[title](http://path/to/video.ext)`
*   `[title](https://path/to/video.ext)`
*   `![title](path/to/image.ext)`
*   `![title](http://path/to/image.ext)`
*   `![title](https://path/to/image.ext)`
*   `![title](path/to/video.ext)`
*   `![title](http://path/to/video.ext)`
*   `![title](https://path/to/video.ext)`
*   `![[path/to/image.ext|title]]`
*   `![[http://path/to/image.ext|title]]`
*   `![[https://path/to/image.ext|title]]`
*   `![[path/to/video.ext|title]]`
*   `![[http://path/to/video.ext|title]]`
*   `![[https://path/to/video.ext|title]]`

Their default minimum and maximum sizes can be adjusted in the plugin settings.

Their individual width or height can also be specified through the link title :

*   `![title¨50%](path/to/image.jpg)`
*   `![title¨16rem](http://path/to/image.png)`
*   `![title¨:9rem](https://path/to/image.webp)`
*   `![[path/to/video.mp4|title¨50%]]`
*   `![[http://path/to/video.mp4|title¨:16rem]]`
*   `![[https://path/to/video.webm|title¨:9rem]]`

## Limitations

*   The minimum width is still enforced when the maximum height is applied.

## Installation

*   In your vault folder, create a `.obsidian/plugins/glimpse` subfolder.
*   Copy `main.js`, `manifest.json` and `styles.css` inside this subfolder.
*   Enable the Glimpse plugin from the `Community plugins` settings panel.

## Version

1.0

## Author

Eric Pelzer (ecstatic.coder@gmail.com).

## License

This project is licensed under the GNU General Public License version 3.

See the [LICENSE.md](LICENSE.md) file for details.


![](https://github.com/senselogic/GLIMPSE/blob/master/LOGO/glimpse.png)

# Glimpse

Customizable image and video rendering for Obsidian.

## Description

This plugin renders image and video links with a customizable maximum height.

The following link formats are supported :
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

The following file extensions are supported :
*   .gif
*   .jpg
*   .png
*   .webp
*   .mp4
*   .webm

The width or height can be appended to the link title :

*   `![title¨50%](path/to/image.ext)`
*   `![title¨16rem](http://path/to/image.ext)`
*   `![title¨:9rem](https://path/to/image.ext)`
*   `![[path/to/video.ext|title¨50%]]`
*   `![[http://path/to/video.ext|title¨:16rem]]`
*   `![[https://path/to/video.ext|title¨:9rem]]`

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


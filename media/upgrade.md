# API Changes for the `core_media` subsystem

## 4.0

- The videojs-flash-lazy.js and videojs/video-js-swf libraries have been removed, because the Flash Player was deprecated
in 2017 and officially discontinued on 31 December 2020. Besides, the rtmp and useflash settings have been removed because
they are not required anymore, now that the flash support has been removed from the videojs media player.

## 3.8

- The final deprecation of core_media_manager::setup() means that this function will no longer be called.
The setup is now done in ::instance() so there is no need to call this.

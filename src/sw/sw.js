import { skipWaiting, clientsClaim, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

const pwaShellUrl = '/?source=pwa';

setCacheNameDetails({
    prefix: 'workbox',
    suffix: 'v1',
    precache: 'assets',
    runtime: 'runtime',
});

precacheAndRoute([...self.__WB_MANIFEST, { revision: null, url: pwaShellUrl }]);

skipWaiting();
clientsClaim();

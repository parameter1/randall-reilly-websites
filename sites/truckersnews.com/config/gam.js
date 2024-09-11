const configureGAM = require('@randall-reilly/package-global/config/gam');

const config = configureGAM({ basePath: 'TruckersNews', accountId: '313639551' });

config
  .setAliasAdUnits('default', [
    { name: 'leaderboard', templateName: 'LEADERBOARD', path: 'leaderboard' },
    { name: 'inline-leaderboard-mobile', templateName: 'INLINE-LEADERBOARD-MOBILE', path: 'leaderboard' },
    { name: 'leaderboard-desktop', templateName: 'LEADERBOARD-DESKTOP', path: 'leaderboard' },
    { name: 'rotation-desktop', templateName: 'ROTATION-DESKTOP', path: 'rotation' },
    { name: 'rotation', templateName: 'ROTATION', path: 'rotation' },
    { name: 'inline-content-mobile', templateName: 'INLINE-CONTENT-MOBILE', path: 'rotation' },
    { name: 'inline-content-desktop', templateName: 'INLINE-CONTENT-DESKTOP', path: 'rotation' },
    { name: 'wallpaper-left', templateName: 'WALLPAPER', path: 'wallpaper-left' },
    { name: 'wallpaper-right', templateName: 'WALLPAPER', path: 'wallpaper-right' },
  ])
  .setAliasAdUnits('gear', [
    { name: 'leaderboard', templateName: 'LEADERBOARD', path: 'gear-leaderboard' },
    { name: 'inline-leaderboard-mobile', templateName: 'INLINE-LEADERBOARD-MOBILE', path: 'gear-leaderboard' },
    { name: 'leaderboard-desktop', templateName: 'LEADERBOARD-DESKTOP', path: 'gear-leaderboard' },
    { name: 'rotation-desktop', templateName: 'ROTATION-DESKTOP', path: 'gear-rotation-1' },
    { name: 'leaderboard-2', templateName: 'LEADERBOARD', path: 'gear-leaderboard' },
    { name: 'rotation', templateName: 'LEADERBOARD', path: 'gear-leaderboard' },
    { name: 'rotation-1', templateName: 'GEAR', path: 'gear-rotation-1' },
    { name: 'rotation-2', templateName: 'GEAR', path: 'gear-rotation-2' },
    { name: 'rotation-3', templateName: 'GEAR', path: 'gear-rotation-3' },
    { name: 'rotation-1-mobile', templateName: 'GEAR-MOBILE', path: 'gear-rotation-1' },
    { name: 'rotation-2-mobile', templateName: 'GEAR-MOBILE', path: 'gear-rotation-2' },
    { name: 'rotation-3-mobile', templateName: 'GEAR-MOBILE', path: 'gear-rotation-3' },
    { name: 'inline-content-mobile', templateName: 'INLINE-CONTENT-MOBILE', path: 'gear-leaderboard' },
    { name: 'inline-content-desktop', templateName: 'INLINE-CONTENT-DESKTOP', path: 'gear-leaderboard' },
    { name: 'wallpaper-left', templateName: 'WALLPAPER', path: 'gear-wallpaper-left' },
    { name: 'wallpaper-right', templateName: 'WALLPAPER', path: 'gear-wallpaper-right' },
  ]);

module.exports = config;

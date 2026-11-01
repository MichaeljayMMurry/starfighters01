STARFIGHTERS — self-hosting package

Upload the CONTENTS of this folder to a static web host. Keep downloads/ beside index.html.
Serve index.html as the homepage. No build tools, database, account system, or backend are required.
Use HTTPS. Serve .apk as application/vnd.android.package-archive (or application/octet-stream).
The Windows browser game is battle.html. Mobile visitors get installation guidance; the background simulation remains visible on mobile.
Android installation requires the player to confirm in Android; a website cannot silently install an APK.
Android 8.0+; no iOS build. Installed gameplay is offline and single-player.

Local preview: from murrys-game run node preview-website.mjs

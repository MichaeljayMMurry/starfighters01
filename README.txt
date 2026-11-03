STARFIGHTERS — self-hosting package

Upload the CONTENTS of this folder to a static web host. Keep resources/ and downloads/ beside index.html.
Serve index.html as the homepage. No build tools, database, account system, or backend are required.
Use HTTPS. Serve .apk as application/vnd.android.package-archive (or application/octet-stream) and .sfpack as application/octet-stream.
The Windows browser game is battle.html. Mobile visitors get installation guidance; the background simulation remains visible on mobile.
Browser music: Download music pack, choose Load music pack, then Play with Resources. The in-game Music screen also accepts the pack. It contains all five tracks and is saved for later visits when browser storage is available. Play Now works with built-in effects without the music pack.
Android already includes all five tracks inside its APK; no separate music download is required.
Android installation requires the player to confirm in Android; a website cannot silently install an APK.
Android 8.0+; no iOS build. Installed gameplay is offline and single-player.

GitHub upload: the browser has a 25 MiB per-file limit. Clone the repository with GitHub Desktop, copy these extracted contents into its root, Commit, then Push. Do not commit the distribution ZIP or standalone Windows HTML. This website contains no individual file over 100 MiB. Large distribution ZIPs can be attached to a GitHub Release instead.

Local preview: from murrys-game run node preview-website.mjs

import {createAudioResourceManager,musicPackForLocation,loadLocalMusicPack} from './resources.mjs';
import {createBattleAudio} from './audio.mjs';
import resourceManifest from './resources-config.mjs';
import {detectPlatform} from './platform.mjs';
const platform=detectPlatform(navigator),q=id=>document.getElementById(id),intro=q('intro'),backdrop=q('battle');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let introDone=false;
function finishIntro(){if(introDone)return;introDone=true;intro.classList.add('out');intro.setAttribute('inert','');}
q('skip-intro').addEventListener('click',finishIntro);
document.addEventListener('keydown',e=>{if(!introDone&&['Enter','Escape',' '].includes(e.key)){e.preventDefault();finishIntro();}});
setTimeout(finishIntro,reducedMotion?700:3100);
function enforcePlatform(e){
 if(platform==='windows')return;e.preventDefault();
 q('platform-title').textContent=platform==='android'?'You’re on Android. Install to play.':platform==='ios'?'Android and Windows only.':'Windows is required for browser play.';
 q('platform-message').textContent=platform==='android'?'The browser edition uses Windows keyboard controls. Download the Android edition for touch controls and offline play.':platform==='ios'?'The Android APK cannot be installed on iPhone or iPad. Open this website on Windows to play in your browser.':'Open this website on a Windows PC to play immediately, or install the APK on an Android phone or tablet.';
 q('platform-dialog').querySelector('[data-android]').hidden=platform==='ios';q('platform-dialog').showModal();return false;
}
q('play-now').addEventListener('click',enforcePlatform);
for(const link of document.querySelectorAll('#android-download,[data-android]'))link.addEventListener('click',e=>{
 if(platform==='ios'){e.preventDefault();q('platform-title').textContent='This download is for Android.';q('platform-message').textContent='iPhone and iPad cannot install this APK. You can play in a browser on a Windows PC.';q('platform-dialog').querySelector('[data-android]').hidden=true;if(!q('platform-dialog').open)q('platform-dialog').showModal();return;}
 q('platform-dialog').close();if(!q('install-dialog').open)q('install-dialog').showModal();
});
for(const b of document.querySelectorAll('[data-close]'))b.addEventListener('click',()=>b.closest('dialog').close());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
q('controls-link').addEventListener('click',()=>q('manual-dialog').showModal());
const modes={custom:['5:5','FLEET COMMAND','Choose a side. Command the fleet.','Choose each side’s ship class and fleet size independently, and transfer into surviving allies. Shields, weapon failures, engine damage and repairs shape each battle. Optional experimental scenery adds a planet and a distant decorative war.'],easy:['01','LEARN YOUR SHIP','A duel among the stars.','One Imperial destroyer. Space to prepare your locks before the first exchange. Learn the turns, line up your batteries, and bring it down.'],medium:['02','HOLD YOUR GROUND','Two threats. One command.','Two Imperial destroyers close on your position. Split your weapon assignments, watch your firing angles, and use turbo to keep room to turn.'],hard:['03','OUTNUMBERED','Make every broadside count.','Three Imperial destroyers pursue and fire independently. Select multiple targets, divide your batteries, and avoid the wreckage as their hulls break apart.'],demo:['∞','YOUR OWN PLAYGROUND','Build the battle you want.','Spawn allied or enemy Imperial destroyers or Venators, activate fleet AI, toggle your invincibility, or practice on the immortal dummy. Add ships again whenever you want.']};
const tabs=[...document.querySelectorAll('[data-mode]')];
function selectMode(button){for(const b of tabs){b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;}const data=modes[button.dataset.mode];['mode-number','mode-label','mode-title','mode-copy'].forEach((id,i)=>q(id).textContent=data[i]);q('mode-detail').setAttribute('aria-labelledby',button.id);}
for(const b of tabs){b.addEventListener('click',()=>selectMode(b));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=tabs.indexOf(b),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectMode(tabs[next]);tabs[next].focus();});}
let backgroundPaused=reducedMotion;
function syncBackground(){backdrop.contentWindow?.postMessage({type:'starfighters-background',paused:backgroundPaused||document.hidden},location.origin);q('toggle-battle').setAttribute('aria-pressed',String(backgroundPaused));q('toggle-battle').setAttribute('aria-label',backgroundPaused?'Resume background battle':'Pause background battle');q('toggle-battle').textContent=backgroundPaused?'▶':'Ⅱ';}
q('toggle-battle').addEventListener('click',()=>{backgroundPaused=!backgroundPaused;syncBackground();});backdrop.addEventListener('load',syncBackground);document.addEventListener('visibilitychange',syncBackground);

const websiteAudio=createBattleAudio({}),pack=musicPackForLocation(resourceManifest,location.href),musicResources=createAudioResourceManager({manifest:pack,baseUrl:location.href,packLoader:location.protocol==='file:'?()=>loadLocalMusicPack(location.href):null,consumer:(id,bytes)=>websiteAudio.stageMusic(id,bytes)});let websiteMusic=true;
function resourceStatus(text){q('resource-download-status').textContent=text;}
function tickWebsiteMusic(){websiteAudio.update({dt:.25,active:websiteMusic&&!document.hidden,session:'website'});q('website-music').setAttribute('aria-pressed',String(websiteMusic&&websiteAudio.has('across-stars')));}
musicResources.restore().then(()=>{if(websiteAudio.has('across-stars'))resourceStatus('Music resources saved for offline play.');});
document.addEventListener('pointerdown',()=>{websiteAudio.unlock();tickWebsiteMusic();});
q('website-music').addEventListener('click',()=>{websiteAudio.unlock();if(!websiteAudio.has('across-stars')){resourceStatus('Download the music pack, then choose Load music pack.');return;}websiteMusic=!websiteMusic;tickWebsiteMusic();});
q('play-with-resources').setAttribute('aria-disabled',String(!musicResources.ready));
q('website-music-pack').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;await websiteAudio.unlock();try{await musicResources.importPack(file,p=>resourceStatus('Loading soundtracks: '+Math.floor(p.loaded/p.total*100)+'%'));resourceStatus(musicResources.message);tickWebsiteMusic();}catch(error){resourceStatus(error.message);}});
q('play-with-resources').addEventListener('click',e=>{if(platform!=='windows'){enforcePlatform(e);return;}e.preventDefault();if(!musicResources.tracks.every(t=>musicResources.has(t.id))){resourceStatus('Download the music pack, then choose Load music pack. Play Now also works without music.');return;}if(!musicResources.persistent){resourceStatus('Music storage is unavailable here. Use Play Now, then load the pack inside the game Music menu.');return;}location.href='battle.html?resources=1';});

setInterval(tickWebsiteMusic,250);
document.addEventListener('visibilitychange',()=>{if(document.hidden)websiteAudio.suspend();else websiteAudio.unlock();});

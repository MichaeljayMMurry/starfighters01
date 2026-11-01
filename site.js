import {detectPlatform} from './platform.mjs';
const platform=detectPlatform(navigator),q=id=>document.getElementById(id),intro=q('intro'),backdrop=q('battle');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let introDone=false;
function finishIntro(){if(introDone)return;introDone=true;intro.classList.add('out');intro.setAttribute('inert','');}
q('skip-intro').addEventListener('click',finishIntro);
document.addEventListener('keydown',e=>{if(!introDone&&['Enter','Escape',' '].includes(e.key)){e.preventDefault();finishIntro();}});
setTimeout(finishIntro,reducedMotion?700:3100);
q('play-now').addEventListener('click',e=>{
 if(platform==='windows')return;e.preventDefault();
 q('platform-title').textContent=platform==='android'?'You’re on Android. Install to play.':platform==='ios'?'Android and Windows only.':'Windows is required for browser play.';
 q('platform-message').textContent=platform==='android'?'The browser edition uses Windows keyboard controls. Download the Android edition for touch controls and offline play.':platform==='ios'?'The Android APK cannot be installed on iPhone or iPad. Open this website on Windows to play in your browser.':'Open this website on a Windows PC to play immediately, or install the APK on an Android phone or tablet.';
 q('platform-dialog').querySelector('[data-android]').hidden=platform==='ios';q('platform-dialog').showModal();
});
for(const link of document.querySelectorAll('#android-download,[data-android]'))link.addEventListener('click',e=>{
 if(platform==='ios'){e.preventDefault();q('platform-title').textContent='This download is for Android.';q('platform-message').textContent='iPhone and iPad cannot install this APK. You can play in a browser on a Windows PC.';q('platform-dialog').querySelector('[data-android]').hidden=true;if(!q('platform-dialog').open)q('platform-dialog').showModal();return;}
 q('platform-dialog').close();if(!q('install-dialog').open)q('install-dialog').showModal();
});
for(const b of document.querySelectorAll('[data-close]'))b.addEventListener('click',()=>b.closest('dialog').close());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
q('controls-link').addEventListener('click',()=>q('manual-dialog').showModal());
const modes={easy:['01','LEARN YOUR SHIP','A duel among the stars.','One Imperial destroyer. Space to prepare your locks before the first exchange. Learn the turns, line up your batteries, and bring it down.'],medium:['02','HOLD YOUR GROUND','Two threats. One command.','Two Imperial destroyers close on your position. Split your weapon assignments, watch your firing angles, and use turbo to keep room to turn.'],hard:['03','OUTNUMBERED','Make every broadside count.','Three Imperial destroyers pursue and fire independently. Select multiple targets, divide your batteries, and avoid the wreckage as their hulls break apart.'],demo:['∞','YOUR OWN PLAYGROUND','Build the battle you want.','Spawn more Imperial destroyers or Venators, activate their AI, toggle your invincibility, or practice on the immortal dummy. Add ships again whenever you want.']};
const tabs=[...document.querySelectorAll('[data-mode]')];
function selectMode(button){for(const b of tabs){b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;}const data=modes[button.dataset.mode];['mode-number','mode-label','mode-title','mode-copy'].forEach((id,i)=>q(id).textContent=data[i]);q('mode-detail').setAttribute('aria-labelledby',button.id);}
for(const b of tabs){b.addEventListener('click',()=>selectMode(b));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=tabs.indexOf(b),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectMode(tabs[next]);tabs[next].focus();});}
let backgroundPaused=reducedMotion;
function syncBackground(){backdrop.contentWindow?.postMessage({type:'starfighters-background',paused:backgroundPaused||document.hidden},location.origin);q('toggle-battle').setAttribute('aria-pressed',String(backgroundPaused));q('toggle-battle').setAttribute('aria-label',backgroundPaused?'Resume background battle':'Pause background battle');q('toggle-battle').textContent=backgroundPaused?'▶':'Ⅱ';}
q('toggle-battle').addEventListener('click',()=>{backgroundPaused=!backgroundPaused;syncBackground();});backdrop.addEventListener('load',syncBackground);document.addEventListener('visibilitychange',syncBackground);

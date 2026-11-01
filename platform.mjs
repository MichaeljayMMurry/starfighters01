export function detectPlatform(nav){
 const ua=nav.userAgent||'',platform=nav.userAgentData?.platform||nav.platform||'';
 if(/Android/i.test(ua)||/Android/i.test(platform))return 'android';
 if(/iPhone|iPad|iPod/i.test(ua)||/Mac/i.test(platform)&&nav.maxTouchPoints>1)return 'ios';
 if(/Windows/i.test(ua)||/^Win/i.test(platform))return 'windows';
 return 'other';
}

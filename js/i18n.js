/* VibeSyncro multilingual loader — 52 locales, key-level English fallback, searchable accessible picker. */
(function(window,document){
"use strict";
const LANGUAGES=[
["en","English","English"],["hi","हिन्दी","Hindi"],["te","తెలుగు","Telugu"],["ta","தமிழ்","Tamil"],["kn","ಕನ್ನಡ","Kannada"],["ml","മലയാളം","Malayalam"],["mr","मराठी","Marathi"],["gu","ગુજરાતી","Gujarati"],["bn","বাংলা","Bengali"],["pa","ਪੰਜਾਬੀ","Punjabi"],["ur","اردو","Urdu"],["or","ଓଡ଼ିଆ","Odia"],["as","অসমীয়া","Assamese"],["ne","नेपाली","Nepali"],["si","සිංහල","Sinhala"],["es","Español","Spanish"],["fr","Français","French"],["de","Deutsch","German"],["it","Italiano","Italian"],["pt","Português","Portuguese"],["ru","Русский","Russian"],["uk","Українська","Ukrainian"],["pl","Polski","Polish"],["nl","Nederlands","Dutch"],["sv","Svenska","Swedish"],["no","Norsk","Norwegian"],["da","Dansk","Danish"],["fi","Suomi","Finnish"],["tr","Türkçe","Turkish"],["ar","العربية","Arabic"],["fa","فارسی","Persian"],["he","עברית","Hebrew"],["id","Bahasa Indonesia","Indonesian"],["ms","Bahasa Melayu","Malay"],["th","ไทย","Thai"],["vi","Tiếng Việt","Vietnamese"],["ja","日本語","Japanese"],["ko","한국어","Korean"],["zh","中文","Chinese"],["tl","Filipino","Filipino"],["sw","Kiswahili","Swahili"],["am","አማርኛ","Amharic"],["ha","Hausa","Hausa"],["yo","Yorùbá","Yoruba"],["zu","isiZulu","Zulu"],["af","Afrikaans","Afrikaans"],["cs","Čeština","Czech"],["hu","Magyar","Hungarian"],["ro","Română","Romanian"],["el","Ελληνικά","Greek"],["bg","Български","Bulgarian"],["hr","Hrvatski","Croatian"]];
const supported=LANGUAGES.map(x=>x[0]),rtl=new Set(["ar","fa","he","ur"]),fallback="en";
let dictionary={},english=null,activeLanguage=fallback,initPromise=null;
const menus=Array.from(document.querySelectorAll("[data-language-menu]"));
const getLang=code=>LANGUAGES.find(x=>x[0]===code)||LANGUAGES[0];
function savedLanguage(){try{const v=localStorage.getItem("vibesyncro-language");return supported.includes(v)?v:fallback;}catch(_){return fallback;}}
function closeMenu(menu,focus){const t=menu.querySelector(".language-trigger"),p=menu.querySelector(".language-dropdown");if(!t||!p)return;p.classList.add("hidden");t.setAttribute("aria-expanded","false");if(focus)t.focus();}
function syncMenus(){
 menus.forEach(menu=>{
  const label=menu.querySelector(".language-current-label"),lang=getLang(activeLanguage);
  if(label)label.textContent=lang[1]+" ("+lang[2]+")";
  menu.querySelectorAll("[data-language-code]").forEach(b=>b.setAttribute("aria-checked",String(b.dataset.languageCode===activeLanguage)));
  const input=menu.querySelector(".language-search");if(input&&dictionary.languageSearch)input.placeholder=dictionary.languageSearch;
 });
}
function filterMenu(menu,q){
 const query=q.trim().toLocaleLowerCase();let count=0;
 menu.querySelectorAll(".language-options li").forEach(li=>{
  const b=li.querySelector("[data-language-code]"),l=getLang(b.dataset.languageCode);
  li.hidden=!!query&&!(l.join(" ").toLocaleLowerCase().includes(query));if(!li.hidden)count++;
 });
 const empty=menu.querySelector(".language-no-results");if(empty)empty.hidden=count>0;
}
function renderMenus(){
 menus.forEach(menu=>{
  const list=menu.querySelector(".language-options");if(!list||list.dataset.ready==="true")return;
  LANGUAGES.forEach(([code,nativeName,englishName])=>{
   const li=document.createElement("li"),b=document.createElement("button");
   b.type="button";b.className="language-option";b.setAttribute("role","menuitemradio");b.setAttribute("aria-checked","false");b.dataset.languageCode=code;
   const native=document.createElement("span");native.className="language-option-native";native.textContent=nativeName;
   const english=document.createElement("span");english.className="language-option-english";english.textContent=" ("+englishName+")";
   const check=document.createElement("i");check.className="fa-solid fa-check language-option-check";check.setAttribute("aria-hidden","true");
   b.append(native,english,check);
   b.addEventListener("click",async()=>{const ok=await apply(code);if(ok)closeMenu(menu,false);menu.querySelector(".language-trigger")?.focus();});
   b.addEventListener("keydown",e=>{
    const visible=Array.from(list.querySelectorAll("li:not([hidden]) .language-option")),i=visible.indexOf(b);let n=null;
    if(e.key==="ArrowDown")n=Math.min(i+1,visible.length-1);if(e.key==="ArrowUp")n=Math.max(0,i-1);
    if(e.key==="Home")n=0;if(e.key==="End")n=visible.length-1;
    if(n!==null&&visible[n]){e.preventDefault();visible[n].focus();}
   });
   li.appendChild(b);list.appendChild(li);
  });
  list.dataset.ready="true";
 });
 syncMenus();
}
function bindMenus(){
 renderMenus();
 menus.forEach(menu=>{
  if(menu.dataset.bound==="true")return;menu.dataset.bound="true";
  const trigger=menu.querySelector(".language-trigger"),panel=menu.querySelector(".language-dropdown"),search=menu.querySelector(".language-search");
  if(!trigger||!panel)return;
  trigger.addEventListener("click",()=>{
   const open=trigger.getAttribute("aria-expanded")!=="true";menus.forEach(m=>closeMenu(m,false));
   if(open){panel.classList.remove("hidden");trigger.setAttribute("aria-expanded","true");if(search){search.value="";filterMenu(menu,"");requestAnimationFrame(()=>search.focus());}}
  });
  if(search)search.addEventListener("input",()=>filterMenu(menu,search.value));
 });
 document.addEventListener("click",e=>menus.forEach(m=>{if(!m.contains(e.target))closeMenu(m,false);}));
 document.addEventListener("keydown",e=>{
  if(e.key!=="Escape")return;const open=menus.find(m=>m.querySelector(".language-trigger")?.getAttribute("aria-expanded")==="true");
  if(open){e.preventDefault();closeMenu(open,true);}
 });
}
function translateDom(dict){
 document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.getAttribute("data-i18n");if(Object.prototype.hasOwnProperty.call(dict,k))el.textContent=dict[k];});
 document.querySelectorAll("[data-i18n-attr]").forEach(el=>el.getAttribute("data-i18n-attr").split(",").forEach(pair=>{
  const [attr,key]=pair.trim().split(":");if(attr&&key&&Object.prototype.hasOwnProperty.call(dict,key))el.setAttribute(attr,dict[key]);
 }));
}
async function loadJson(code){
 const url=new URL("locales/"+code+".json",document.baseURI),r=await fetch(url.toString(),{cache:"no-cache"});
 if(!r.ok)throw new Error("Locale load failed: "+code+" ("+r.status+")");return r.json();
}
async function apply(language,options){
 const requested=supported.includes(language)?language:fallback,settings=options||{};
 try{
  if(!english)english=await loadJson(fallback);
  const translated=requested===fallback?{}:await loadJson(requested);
  dictionary=Object.assign({},english,translated);activeLanguage=requested;
  document.documentElement.lang=requested;document.documentElement.dir=rtl.has(requested)?"rtl":"ltr";
  translateDom(dictionary);syncMenus();
  if(settings.persist!==false){try{localStorage.setItem("vibesyncro-language",requested);}catch(_){}}
  document.dispatchEvent(new CustomEvent("vibesyncro:languagechange",{detail:{language:activeLanguage,direction:rtl.has(requested)?"rtl":"ltr"}}));
  return true;
 }catch(error){
  console.error("VibeSyncro locale load failed; using English fallback.",error);
  try{if(!english)english=await loadJson(fallback);dictionary=Object.assign({},english);}catch(_){dictionary={};}
  activeLanguage=fallback;document.documentElement.lang="en";document.documentElement.dir="ltr";
  translateDom(dictionary);syncMenus();return false;
 }
}
function init(){if(initPromise)return initPromise;bindMenus();initPromise=apply(savedLanguage(),{persist:false});return initPromise;}
function t(key){return Object.prototype.hasOwnProperty.call(dictionary,key)?dictionary[key]:key;}
window.VibeI18n={init,apply,t,get language(){return activeLanguage;},get supportedLanguages(){return supported.slice();},get languages(){return LANGUAGES.map(([code,nativeName,englishName])=>({code,nativeName,englishName}));}};
})(window,document);

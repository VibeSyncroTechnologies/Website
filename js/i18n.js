/* Lightweight JSON locale loader. Five translated UI locales are currently shipped. */
window.VibeI18n=(function(){
 const supported=["en","hi","te","ta","kn"];
 async function apply(lang){
  const chosen=supported.includes(lang)?lang:"en";
  try{const response=await fetch("locales/"+chosen+".json");if(!response.ok)throw new Error("Locale unavailable");const dict=await response.json();document.documentElement.lang=chosen;document.querySelectorAll("[data-i18n]").forEach(el=>{const value=dict[el.dataset.i18n];if(typeof value==="string")el.textContent=value;});document.querySelectorAll("#languageSelect,#languageSelectMobile").forEach(select=>select.value=chosen);localStorage.setItem("vibesyncro-language",chosen);}
  catch(error){console.warn("Using English interface labels:",error);}
 }
 function init(){
  const query=new URLSearchParams(location.search).get("lang");
  const saved=query||localStorage.getItem("vibesyncro-language")||"en";
  apply(saved);
  document.querySelectorAll("#languageSelect,#languageSelectMobile").forEach(select=>select.addEventListener("change",()=>apply(select.value)));
 }
 return {init,apply};
})();
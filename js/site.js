/* Navigation and forms; header and footer are static HTML in every page. */
(function () {
"use strict";
const menu=document.getElementById("menuBtn"),panel=document.getElementById("mobileMenu");
const close=()=>{if(!menu||!panel)return;menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation");menu.innerHTML='<i class="fas fa-bars text-lg" aria-hidden="true"></i>';panel.classList.add("hidden");};
if(menu&&panel){
 menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")!=="true";menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation":"Open navigation");menu.innerHTML=open?'<i class="fas fa-xmark text-lg" aria-hidden="true"></i>':'<i class="fas fa-bars text-lg" aria-hidden="true"></i>';panel.classList.toggle("hidden",!open);});
 panel.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
 document.addEventListener("click",e=>{if(menu.getAttribute("aria-expanded")==="true"&&!panel.contains(e.target)&&!menu.contains(e.target))close();});
}
const current=location.pathname.split("/").pop()||"index.html";
document.querySelectorAll("header nav a[href]").forEach(a=>{if(a.getAttribute("href")===current){a.setAttribute("aria-current","page");a.classList.add("text-primaryRed","font-semibold");}});
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
if(window.VibeI18n)window.VibeI18n.init();
const sendMail=(subject,body)=>{location.href="mailto:admin@vibesyncro.com?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);};
document.querySelectorAll(".notify-form").forEach(form=>form.addEventListener("submit",async e=>{
 const email=form.querySelector('input[type="email"]');if(!email||!email.checkValidity()){e.preventDefault();email?.reportValidity();return;}e.preventDefault();
 const status=form.querySelector(".notify-success"),subject=form.querySelector('[name="_subject"]')?.value||"SafeMobile update",body="Please notify me about updates. My email address is "+email.value.trim()+".";
 if(form.action.includes("REPLACE_WITH_FORM_ID")){if(status){status.textContent="Your email app is opening with your request. Send the email there to subscribe.";status.classList.remove("hidden");}sendMail(subject,body);return;}
 const btn=form.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.textContent="Sending…";}
 try{const r=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});if(!r.ok)throw new Error("Submission failed");if(status){status.textContent="Thank you. Your request has been received.";status.classList.remove("hidden");}form.reset();}
 catch(err){if(status){status.textContent="We could not submit your request. Opening an email draft instead.";status.classList.remove("hidden");}sendMail(subject,body);}
 finally{if(btn){btn.disabled=false;btn.textContent="Notify me";}}
}));
const contact=document.getElementById("contactForm");
contact?.addEventListener("submit",async e=>{
 if(!contact.checkValidity()){e.preventDefault();contact.reportValidity();return;}e.preventDefault();
 const name=contact.elements.name.value.trim(),email=contact.elements.email.value.trim(),subject=contact.elements.subject.value.trim(),message=contact.elements.message.value.trim(),mailSubject="Website enquiry: "+subject,body="Name: "+name+"\nEmail: "+email+"\nSubject: "+subject+"\n\n"+message,status=document.getElementById("contactStatus");
 if(contact.action.includes("REPLACE_WITH_FORM_ID")){if(status){status.textContent="Your email app is opening with your message. Send the email there to contact us.";status.classList.remove("hidden");}sendMail(mailSubject,body);return;}
 const btn=contact.querySelector('button[type="submit"]');if(btn){btn.disabled=true;btn.textContent="Sending…";}
 try{const r=await fetch(contact.action,{method:"POST",body:new FormData(contact),headers:{Accept:"application/json"}});if(!r.ok)throw new Error("Submission failed");if(status){status.textContent="Thank you. Your message has been sent.";status.classList.remove("hidden");}contact.reset();}
 catch(err){if(status){status.textContent="We could not submit the form. Opening an email draft instead.";status.classList.remove("hidden");}sendMail(mailSubject,body);}
 finally{if(btn){btn.disabled=false;btn.textContent="Send message";}}
});
document.querySelectorAll(".capability").forEach(btn=>btn.addEventListener("click",()=>{const copy={scan:"Research direction: on-device checks to help identify vulnerabilities and unusual device conditions. Planned, not released.",finance:"Research direction: tools to help users recognise financial risk signals. No financial protection feature is currently available.",privacy:"Design objective: avoid unnecessary telemetry and keep processing local where practical.",ai:"Research direction: explore on-device AI for security analysis while minimising data sharing."};const target=document.getElementById("capabilityDetail");if(target)target.textContent=copy[btn.dataset.cap]||"This capability is under research.";document.querySelectorAll(".capability").forEach(x=>x.setAttribute("aria-expanded",String(x===btn)));}));
})();
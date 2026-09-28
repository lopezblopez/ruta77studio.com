(()=>{'use strict';
const header=document.querySelector('header');
const menu=document.querySelector('.menu-toggle');
if(menu&&header){menu.addEventListener('click',()=>{const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});header.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('open');menu.setAttribute('aria-expanded','false');}));}
const dialog=document.getElementById('lightbox');
const large=document.getElementById('large-photo');
const caption=document.getElementById('photo-caption');
const count=document.getElementById('photo-count');
const items=[...document.querySelectorAll('[data-gallery]')].map(el=>({src:el.querySelector('img')?.src,alt:el.querySelector('img')?.alt||'',caption:el.dataset.caption||''}));
let current=0;
function show(i){if(!items.length||!dialog)return;current=(i+items.length)%items.length;large.src=items[current].src;large.alt=items[current].alt;caption.textContent=items[current].caption||items[current].alt;count.textContent=(current+1)+' / '+items.length;}
document.querySelectorAll('[data-gallery]').forEach((el,i)=>el.addEventListener('click',()=>{show(i);dialog.showModal();}));
document.getElementById('close-lightbox')?.addEventListener('click',()=>dialog.close());
document.getElementById('next-photo')?.addEventListener('click',()=>show(current+1));
document.getElementById('prev-photo')?.addEventListener('click',()=>show(current-1));
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
document.addEventListener('keydown',e=>{if(!dialog?.open)return;if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1);});
document.querySelectorAll('form[data-email]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const email=form.dataset.email;const subject=form.dataset.subject||'Ruta77';const lines=[];for(const [k,v] of d.entries()){if(String(v).trim())lines.push(k+': '+String(v).trim());}window.location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n'));}));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
})();
import {tokyoToday, validateStay, buildEnquiry, mailDraft} from './enquiry-utils.js';

const header = document.querySelector('header');
const menu = document.querySelector('.menu-toggle');
function closeMenu() {
  header?.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
}
menu?.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
});
header?.querySelectorAll('nav a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && header?.classList.contains('open')) {closeMenu(); menu.focus();}
});
document.addEventListener('click', e => {if (header && !header.contains(e.target)) closeMenu();});
document.querySelectorAll('[data-language]').forEach(a => {
  a.addEventListener('click', () => {
    const next = new URL(a.getAttribute('href'),location.origin);
    next.hash = location.hash;
    a.href = next.href;
  });
});

const dialog = document.getElementById('lightbox');
const large = document.getElementById('large-photo');
const caption = document.getElementById('photo-caption');
const count = document.getElementById('photo-count');
const galleryButtons = [...document.querySelectorAll('[data-gallery]')];
const items = galleryButtons.map(el => ({src:el.querySelector('img').src,alt:el.querySelector('img').alt,caption:el.dataset.caption,grade:el.querySelector('img').dataset.photoGrade}));
let current = 0, opener;
function show(index) {
  current = (index + items.length) % items.length;
  large.src = items[current].src;
  large.alt = items[current].alt;
  large.dataset.photoGrade = items[current].grade;
  caption.textContent = items[current].caption;
  count.textContent = (current+1)+' / '+items.length;
}
function openPhoto(button,index) {
  opener=button; show(index); dialog.showModal(); document.body.classList.add('gallery-open');
}
galleryButtons.forEach((button,index) => button.addEventListener('click', () => openPhoto(button,index)));
document.querySelectorAll('[data-photo-index]').forEach(button => {
  button.addEventListener('click', () => openPhoto(button,Number(button.dataset.photoIndex)));
});
document.getElementById('close-lightbox')?.addEventListener('click', () => dialog.close());
document.getElementById('next-photo')?.addEventListener('click', () => show(current+1));
document.getElementById('prev-photo')?.addEventListener('click', () => show(current-1));
dialog?.addEventListener('close', () => {document.body.classList.remove('gallery-open');opener?.focus();});
dialog?.addEventListener('click', e => {if (e.target===dialog) dialog.close();});
document.addEventListener('keydown', e => {
  if (!dialog?.open) return;
  if (e.key==='ArrowRight') {e.preventDefault();show(current+1);}
  if (e.key==='ArrowLeft') {e.preventDefault();show(current-1);}
});
count?.setAttribute('aria-live','polite');

const form = document.getElementById('stay-enquiry');
if (form) {
  const strings=JSON.parse(document.getElementById('enquiry-translations').textContent);
  form.querySelector('fieldset').disabled=false;
  const arrival=form.elements.arrival, departure=form.elements.departure;
  arrival.min=tokyoToday(); departure.min=tokyoToday();
  const result=document.getElementById('enquiry-result');
  const error=document.getElementById('form-error');
  const text=document.getElementById('enquiry-text');
  const draft=document.getElementById('send-email');
  const status=document.getElementById('copy-status');
  const hidePrepared=()=>{result.hidden=true;status.textContent='';error.hidden=true;};
  form.addEventListener('input',hidePrepared);
  arrival.addEventListener('change',()=>{
    if (!arrival.value) {departure.min=tokyoToday();return;}
    const next=new Date(arrival.value+'T00:00:00Z');
    next.setUTCDate(next.getUTCDate()+1);
    departure.min=next.toISOString().slice(0,10);
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if(!form.reportValidity()) return;
    const values=Object.fromEntries(new FormData(form));
    const problem=validateStay(values);
    if(problem) {result.hidden=true;error.textContent=strings[problem];error.hidden=false;error.scrollIntoView({block:'nearest'});return;}
    error.hidden=true;
    text.value=buildEnquiry(values,strings.formLabels,strings.subject);
    draft.href=mailDraft(form.dataset.email,strings.subject,text.value);
    status.textContent='';
    document.getElementById('send-status').textContent=strings.notSent;
    result.hidden=false;
    document.getElementById('result-title').focus();
    result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
  });
  document.getElementById('copy-enquiry').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(text.value);status.textContent=strings.copied;}
    catch {text.focus();text.select();status.textContent=strings.copyFail;}
  });
}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));

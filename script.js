'use strict';
const dialog=document.getElementById('lightbox');
const tiles=Array.from(document.querySelectorAll('[data-photo]'));
let current=0;
function displayPhoto(index){current=(index+tiles.length)%tiles.length;const original=tiles[current].querySelector('img');const large=document.getElementById('large-photo');large.src=original.src;large.alt=original.alt;document.getElementById('photo-caption').textContent=original.alt;document.getElementById('photo-count').textContent=`${current+1} / ${tiles.length}`;}
tiles.forEach((tile,i)=>tile.addEventListener('click',()=>{displayPhoto(i);dialog.showModal();document.body.classList.add('modal-open');}));
document.getElementById('close-lightbox').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('prev-photo').addEventListener('click',()=>displayPhoto(current-1));
document.getElementById('next-photo').addEventListener('click',()=>displayPhoto(current+1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();displayPhoto(current-1)}if(e.key==='ArrowRight'){e.preventDefault();displayPhoto(current+1)}});
const form=document.querySelector('form');
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const body=`${data.get('name')}\n${data.get('dates')}\n\n${data.get('message')}`;window.location.href=`mailto:marjo@ruta77studio.com?subject=${encodeURIComponent(form.dataset.subject)}&body=${encodeURIComponent(body)}`;});

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

// Pet hosting is not currently offered.
document.querySelectorAll('a[href="#pets"]').forEach(link=>link.remove());
document.querySelectorAll('#pets').forEach(section=>section.remove());

// Day-use pricing: every booking requires a full reset and cleaning visit.
const ratesGrid=document.querySelector('.rate-grid');
const rateHeading=document.querySelector('.rates .section-heading h2');
const rateIntro=document.querySelector('.rates .section-heading p');
if(ratesGrid&&rateHeading&&rateIntro){
  const lang=document.documentElement.lang;
  const copy=lang==='es'
    ? {heading:'Uso privado por jornada completa.',intro:'Cada reserva implica preparar y limpiar la casa. Por eso trabajamos con una reserva privada de la casa completa, no con pases por horas ni precios individuales.',cowork:'Coworking privado',coworkText:'La casa completa para trabajar, reunirse o crear durante una jornada. El precio se calcula por reserva y grupo.',yoga:'Yoga y retiros',yogaText:'La casa completa para una práctica, un retiro pequeño o una clase organizada por el propio profesor. El profesor no está incluido.',day:'Jornada completa',price:'Desde ¥25.000',note:'Tarifa orientativa por reserva privada; incluye una limpieza estándar posterior. Fin de semana, temporada alta, grupos grandes o necesidades especiales: presupuesto individual.',stay:'Estancias',stayText:'La apertura del alojamiento, la capacidad y las tarifas de noche se publicarán cuando estén confirmadas.'}
    : lang==='ja'
    ? {heading:'一日貸切で、ゆっくり使う。',intro:'ご利用ごとに準備と清掃が必要なため、時間単位や一人単位ではなく、家全体の一日貸切でご案内します。',cowork:'コワーキング・創作',coworkText:'仕事、打ち合わせ、制作のために家全体を一日利用。料金は予約単位・グループ単位です。',yoga:'ヨガ・リトリート',yogaText:'少人数の練習、リトリート、講師ご自身のクラスに家全体を一日利用。講師の手配は含みません。',day:'一日貸切',price:'¥25,000〜',note:'目安料金・通常清掃込み。週末、繁忙期、大人数、特別な準備は個別にお見積りします。',stay:'宿泊',stayText:'宿泊の開始日、定員、宿泊料金は確定後にお知らせします。'}
    : {heading:'Private use for a full day.',intro:'Every booking requires preparation and a cleaning visit. We therefore offer the whole house for a full day, rather than hourly or per-person passes.',cowork:'Private coworking',coworkText:'The whole house for focused work, meetings or making during a full day. The rate is per booking and group.',yoga:'Yoga and retreats',yogaText:'The whole house for practice, a small retreat or a teacher-led class. The yoga teacher is not included.',day:'Full-day private use',price:'From ¥25,000',note:'Indicative rate per private booking; standard post-use cleaning included. Weekends, peak season, larger groups or special setup are quoted separately.',stay:'Overnight stays',stayText:'Accommodation opening, capacity and overnight rates will be announced once confirmed.'};
  rateHeading.textContent=copy.heading;
  rateIntro.textContent=copy.intro;
  ratesGrid.innerHTML=[
    [copy.cowork,copy.coworkText],
    [copy.yoga,copy.yogaText],
    [copy.stay,copy.stayText]
  ].map((x,i)=>'<article class="rate-card"><span class="rate-glyph" aria-hidden="true">'+(i===0?'⌁':i===1?'✺':'⌂')+'</span><h3>'+x[0]+'</h3><p>'+x[1]+'</p>'+(i<2?'<div class="rate-lines"><div><span>'+copy.day+'</span><strong>'+copy.price+'</strong></div></div>':'<div class="rate-pending">—</div>')+'</article>').join('');
  const note=document.querySelector('.rate-footer p');
  if(note)note.textContent=copy.note;
}

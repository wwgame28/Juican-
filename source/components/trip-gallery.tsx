'use client';
import {useCallback,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Expand} from 'lucide-react';
import {Reveal,Words} from '@/components/motion';
import {CardDeck,type CardDeckHandle} from '@/components/ui/card-deck';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';

// Подписи описывают только то, что видно на фотографиях.
const photos=[
 {src:'./trip-group.jpeg',title:'Вся группа в сборе',text:'Ужин в Хэйхэ. Баннер, как обычно, с нами.',alt:'Участники поездки «Жуйкан» вместе в ресторане с баннером «Тур улыбки в Хэйхэ»'},
 {src:'./trip-temple.jpeg',title:'Выбрались к храму',text:'Между приёмами есть время посмотреть город.',alt:'Группа с баннером у традиционного китайского храма с красными стенами'},
 {src:'./trip-dinner.webp',title:'Круглый стол',text:'Центр стола крутится, так что до любого блюда можно дотянуться.',alt:'Участники поездки за большим круглым столом с китайскими блюдами'},
 {src:'./trip-friends.webp',title:'Ещё один вечер',text:'Китайская кухня, разговоры и фото на память.',alt:'Группа участников поездки за столом в ресторане, сзади растянут баннер «Жуйкан»'},
];

export function TripGallery(){
 const [top,setTop]=useState(0),[open,setOpen]=useState(false);
 const deck=useRef<CardDeckHandle|null>(null);
 const opener=useRef<HTMLButtonElement|null>(null);
 const onTopChange=useCallback((i:number)=>setTop(i),[]);
 const photo=photos[top];
 const move=(delta:number)=>setTop(i=>(i+delta+photos.length)%photos.length);

 return <section id="trips" className="on-dark overflow-hidden bg-ink py-24 text-paper md:py-32">
  <div className="wrap grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
   <div className="lg:col-span-5">
    <p className="eyebrow">Поездки</p>
    <h2 className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="Фото не со стока."/>{' '}<Words delay={.2} className="text-[#f2b8a8] italic" text="Это наши группы"/></h2>
    <Reveal delay={.1}><p className="lead mt-6 max-w-[440px] text-[#c9d3cf]">Днём приёмы, вечером общий стол. К концу поездки все уже знакомы. Баннер, как видите, ездит с нами везде.</p></Reveal>
    <Reveal delay={.2} className="mt-8 lg:mt-10">
     <p className="text-[14px] text-[#9fb0aa]">Смахните верхнее фото в сторону или листайте стрелками.</p>
    </Reveal>
   </div>
   <Reveal className="lg:col-span-7" y={50}>
    <div className="pt-12">
     <CardDeck ref={deck} slides={photos} top={top} onTopChange={onTopChange} label="Фотографии из поездок"/>
    </div>
    <div className="mx-auto mt-8 flex w-full max-w-[620px] items-center gap-4">
     <button type="button" aria-label="Предыдущее фото" onClick={()=>deck.current?.prev()} className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/25 transition-colors hover:bg-paper hover:text-ink"><ArrowLeft className="size-5"/></button>
     <div className="cd-caption min-w-0 flex-1 overflow-hidden" key={top} aria-live="polite">
      <strong className="truncate font-serif text-[22px] font-medium">{photo.title}</strong>
      <span className="mt-1 text-[14px] text-[#c9d3cf]">{photo.text}</span>
     </div>
     <span className="hidden text-[13px] tracking-[.14em] text-[#9fb0aa] tabular-nums sm:block" aria-hidden="true"><b className="font-medium text-paper">0{top+1}</b> / 0{photos.length}</span>
     <button ref={opener} type="button" aria-label={'Открыть крупно: '+photo.title} onClick={()=>setOpen(true)} className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/25 transition-colors hover:bg-paper hover:text-ink"><Expand className="size-5"/></button>
     <button type="button" aria-label="Следующее фото" onClick={()=>deck.current?.next()} className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform hover:scale-105"><ArrowRight className="size-5"/></button>
    </div>
   </Reveal>
  </div>
  <Dialog open={open} onOpenChange={setOpen}>
   <DialogContent className="max-h-[94dvh] max-w-[min(1080px,calc(100vw-24px))] gap-3 overflow-y-auto rounded-[22px] bg-paper p-4 sm:max-w-[min(1080px,calc(100vw-40px))] sm:p-6" onCloseAutoFocus={e=>{e.preventDefault();opener.current?.focus()}}>
    <DialogTitle className="pr-12 font-serif text-[22px] font-medium">{photo.title}</DialogTitle>
    <DialogDescription>Фото {top+1} из {photos.length}. {photo.text}</DialogDescription>
    <img src={photo.src} alt={photo.alt} className="max-h-[70dvh] w-full rounded-xl bg-sand object-contain"/>
    <div className="flex items-center justify-between gap-3">
     <button type="button" onClick={()=>move(-1)} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 font-medium hover:bg-sand"><ArrowLeft className="size-4"/>Назад</button>
     <span className="text-[14px] text-soft tabular-nums">{top+1} / {photos.length}</span>
     <button type="button" onClick={()=>move(1)} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-medium text-paper hover:bg-teal">Дальше<ArrowRight className="size-4"/></button>
    </div>
   </DialogContent>
  </Dialog>
 </section>;
}

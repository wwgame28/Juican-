'use client';
import {useState,useEffect,useRef} from 'react';
import {ArrowLeft,ArrowRight,Expand} from 'lucide-react';
import {motion,useReducedMotion} from 'motion/react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';

// Подписи описывают только видимое на фотографиях, без выдуманных имён и дат.
const photos=[
 {src:'./trip-group.jpeg',title:'Вместе в Хэйхэ',text:'Групповая фотография участников поездки «Жуйкан».',alt:'Участники поездки Жуйкан вместе в помещении'},
 {src:'./trip-temple.jpeg',title:'Знакомство с городом',text:'Поездка запоминается не только визитом в клинику.',alt:'Участники поездки у традиционного китайского храма'},
 {src:'./trip-dinner.webp',title:'За общим столом',text:'Новые знакомства и общение в кругу попутчиков.',alt:'Участники поездки за большим круглым столом'},
 {src:'./trip-friends.webp',title:'Тёплые моменты поездки',text:'Фотографии, которыми хочется поделиться.',alt:'Группа участников поездки за столом с баннером Жуйкан'}
];
export function TripGallery(){
 const [active,setActive]=useState(0),[open,setOpen]=useState(false);const titleRef=useRef<HTMLHeadingElement|null>(null);const opener=useRef<HTMLButtonElement|null>(null);const swiped=useRef(false);const touch=useRef<{x:number;y:number}|null>(null);const reduce=useReducedMotion();
 const move=(delta:number)=>setActive(i=>(i+delta+photos.length)%photos.length);
 useEffect(()=>{if(!open)return;const handle=(e:KeyboardEvent)=>{if(e.key==='ArrowLeft'){e.preventDefault();setActive(i=>(i+photos.length-1)%photos.length)}if(e.key==='ArrowRight'){e.preventDefault();setActive(i=>(i+1)%photos.length)}};window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle)},[open]);
 const swipe={
  onTouchStart:(e:React.TouchEvent)=>{swiped.current=false;if(e.touches.length!==1){touch.current=null;return}touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY}},
  onTouchMove:(e:React.TouchEvent)=>{if(e.touches.length!==1)touch.current=null},
  onTouchCancel:()=>{touch.current=null;swiped.current=false},
  onTouchEnd:(e:React.TouchEvent)=>{if(!touch.current||e.touches.length!==0){touch.current=null;return}const dx=e.changedTouches[0].clientX-touch.current.x,dy=e.changedTouches[0].clientY-touch.current.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5){swiped.current=true;move(dx>0?-1:1)}touch.current=null}
 };
 const photo=photos[active];
 return <section id="moments" className="wrap moments"><div className="gallery-heading"><p className="section-label">ЛЮДИ И МОМЕНТЫ</p><h2>В другой стране.<br/><span>В хорошей компании.</span></h2><p className="intro">Встречи, общение и знакомство с Хэйхэ. Настоящие фотографии наших поездок.</p></div><div className="gallery-layout"><div className="gallery-main"><motion.button type="button" key={active} initial={{opacity:reduce?1:.6}} animate={{opacity:1}} transition={{duration:.3}} ref={opener} className="gallery-image" onClick={()=>{if(swiped.current){swiped.current=false;return}setOpen(true)}} aria-label={'Увеличить фото: '+photo.title} {...swipe}><img src={photo.src} alt={photo.alt} width="1280" height="960" loading="lazy"/><span className="expand-icon"><Expand size={20}/></span></motion.button><div className="gallery-caption"><div aria-live="polite" aria-atomic="true"><h3>{photo.title}</h3><p>{photo.text}</p></div><div className="gallery-controls"><Button variant="outline" size="icon" aria-label="Предыдущее фото" onClick={()=>move(-1)}><ArrowLeft/></Button><span aria-label={'Фото '+(active+1)+' из 4'}>{String(active+1).padStart(2,'0')} / 04</span><Button variant="outline" size="icon" aria-label="Следующее фото" onClick={()=>move(1)}><ArrowRight/></Button></div></div></div><div className="gallery-thumbs" aria-label="Выбор фотографии">{photos.map((p,i)=><button type="button" key={p.src} className={i===active?'thumb active':'thumb'} onClick={()=>setActive(i)} aria-label={'Показать фото '+(i+1)+': '+p.title} aria-pressed={i===active}><img src={p.src} alt="" width="1280" height="960" loading="lazy"/><span><small>0{i+1}</small>{p.title}</span></button>)}</div></div><div className="gallery-footnote"><span>Фотографии участников поездок</span><a href="#contact">Узнать о сопровождении <ArrowRight size={17}/></a></div><Dialog open={open} onOpenChange={setOpen}><DialogContent onOpenAutoFocus={e=>{e.preventDefault();titleRef.current?.focus({preventScroll:true})}} className="gallery-dialog" onCloseAutoFocus={e=>{e.preventDefault();opener.current?.focus()}}><DialogTitle ref={titleRef} tabIndex={-1}>{photo.title}</DialogTitle><DialogDescription>Фотография {active+1} из {photos.length}. Можно листать стрелками или свайпом.</DialogDescription><div className="gallery-full" {...swipe}><img src={photo.src} alt={photo.alt}/></div><div className="gallery-controls"><Button variant="outline" aria-label="Предыдущее фото в галерее" onClick={()=>move(-1)}><ArrowLeft/> Назад</Button><span aria-live="polite">{active+1} / {photos.length}</span><Button variant="outline" aria-label="Следующее фото в галерее" onClick={()=>move(1)}>Далее <ArrowRight/></Button></div></DialogContent></Dialog></section>
}

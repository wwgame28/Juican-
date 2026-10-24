'use client';
import * as React from 'react';
import {useReducedMotion} from 'motion/react';

/*
 * Колода фотографий. Основа: Card Deck Carousel с 21st.dev (@kedhareswer).
 * Верхнюю карточку можно смахнуть в любую сторону, она улетает и ложится под низ колоды.
 * Кнопки и стрелки на клавиатуре делают то же самое, «назад» возвращает последнюю карточку наверх.
 * Убраны нарисованные пейзажи и автопрокрутка, текущая карточка управляется снаружи.
 */

export type DeckSlide={src:string;alt:string};
type Override={i:number;x:number;y:number;r:number;mode:'drag'|'fly'|'snap'};

const wrap=(i:number,n:number)=>n?((i%n)+n)%n:0;

// Поза карточки в глубине колоды. Видно только четыре верхние.
function deckPose(depth:number,tilt:number,reduce:boolean){
 const d=Math.min(depth,3);
 return {y:d?-d*16:0,scale:1-d*.055,rot:depth===0||reduce?0:tilt,opacity:depth>3?0:1,shade:1-d*.08};
}
// Стабильный небольшой наклон для каждой карточки.
function tiltFor(i:number,max:number){const u=(((i+1)*2654435761)>>>0)/4294967296;return (u*2-1)*max}
// Отпустили карточку достаточно далеко или достаточно резко.
function isThrow(dx:number,vx:number,w:number){return Math.abs(dx)>w*.28||(Math.abs(vx)>.55&&Math.abs(dx)>24)}

export type CardDeckHandle={next:()=>void;prev:()=>void};

export const CardDeck=React.forwardRef<CardDeckHandle,{slides:DeckSlide[];top:number;onTopChange:(i:number)=>void;scatter?:number;label:string}>(function CardDeck({slides,top,onTopChange,scatter=7,label},handle){
 const n=slides.length;
 const reduce=!!useReducedMotion();
 const [over,setOver]=React.useState<Override|null>(null);
 const deckRef=React.useRef<HTMLDivElement|null>(null);
 const busy=React.useRef(false);
 const topRef=React.useRef(top);
 topRef.current=top;
 const later=(fn:()=>void,ms:number)=>window.setTimeout(fn,ms);

 // Верхняя карточка улетает в сторону dirX и уходит под низ колоды.
 const throwTop=React.useCallback((dirX:number,fromX=0,fromY=0,dirY=0)=>{
  const w=deckRef.current?.offsetWidth||400;
  if(busy.current||n<2)return;
  busy.current=true;
  const i=topRef.current,sx=dirX>=0?1:-1;
  setOver({i,x:fromX+sx*w*1.25,y:fromY+dirY*.4-40,r:sx*16,mode:'fly'});
  later(()=>{setOver(null);onTopChange(wrap(i+1,n));busy.current=false},reduce?200:430);
 },[n,reduce,onTopChange]);

 // Последняя карточка возвращается наверх слева.
 const pullBack=React.useCallback(()=>{
  const w=deckRef.current?.offsetWidth||400;
  if(busy.current||n<2)return;
  busy.current=true;
  const i=wrap(topRef.current-1,n);
  setOver({i,x:-w*1.25,y:-40,r:-16,mode:'snap'});
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   setOver({i,x:0,y:0,r:0,mode:'fly'});
   later(()=>{setOver(null);onTopChange(i);busy.current=false},reduce?200:450);
  }));
 },[n,reduce,onTopChange]);

 React.useImperativeHandle(handle,()=>({next:()=>throwTop(1),prev:pullBack}),[throwTop,pullBack]);

 const drag=React.useRef<null|{x:number;y:number;lx:number;lt:number;vx:number}>(null);
 const onDown=(e:React.PointerEvent)=>{
  if(busy.current||(e.pointerType==='mouse'&&e.button!==0))return;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  drag.current={x:e.clientX,y:e.clientY,lx:e.clientX,lt:e.timeStamp,vx:0};
 };
 const onMove=(e:React.PointerEvent)=>{
  const d=drag.current;if(!d)return;
  const dt=Math.max(1,e.timeStamp-d.lt);
  d.vx=.8*((e.clientX-d.lx)/dt)+.2*d.vx;d.lx=e.clientX;d.lt=e.timeStamp;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;
  setOver({i:topRef.current,x:dx,y:dy,r:reduce?0:dx*.05,mode:'drag'});
 };
 const onUp=(e:React.PointerEvent)=>{
  const d=drag.current;drag.current=null;if(!d)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y,w=deckRef.current?.offsetWidth||400;
  if(isThrow(dx,d.vx,w))throwTop(dx,dx,dy,dy);else setOver(null);
 };
 const onKey=(e:React.KeyboardEvent)=>{
  if(e.key==='ArrowRight')throwTop(1);else if(e.key==='ArrowLeft')pullBack();else return;
  e.preventDefault();
 };

 return <div ref={deckRef} className="cd-deck" role="group" aria-roledescription="колода фотографий" aria-label={label} tabIndex={0} onKeyDown={onKey}>
  {slides.map((s,i)=>{
   const depth=wrap(i-top,n),p=deckPose(depth,tiltFor(i,scatter),reduce),o=over&&over.i===i?over:null,isTop=depth===0;
   const transform=o?`translate(${o.x}px,${o.y}px) rotate(${o.r}deg)`:`translateY(${p.y}px) scale(${p.scale}) rotate(${p.rot.toFixed(2)}deg)`;
   return <div key={s.src} className="cd-card" data-top={isTop?'1':'0'} data-drag={o?.mode==='drag'?'1':'0'} data-fly={o?.mode==='fly'?'1':'0'} data-snap={o?.mode==='snap'?'1':'0'} style={{transform,zIndex:o?n+1:n-depth,opacity:o?1:p.opacity,filter:o||isTop?'none':`brightness(${p.shade})`}} aria-hidden={isTop?undefined:true} onPointerDown={isTop?onDown:undefined} onPointerMove={isTop?onMove:undefined} onPointerUp={isTop?onUp:undefined} onPointerCancel={isTop?onUp:undefined}>
    <img src={s.src} alt={isTop?s.alt:''} draggable={false} width="1280" height="960" loading={i===0?'eager':'lazy'}/>
   </div>;
  })}
 </div>;
});

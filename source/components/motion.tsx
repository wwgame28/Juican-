'use client';
import {useEffect,useRef,type ReactNode,type PointerEvent} from 'react';
import {motion,useInView,useReducedMotion,useSpring,animate,type Variants} from 'motion/react';
import {cn} from '@/lib/utils';

// Одна кривая на весь сайт: быстрый старт и долгое мягкое торможение.
export const ease=[0.22,1,0.36,1] as const;

// Блок мягко поднимается, когда доходит до экрана.
export function Reveal({children,className,delay=0,y=28}:{children:ReactNode;className?:string;delay?:number;y?:number}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={{opacity:0,y:reduce?0:y}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.8,ease,delay}}>{children}</motion.div>;
}

// Дети появляются по очереди. Внутри используйте Item.
export function Stagger({children,className,stagger=.08,delay=0}:{children:ReactNode;className?:string;stagger?:number;delay?:number}){
 return <motion.div className={className} initial="hidden" whileInView="show" viewport={{once:true,amount:.15}} transition={{staggerChildren:stagger,delayChildren:delay}}>{children}</motion.div>;
}
export function Item({children,className}:{children:ReactNode;className?:string}){
 const reduce=useReducedMotion();
 const variants:Variants={hidden:{opacity:0,y:reduce?0:32},show:{opacity:1,y:0,transition:{duration:.8,ease}}};
 return <motion.div className={className} variants={variants}>{children}</motion.div>;
}

// Заголовок выезжает по словам из-под невидимой линии.
export function Words({text,className,delay=0,onLoad=false}:{text:string;className?:string;delay?:number;onLoad?:boolean}){
 const reduce=useReducedMotion();
 const variants:Variants={hidden:{y:reduce?0:'108%',opacity:reduce?0:1},show:{y:0,opacity:1,transition:{duration:.95,ease}}};
 const trigger=onLoad?{animate:'show'}:{whileInView:'show',viewport:{once:true,amount:.5}};
 const words=text.split(' ');
 return <motion.span className={className} initial="hidden" {...trigger} transition={{staggerChildren:.07,delayChildren:delay}}>
  {words.map((word,i)=><span key={i}><span className="inline-block overflow-hidden pb-[.14em] -mb-[.14em] align-bottom"><motion.span className="inline-block" variants={variants}>{word}</motion.span></span>{i<words.length-1?' ':''}</span>)}
 </motion.span>;
}

// Число «доезжает» до нужного значения, когда его видно.
export function Counter({to,from=0,year=false,className}:{to:number;from?:number;year?:boolean;className?:string}){
 const ref=useRef<HTMLSpanElement|null>(null);
 const inView=useInView(ref,{once:true,amount:.8});
 const reduce=useReducedMotion();
 const format=(n:number)=>year?String(Math.round(n)):Math.round(n).toLocaleString('ru-RU');
 useEffect(()=>{
  const el=ref.current;if(!el||!inView)return;
  if(reduce){el.textContent=format(to);return}
  const controls=animate(from,to,{duration:1.6,ease,onUpdate:v=>{el.textContent=format(v)}});
  return()=>controls.stop();
 },[inView]);
 return <span ref={ref} className={className}>{format(reduce?to:from)}</span>;
}

// Кнопка слегка тянется за курсором. На телефонах ничего не делает.
export function Magnetic({children,className,strength=.3}:{children:ReactNode;className?:string;strength?:number}){
 const reduce=useReducedMotion();
 const x=useSpring(0,{stiffness:180,damping:14,mass:.3}),y=useSpring(0,{stiffness:180,damping:14,mass:.3});
 function move(e:PointerEvent<HTMLDivElement>){
  if(reduce||e.pointerType!=='mouse')return;
  const r=e.currentTarget.getBoundingClientRect();
  x.set((e.clientX-r.left-r.width/2)*strength);y.set((e.clientY-r.top-r.height/2)*strength);
 }
 return <motion.div className={cn('inline-block',className)} style={{x,y}} onPointerMove={move} onPointerLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.div>;
}

export function Marquee({items,className}:{items:string[];className?:string}){
 return <div className={cn('marquee',className)}><div className="marquee-track">{[0,1].map(copy=><ul key={copy} aria-hidden={copy===1||undefined} className="flex shrink-0 items-center">{items.map(item=><li key={item} className="flex items-center gap-6 px-6 whitespace-nowrap"><span className="size-2 rotate-45 bg-red" aria-hidden="true"/>{item}</li>)}</ul>)}</div></div>;
}

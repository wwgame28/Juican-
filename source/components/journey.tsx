'use client';
import {useRef,useState} from 'react';
import {motion,useMotionValueEvent,useReducedMotion,useScroll,useSpring} from 'motion/react';
import {Words,ease} from '@/components/motion';
import {cn} from '@/lib/utils';

// Основа: компонент Scroll animated timeline с 21st.dev. Линия теперь рисуется через motion, без setState на каждый кадр.
const steps=[
 ['Звоните нам','Расскажите, что беспокоит и когда хотите приехать. Если есть свежие снимки, возьмите их с собой.'],
 ['Выбираем дорогу','Подскажем, как удобнее добраться в ваши даты, и поможем с гостиницей.'],
 ['Переходите границу','Нужен загранпаспорт. Правила въезда иногда меняются, так что проверьте их заранее.'],
 ['Встречаем в Хэйхэ','После таможни вас встречают и везут заселяться, а потом в клинику. Где именно встречаемся, договоримся до поездки.'],
 ['Осмотр и план','Врач смотрит, если нужно, делает КТ и называет план, сроки и цену. Решение за вами.'],
 ['Лечитесь и гуляете','Между приёмами есть время на набережную, рынки и местные кафе. Олеся знает, где вкусно.'],
];

export function Journey(){
 const ref=useRef<HTMLOListElement|null>(null);
 const reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 65%','end 55%']});
 const line=useSpring(scrollYProgress,{stiffness:90,damping:24,restDelta:.001});
 const [active,setActive]=useState(-1);
 useMotionValueEvent(scrollYProgress,'change',v=>setActive(Math.min(steps.length-1,Math.floor(v*(steps.length-1)+.25))));
 const current=reduce?steps.length-1:active;

 return <section id="steps" data-nav="route" aria-labelledby="journey-title" className="wrap py-24 md:py-32">
  <div className="mx-auto max-w-[720px] text-center">
   <p className="eyebrow">По шагам</p>
   <h2 id="journey-title" className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="Что будет"/>{' '}<Words delay={.12} className="italic text-teal" text="после звонка"/></h2>
  </div>
  <ol ref={ref} className="relative mx-auto mt-16 max-w-[980px] md:mt-24">
   <span aria-hidden="true" className="absolute top-2 bottom-2 left-[15px] w-[2px] rounded bg-line md:left-1/2 md:-translate-x-1/2"/>
   <motion.span aria-hidden="true" className="absolute top-2 bottom-2 left-[15px] w-[2px] origin-top rounded bg-red md:left-1/2 md:-translate-x-1/2" style={{scaleY:reduce?1:line}}/>
   {steps.map(([title,text],i)=>{
    const on=i<=current,right=i%2===1;
    return <li key={title} className={cn('relative flex pb-14 last:pb-0 md:pb-20',right?'md:justify-end':'md:justify-start')}>
     <span aria-hidden="true" className={cn('absolute top-1 left-[15px] grid size-8 -translate-x-1/2 place-items-center rounded-full border-2 bg-paper font-serif text-[14px] transition-[border-color,background-color,color,transform] duration-500 md:left-1/2',on?'scale-110 border-red bg-red text-white':'border-line text-soft')}>{i+1}</span>
     <motion.div className={cn('w-full pl-14 md:w-1/2 md:pl-0',right?'md:pl-16':'md:pr-16 md:text-right')} initial={{opacity:0,y:reduce?0:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.6}} transition={{duration:.8,ease}}>
      <h3 className={cn('text-[clamp(24px,2.4vw,32px)] leading-tight tracking-[-.015em] transition-colors duration-500',on?'text-ink':'text-ink/45')}>{title}</h3>
      <p className={cn('mt-3 text-[17px] transition-colors duration-500 md:inline-block md:max-w-[400px]',on?'text-soft':'text-soft/60')}>{text}</p>
     </motion.div>
    </li>;
   })}
  </ol>
 </section>;
}

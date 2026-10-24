'use client';
import {useRef} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowDown,ArrowUpRight,Clock,Languages,Phone} from 'lucide-react';
import {Words,Magnetic,ease} from '@/components/motion';
import {PHONE,PHONE_LINK,TG} from '@/components/site-header';

export function Hero(){
 const ref=useRef<HTMLElement|null>(null);
 const reduce=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
 // Фото чуть отстаёт от прокрутки, получается глубина.
 const photoY=useTransform(scrollYProgress,[0,1],reduce?['0%','0%']:['0%','16%']);
 const photoScale=useTransform(scrollYProgress,[0,1],reduce?[1,1]:[1.04,1.16]);
 const fadeIn=(delay:number)=>({initial:{opacity:0,y:reduce?0:18},animate:{opacity:1,y:0},transition:{duration:.8,ease,delay}});

 return <section id="top" ref={ref} className="relative overflow-hidden pt-[112px] pb-14 md:pt-[148px] md:pb-20">
  <div aria-hidden="true" className="pointer-events-none absolute -top-40 -right-40 size-[620px] rounded-full bg-mint/70 blur-3xl"/>
  <div className="wrap relative">
   <motion.p className="eyebrow" {...fadeIn(.1)}>Хэйхэ, Китай · через Амур от Благовещенска</motion.p>
   <h1 className="mt-6 max-w-[1180px] text-[clamp(40px,6.4vw,94px)] leading-[1.02] tracking-[-.03em]">
    <Words onLoad delay={.15} text="Лечить зубы в Китае не страшно,"/>{' '}
    <Words onLoad delay={.55} className="font-normal text-teal italic" text="когда рядом свои"/>
   </h1>
   <div className="mt-10 grid grid-cols-1 items-end gap-10 lg:mt-14 lg:grid-cols-12">
    <div className="lg:col-span-5 lg:pb-2 xl:col-span-4">
     <motion.p className="lead" {...fadeIn(.7)}>«Жуйкан» — клиника в Хэйхэ, через реку от Благовещенска. Мы встречаем после таможни, помогаем с гостиницей и переводом, возим на приёмы. А между ними показываем город.</motion.p>
     <motion.div className="mt-8 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center" {...fadeIn(.85)}>
      <Magnetic className="w-full sm:w-auto"><a href={PHONE_LINK} className="group flex w-full items-center justify-center gap-3 sm:inline-flex sm:w-auto rounded-full bg-ink py-4 pr-6 pl-5 text-[17px] font-medium text-paper transition-colors hover:bg-teal"><Phone className="size-[18px] transition-transform group-hover:rotate-12"/>Позвонить</a></Magnetic>
      <a href={TG} target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 py-4 pr-5 pl-6 text-[17px] font-medium transition-colors hover:border-ink hover:bg-ink/5">Telegram-канал<ArrowUpRight className="size-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a>
     </motion.div>
     <motion.p className="mt-5 text-[15px] text-soft" {...fadeIn(1)}>{PHONE}. Звоните, даже если пока просто прицениваетесь.</motion.p>
    </div>
    <motion.figure className="relative overflow-hidden rounded-[28px] bg-sand lg:col-span-7 xl:col-span-8" initial={{clipPath:reduce?'inset(0% 0% 0% 0% round 28px)':'inset(14% 8% 0% 8% round 28px)',opacity:reduce?0:1}} animate={{clipPath:'inset(0% 0% 0% 0% round 28px)',opacity:1}} transition={{duration:1.4,ease,delay:.35}}>
     <div className="aspect-[4/3] sm:aspect-[16/9]">
      <motion.img src="./clinic.jpg" alt="Фасад медицинского центра «Жуйкан» в Хэйхэ с вывеской на русском языке" width="1280" height="706" fetchPriority="high" className="size-full object-cover object-[80%_40%] sm:object-[50%_40%]" style={{y:photoY,scale:photoScale}}/>
     </div>
     <motion.div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-paper/95 py-3 pr-5 pl-3 shadow-[0_18px_40px_-20px_#14302b] backdrop-blur sm:bottom-6 sm:left-6" initial={{opacity:0,y:reduce?0:20,scale:reduce?1:.9}} animate={{opacity:1,y:0,scale:1}} transition={{type:'spring',bounce:.35,duration:.9,delay:1.25}}>
      <span className="grid size-10 place-items-center rounded-xl bg-teal text-paper"><Languages className="size-5"/></span>
      <span className="text-[14px] leading-snug"><strong className="block font-semibold">Говорим по-русски</strong><span className="text-soft">в клинике и по городу</span></span>
     </motion.div>
     <motion.div className="absolute top-4 right-4 hidden items-center gap-2 rounded-full bg-ink/85 px-4 py-2 text-[13px] text-paper backdrop-blur sm:flex" initial={{opacity:0,y:reduce?0:-12}} animate={{opacity:1,y:0}} transition={{duration:.7,ease,delay:1.45}}>
      <Clock className="size-4"/>Каждый день, 8:00–22:00
     </motion.div>
    </motion.figure>
   </div>
   <motion.div className="mt-5 flex justify-between gap-4 text-[14px] text-soft lg:ml-[calc(41.667%+17px)] xl:ml-[calc(33.333%+13px)]" {...fadeIn(1.3)}>
    <span>Хэйхэ, ул. Ван Су, 112</span>
    <a href="#route" className="group inline-flex items-center gap-2 text-ink">Как добраться<ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5"/></a>
   </motion.div>
  </div>
 </section>;
}

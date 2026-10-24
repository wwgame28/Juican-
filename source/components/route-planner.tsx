'use client';
import {useState} from 'react';
import {Tabs} from 'radix-ui';
import {motion,useReducedMotion} from 'motion/react';
import {Bus,Ship,ArrowUpRight,MapPin} from 'lucide-react';
import {Reveal,Words,ease} from '@/components/motion';

const news='https://ampravda.ru/2026/05/15/pokupka-biletov-na-teploxody-iz-blagoveshhenska-v-xeixe-stala-dostupna-onlain';

const routes=[
 {id:'bus',tab:'Автобус по мосту',short:'Автобус',icon:Bus,title:'Автобусом по мосту',season:'Круглый год',description:'Международный автобус идёт из Благовещенска через мост и пункт пропуска Кани-Курган прямо в Хэйхэ.',steps:['Купите билет на рейс.','Уточните у перевозчика, где и во сколько посадка.','Пройдите границу.','В Хэйхэ вас встретят, как договорились.'],link:'https://amurasso-bus.ru/',label:'Расписание автобусов',middle:'Кани-Курган',note:'Сколько ехать, зависит от рейса и очереди на границе.'},
 {id:'ship',tab:'Теплоход по Амуру',short:'Теплоход',icon:Ship,title:'Теплоходом через Амур',season:'Пока идёт навигация',description:'Летом реку можно просто переплыть. Рейсы зависят от погоды и уровня воды, поэтому расписание лучше смотреть ближе к дате.',steps:['Проверьте, открыта ли навигация.','Кассы: Благовещенск, ул. Чайковского, 1.','Пройдите границу.','После таможни вас встречают.'],link:'https://amurasso-port.ru/',label:'Сайт пассажирского порта',middle:'Речной порт',note:'В сильный ветер и в ледоход рейсы могут отменить.'},
];

export function RouteSection(){
 const [tab,setTab]=useState('bus');
 const reduce=useReducedMotion();
 return <section id="route" className="wrap pt-24 md:pt-32">
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
   <div className="lg:col-span-7">
    <p className="eyebrow">Дорога</p>
    <h2 className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="Хэйхэ видно прямо"/>{' '}<Words delay={.2} className="italic text-teal" text="с набережной Благовещенска"/></h2>
   </div>
   <Reveal className="lg:col-span-4 lg:col-start-9 lg:pt-14" delay={.1}><p className="lead">Между городами меньше километра по реке. Круглый год ходит автобус по мосту, летом ещё и теплоход. Как удобнее в ваши даты, подскажем по телефону.</p></Reveal>
  </div>
  <Reveal className="mt-12 md:mt-16">
   <Tabs.Root value={tab} onValueChange={setTab}>
    <Tabs.List aria-label="Как добраться до Хэйхэ" className="inline-flex w-full rounded-full border border-line bg-sand/70 p-1.5 sm:w-auto">
     {routes.map(r=><Tabs.Trigger key={r.id} value={r.id} aria-label={r.tab} className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-medium text-soft transition-colors data-[state=active]:text-paper sm:flex-none sm:px-6">
      {tab===r.id&&<motion.span layoutId="route-pill" className="absolute inset-0 rounded-full bg-ink" transition={{type:'spring',bounce:.2,duration:.55}}/>}
      <r.icon className="relative size-[18px]"/><span className="relative sm:hidden">{r.short}</span><span className="relative hidden sm:inline">{r.tab}</span>
     </Tabs.Trigger>)}
    </Tabs.List>
    {routes.map(r=><Tabs.Content key={r.id} value={r.id} className="mt-4 outline-none">
     <motion.div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-line bg-white/60 lg:grid-cols-[1.25fr_1fr]" initial={{opacity:0,y:reduce?0:14}} animate={{opacity:1,y:0}} transition={{duration:.6,ease}}>
      <div className="p-7 md:p-10">
       <span className="inline-block rounded-full bg-mint px-3 py-1 text-[13px] font-medium text-teal-deep">{r.season}</span>
       <h3 className="mt-5 text-[clamp(26px,2.6vw,34px)] leading-tight tracking-[-.015em]">{r.title}</h3>
       <p className="mt-3 max-w-[520px] text-soft">{r.description}</p>
       <ol className="mt-7 space-y-3">{r.steps.map((s,i)=><motion.li key={s} className="flex items-baseline gap-4" initial={{opacity:0,x:reduce?0:-10}} animate={{opacity:1,x:0}} transition={{duration:.5,ease,delay:.15+i*.07}}><span className="grid size-7 shrink-0 translate-y-1.5 place-items-center rounded-full border border-ink/20 text-[13px]">{i+1}</span><span>{s}</span></motion.li>)}</ol>
       <a href={r.link} target="_blank" rel="noreferrer" className="group mt-8 inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-medium transition-colors hover:border-ink">{r.label}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a>
      </div>
      <div className="flex flex-col justify-center bg-mint/50 p-7 md:p-10" aria-label="Маршрут по точкам">
       {[['Благовещенск','Россия'],[r.middle,'Граница'],['Хэйхэ · Жуйкан','Встреча и трансфер, как договоримся']].map(([place,sub],i)=><motion.div key={place} className={i<2?"relative pb-8 pl-11":"relative pl-11"} initial={{opacity:0,y:reduce?0:10}} animate={{opacity:1,y:0}} transition={{duration:.5,ease,delay:.25+i*.15}}>
        {i<2&&<motion.span className="absolute top-6 bottom-0 left-[13px] w-px origin-top bg-teal/40" initial={{scaleY:0}} animate={{scaleY:1}} transition={{duration:.5,ease,delay:.4+i*.15}}/>}
        {i<2?<span className="absolute top-1.5 left-2 size-3.5 rounded-full border-2 border-teal bg-paper"/>:<MapPin className="absolute top-0.5 left-0.5 size-6 text-red"/>}
        <p className="font-serif text-[22px] leading-tight">{place}</p>
        <p className="mt-1 text-[14px] text-soft">{sub}</p>
       </motion.div>)}
       <p className="mt-8 border-t border-teal/20 pt-5 text-[14px] text-soft">{r.note}</p>
      </div>
     </motion.div>
    </Tabs.Content>)}
   </Tabs.Root>
   <p className="mt-6 max-w-[820px] text-[14px] text-soft">Перед покупкой билетов проверьте правила въезда, расписание и цены: они меняются. Зимой переправа по реке работает по-другому. <a href={news} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">Источник: «Амурская правда», 15.05.2026<ArrowUpRight className="size-3.5"/></a></p>
  </Reveal>
 </section>;
}

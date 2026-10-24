'use client';
import {useState} from 'react';
import {Tabs} from 'radix-ui';
import {motion,useReducedMotion} from 'motion/react';
import {Reveal,Words,ease} from '@/components/motion';
import {cn} from '@/lib/utils';

// Тексты отзывов приведены так, как их прислали в сообщество.
const reviews=[
 {name:'Татьяна',date:'23 июля',topic:'Лечение и сопровождение',text:'Огромная благодарность Олесе и Александру за потрясающую организацию поездки на лечение в Китай! Ребята встретили, заселили в гостиницу, возили в клинику и обратно, а также чудесно поводили по экскурсиям. Само лечение прошло выше всяких похвал: сделали КТ, врачи работают в идеальной чистоте с одноразовыми расходниками. Несмотря на языковой барьер (спасибо отличному переводчику), мы прекрасно понимали друг друга. Весь сложный объем работ занял ровно пять дней без потери качества. Зубы сделаны превосходно!'},
 {name:'Александра',date:'27 июня',topic:'Поездка в Хэйхэ',text:'Доброе утро. Хотим выразить благодарность Олесе и Александру за организацию, сопровождение и всевозможную помощь при вставлении зубов, нахождении в Хэй-Хэ. Все прошло прекрасно, муж доволен!'},
 {name:'Ксения',date:'из чата в MAX',topic:'Знакомство с городом',text:'Поездка в приграничный китайский город Хэйхэ стала для нас незабываемой благодаря гиду Олесе. В отличие от стандартных экскурсоводов, она показала не туристический фасад, а настоящую жизнь города: мы ели различные блюда в местных кафешках и гуляли по набережной Амура с китайской стороны. Олеся не просто переводчик, а настоящий помощник. Она знает лучшие места для шопинга, решает любые бытовые вопросы.'},
 {name:'Без подписи',date:'имя на скриншоте не видно',topic:'Впечатления о поездке',text:'Сделали протезирование. Между приёмами у врача успела: иглоукалывание, массаж, чистка лица. Это была не просто стоматологическая поездка, а настоящий мини-спа-тур.'},
];

export function Reviews(){
 const [tab,setTab]=useState('0');
 const reduce=useReducedMotion();
 return <section id="reviews" className="wrap py-24 md:py-32">
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
   <div className="lg:col-span-6">
    <p className="eyebrow">Отзывы</p>
    <h2 className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="Что пишут"/>{' '}<Words delay={.12} className="italic text-teal" text="после поездки"/></h2>
   </div>
   <Reveal className="lg:col-span-5 lg:col-start-8 lg:pt-14" delay={.1}><p className="lead">Взяли из нашего сообщества в MAX. Это личный опыт: у каждого своё лечение и свои сроки.</p></Reveal>
  </div>
  <Reveal className="mt-12 md:mt-16">
   <Tabs.Root value={tab} onValueChange={setTab} className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-8">
    <Tabs.List aria-label="Чей отзыв показать" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
     {reviews.map((r,i)=><Tabs.Trigger key={r.name} value={String(i)} className="group relative flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-sand/70 data-[state=active]:hover:bg-transparent lg:px-5 lg:py-4">
      {tab===String(i)&&<motion.span layoutId="review-pill" className="absolute inset-0 rounded-2xl border border-line bg-white shadow-[0_16px_40px_-28px_#14302b]" transition={{type:'spring',bounce:.2,duration:.55}}/>}
      <span className={cn('relative grid size-10 shrink-0 place-items-center rounded-full font-serif text-[17px] transition-colors',tab===String(i)?'bg-red text-white':'bg-sand text-ink')}>{i===3?'?':r.name[0]}</span>
      <span className="relative"><span className="block font-medium whitespace-nowrap">{r.name}</span><span className="block text-[13px] whitespace-nowrap text-soft">{r.topic}</span></span>
     </Tabs.Trigger>)}
    </Tabs.List>
    {reviews.map((r,i)=><Tabs.Content key={r.name} value={String(i)} className="outline-none">
     <motion.figure className="relative h-full overflow-hidden rounded-[28px] bg-sand p-7 pt-16 md:p-12" initial={{opacity:0,y:reduce?0:16}} animate={{opacity:1,y:0}} transition={{duration:.6,ease}}>
      <span aria-hidden="true" className="absolute -top-3 right-5 font-serif text-[130px] leading-none text-red/15 md:-top-6 md:right-10 md:text-[200px]">“</span>
      <blockquote className="relative font-serif text-[clamp(19px,1.7vw,24px)] leading-[1.55] tracking-[-.005em]">{r.text}</blockquote>
      <figcaption className="relative mt-8 flex items-center gap-3 border-t border-ink/10 pt-6 text-[15px]"><span className="font-medium">{r.name}</span><span className="text-soft">· {r.date}</span></figcaption>
     </motion.figure>
    </Tabs.Content>)}
   </Tabs.Root>
  </Reveal>
 </section>;
}

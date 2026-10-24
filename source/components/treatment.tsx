'use client';
import {Accordion} from 'radix-ui';
import {ArrowUpRight,Plus,Sparkles} from 'lucide-react';
import {Reveal,Words} from '@/components/motion';

const services=[
 ['Протезирование','Коронки из диоксида циркония и металлокерамики, мосты, съёмные протезы. Коронки делают в лаборатории при клинике, так что долго ждать не приходится.'],
 ['Импланты и хирургия','Импланты Osstem, Dentium, ICX и Straumann. Удаление зубов, в том числе зубов мудрости. Какой имплант подойдёт именно вам, решает хирург после КТ.'],
 ['Лечение зубов','Кариес, пульпит, каналы, в том числе сложные. После лечения зубу возвращают нормальную форму.'],
 ['Красивая улыбка','Виниры из керамики и композита, профессиональная чистка, отбеливание, брекеты.'],
];

export function Treatment(){
 return <section id="treatment" className="bg-sand py-24 md:py-32">
  <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
   <div className="lg:col-span-5">
    <div className="lg:sticky lg:top-28">
     <p className="eyebrow">Лечение</p>
     <h2 className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="С чем к нам"/>{' '}<Words delay={.15} className="italic text-teal" text="едут"/></h2>
     <Reveal delay={.1}><p className="lead mt-6 max-w-[440px]">В основном за зубами. Точный план, сроки и цену врач называет после осмотра. По телефону мы можем только примерно сориентировать.</p></Reveal>
     <Reveal delay={.2} className="mt-10 rounded-[24px] bg-ink p-7 text-paper md:p-8">
      <Sparkles className="size-7 text-[#f2b8a8]" strokeWidth={1.5}/>
      <h3 className="mt-5 text-[24px] leading-tight">Не только зубы</h3>
      <p className="mt-3 text-[#c9d3cf]">В клинике есть УЗИ и анализы, косметология, физиотерапия, приём терапевта. Кто-то между приёмами у стоматолога успевает на массаж или чистку лица. Одна пациентка потом назвала свою поездку мини-спа-туром.</p>
     </Reveal>
    </div>
   </div>
   <Accordion.Root type="single" collapsible defaultValue="0" className="self-start border-b border-ink/15 lg:col-span-7 lg:col-start-6 lg:ml-8">
    {services.map(([title,text],i)=><Reveal key={title} delay={i*.06}>
     <Accordion.Item value={String(i)} className="border-t border-ink/15">
      <Accordion.Header>
       <Accordion.Trigger className="group/trigger relative flex w-full items-center gap-4 py-7 text-left md:gap-8 md:py-9">
        <span className="w-8 shrink-0 font-serif text-[18px] text-red-ink italic">0{i+1}</span>
        <span className="min-w-0 flex-1 font-serif text-[clamp(24px,3vw,40px)] leading-[1.1] tracking-[-.02em] transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover/trigger:translate-x-2">{title}</span>
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-out-quint)] group-hover/trigger:border-ink group-data-[state=open]/trigger:rotate-45 group-data-[state=open]/trigger:border-ink group-data-[state=open]/trigger:bg-ink group-data-[state=open]/trigger:text-paper"><Plus className="size-5"/></span>
       </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="accordion-content overflow-hidden">
       <div className="pb-9 pl-12 md:pl-16">
        <p className="max-w-[560px] text-[18px] leading-relaxed text-soft">{text}</p>
        <a href="#contact" className="group/link mt-5 inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-medium transition-colors hover:border-ink">Спросить про это<ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"/></a>
       </div>
      </Accordion.Content>
     </Accordion.Item>
    </Reveal>)}
   </Accordion.Root>
  </div>
 </section>;
}

'use client';
import {FlaskConical,ScanLine,MessagesSquare} from 'lucide-react';
import {Counter,Item,Marquee,Reveal,Stagger,Words} from '@/components/motion';

// Факты взяты с прежнего сайта клиники: https://qpwoeiruty17.github.io/med_centre/
const facts=['Работает с 2012 года','Новое здание на 3 000 м²','Своя зуботехническая лаборатория','КТ и 3D-сканирование','Импланты Osstem, Dentium, ICX, Straumann','Можно платить в рублях','Каждый день с 8:00 до 22:00'];

const card='rounded-[24px] border border-line bg-white/55 p-7 transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_50px_-30px_#14302b66] md:p-8';

export function Clinic(){
 return <>
  <div className="border-y border-line bg-sand/60 py-5 text-[15px] font-medium text-ink/80"><Marquee items={facts}/></div>
  <section id="clinic" className="wrap py-24 md:py-32">
   <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
    <div className="lg:col-span-5">
     <p className="eyebrow">Про клинику</p>
     <h2 className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="Что это вообще"/>{' '}<Words delay={.15} className="italic text-teal" text="за клиника"/></h2>
    </div>
    <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-14" delay={.1}>
     <p className="lead text-ink">Многопрофильный медицинский центр в Хэйхэ. Главное направление — стоматология, но есть и диагностика, косметология, физиотерапия.</p>
     <p className="lead mt-5">Врачи китайские, а объясняют всё по-русски: в клинике работают русскоговорящие сотрудники и переводчик. Многие едут из-за цены, и это нормально. Но выбирать только по цене мы не советуем, поэтому вот что стоит знать.</p>
    </Reveal>
   </div>
   <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:grid-rows-2">
    <Item className={card}>
     <p className="font-serif text-[68px] leading-none tracking-[-.04em] md:text-[84px]"><Counter year from={1998} to={2012}/></p>
     <p className="mt-5 text-soft">Год открытия. В 2024-м клиника переехала в новое здание в центре города.</p>
    </Item>
    <Item className={card}>
     <p className="font-serif text-[68px] leading-none tracking-[-.04em] md:text-[84px]"><Counter to={3000}/><span className="ml-1 text-[32px] tracking-normal">м²</span></p>
     <p className="mt-5 text-soft">Стоматология, диагностика, косметология и физиотерапия под одной крышей.</p>
    </Item>
    <Item className="group relative overflow-hidden rounded-[24px] bg-teal p-7 text-paper md:col-span-2 md:p-8 lg:col-span-1 lg:row-span-2">
     <MessagesSquare className="size-9 text-mint transition-transform duration-500 group-hover:-rotate-6" strokeWidth={1.4}/>
     <p className="mt-8 font-serif text-[clamp(26px,2.6vw,34px)] leading-[1.2] tracking-[-.015em]">Переспрашивать можно сколько угодно раз.</p>
     <p className="mt-5 text-mint">В клинике есть русскоговорящие сотрудники и переводчик. Что будут делать, сколько это займёт и сколько стоит, вам объяснят до начала лечения, а не после.</p>
     <span aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-10 font-[family-name:var(--font-cjk)] text-[180px] leading-none font-bold text-white/[.06] transition-transform duration-700 group-hover:-translate-y-3">瑞康</span>
    </Item>
    <Item className={card}>
     <FlaskConical className="size-9 text-teal" strokeWidth={1.4}/>
     <h3 className="mt-6 text-[24px] leading-tight">Своя лаборатория</h3>
     <p className="mt-3 text-soft">Коронки и протезы делают на месте, в цифровой зуботехнической лаборатории при клинике.</p>
    </Item>
    <Item className={card}>
     <ScanLine className="size-9 text-teal" strokeWidth={1.4}/>
     <h3 className="mt-6 text-[24px] leading-tight">Снимки на месте</h3>
     <p className="mt-3 text-soft">КТ, 3D-сканирование, CAD/CAM. План лечения врач составляет после осмотра и снимков.</p>
    </Item>
   </Stagger>
   <p className="mt-5 text-[13px] text-soft">Год открытия, площадь и оборудование указаны по данным клиники.</p>
  </section>
 </>;
}

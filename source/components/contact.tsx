'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,Check,Copy,MapPin,Clock} from 'lucide-react';
import {Magnetic,Reveal,Words} from '@/components/motion';
import {Logo,MAX,PHONE,PHONE_LINK,TG} from '@/components/site-header';

const ADDRESS_ZH='黑河市爱辉区王肃街112号';

export function Contact(){
 const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false);
 useEffect(()=>{if(!copied)return;const timer=setTimeout(()=>setCopied(false),3500);return()=>clearTimeout(timer)},[copied]);
 async function copyAddress(){try{await navigator.clipboard.writeText(ADDRESS_ZH);setCopied(true);setCopyError(false)}catch{setCopyError(true)}}

 return <section id="contact" className="on-dark relative overflow-hidden bg-teal-deep py-24 text-paper md:py-32">
  <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 size-[560px] rounded-full bg-teal blur-3xl"/>
  <div className="wrap relative grid grid-cols-1 gap-14 lg:grid-cols-12">
   <div className="lg:col-span-7">
    <p className="eyebrow">Контакты</p>
    <h2 className="mt-5 text-[clamp(40px,5.6vw,84px)] leading-[1.02] tracking-[-.03em]"><Words text="Проще всего"/>{' '}<Words delay={.15} className="text-[#f2b8a8] italic" text="позвонить"/></h2>
    <Reveal delay={.1}><p className="lead mt-6 max-w-[520px] text-mint">Расскажите, что нужно, и мы прикинем, как всё устроить. Новости и фотографии из поездок выкладываем в Telegram и MAX.</p></Reveal>
    <Reveal delay={.2} className="mt-10">
     <Magnetic strength={.15}><a href={PHONE_LINK} className="group inline-flex items-center gap-4 font-serif text-[clamp(28px,4.6vw,64px)] leading-none tracking-[-.03em] whitespace-nowrap">{PHONE}<span className="grid size-12 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45 md:size-16"><ArrowUpRight className="size-6 md:size-7"/></span></a></Magnetic>
    </Reveal>
    <Reveal delay={.3} className="mt-10 flex flex-wrap gap-3">
     <a href={TG} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-4 font-medium text-ink transition-transform hover:-translate-y-0.5">Telegram-канал<ArrowUpRight className="size-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a>
     <a href={MAX} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-full border border-paper/30 px-6 py-4 font-medium transition-colors hover:border-paper hover:bg-paper/10">Сообщество в MAX<ArrowUpRight className="size-[18px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></a>
    </Reveal>
   </div>
   <Reveal className="lg:col-span-5" delay={.15} y={40}>
    <div className="rounded-[28px] bg-paper p-7 text-ink shadow-[0_40px_80px_-40px_#000a] md:p-9">
     <div className="flex items-center gap-3 text-[15px] text-soft"><MapPin className="size-5 text-red"/>Адрес для таксиста</div>
     <p lang="zh" className="mt-5 font-[family-name:var(--font-cjk)] text-[clamp(24px,2.4vw,30px)] leading-snug">{ADDRESS_ZH}</p>
     <button type="button" onClick={copyAddress} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-medium text-paper transition-colors hover:bg-teal">{copied?<Check className="size-4"/>:<Copy className="size-4"/>}{copied?'Скопировано':'Скопировать для водителя'}</button>
     <p role="status" className="mt-2 min-h-5 text-[13px] text-soft">{copyError?'Не получилось скопировать. Покажите водителю адрес на экране.':copied?'Китайский адрес в буфере обмена.':''}</p>
     <div className="mt-4 border-t border-line pt-5 text-soft">
      <p>Китай, провинция Хэйлунцзян, Хэйхэ, район Айхуэй, ул. Ван Су, 112</p>
      <p className="mt-4 flex items-center gap-2 text-ink"><Clock className="size-4"/>Каждый день, 08:00–22:00</p>
      <p className="mt-1 text-[14px]">Перед визитом всё равно позвоните, так надёжнее.</p>
     </div>
    </div>
   </Reveal>
  </div>
 </section>;
}

export function Footer(){
 return <footer className="bg-paper">
  <div className="wrap flex flex-wrap items-center justify-between gap-6 py-10">
   <Logo/>
   <p className="text-[14px] text-soft">© 2026 · Медицинский центр «Жуйкан», Хэйхэ</p>
   <a href="#top" className="text-[14px] text-soft transition-colors hover:text-ink">Наверх ↑</a>
  </div>
  <p className="border-t border-line px-5 py-6 text-center text-[15px] font-medium tracking-[.01em] text-soft uppercase">Имеются противопоказания. Необходима консультация специалиста.</p>
 </footer>;
}

'use client';
import {Accordion} from 'radix-ui';
import {Plus} from 'lucide-react';
import {Reveal,Words} from '@/components/motion';

const questions=[
 ['Сколько это будет стоить?','Точную цену по телефону не назовёт никто, кто не видел ваших зубов. Врач считает стоимость после осмотра и снимков. Платить можно в рублях: наличными, по СБП или картой.'],
 ['Я не говорю по-китайски. Это проблема?','Нет. В клинике есть русскоговорящие сотрудники и переводчик. Что будут делать и почему, объяснят по-русски, и переспросить можно сколько угодно раз.'],
 ['Кто встретит и где жить?','Встречают Олеся и Александр. Они помогают с гостиницей и возят в клинику и обратно. Что входит в сопровождение и что оплачивается отдельно, уточните, когда будете звонить, чтобы потом не было сюрпризов.'],
 ['На сколько дней ехать?','Зависит от лечения. Примерно сориентируем ещё до поездки, точно скажет врач после осмотра. У Татьяны из отзывов сложный объём работ занял пять дней, но это её случай, а не обещание.'],
 ['Какие документы нужны?','Загранпаспорт. Правила въезда в Китай для россиян в последние годы менялись, поэтому перед покупкой билетов проверьте актуальные условия у перевозчика или на сайте консульства.'],
 ['Можно совместить с отдыхом?','Можно, многие так и делают: набережная Амура с китайской стороны, рынки, массаж, местные кафе. Только сначала спросите врача, что можно после процедур.'],
];

export function Questions(){
 return <section id="faq" className="bg-sand py-24 md:py-32">
  <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12">
   <div className="lg:col-span-4">
    <div className="lg:sticky lg:top-28">
     <p className="eyebrow">Вопросы</p>
     <h2 className="mt-5 text-[clamp(34px,4.4vw,62px)] leading-[1.06] tracking-[-.025em]"><Words text="Что обычно"/>{' '}<Words delay={.12} className="italic text-teal" text="спрашивают"/></h2>
     <Reveal delay={.1}><p className="lead mt-6">Не нашли свой вопрос? Позвоните, так быстрее, чем гадать.</p></Reveal>
    </div>
   </div>
   <Accordion.Root type="single" collapsible className="self-start border-b border-ink/15 lg:col-span-7 lg:col-start-6">
    {questions.map(([q,a],i)=><Reveal key={q} delay={i*.05}>
     <Accordion.Item value={String(i)} className="border-t border-ink/15">
      <Accordion.Header>
       <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7">
        <span className="font-serif text-[clamp(20px,1.8vw,25px)] leading-snug tracking-[-.01em] transition-colors group-hover:text-teal">{q}</span>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/20 transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-quint)] group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-paper"><Plus className="size-[18px]"/></span>
       </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="accordion-content overflow-hidden">
       <p className="max-w-[640px] pb-7 text-[17px] leading-relaxed text-soft">{a}</p>
      </Accordion.Content>
     </Accordion.Item>
    </Reveal>)}
   </Accordion.Root>
  </div>
 </section>;
}

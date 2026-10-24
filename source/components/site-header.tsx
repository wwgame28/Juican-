'use client';
import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useMotionValueEvent,useScroll,useSpring} from 'motion/react';
import {Menu,Phone,X,ArrowUpRight} from 'lucide-react';
import {ease} from '@/components/motion';
import {cn} from '@/lib/utils';

export const PHONE='+7 924 681-06-98';
export const PHONE_LINK='tel:+79246810698';
export const TG='https://t.me/medicHeihe';
export const MAX='https://max.ru/join/GmVp_ktKIVCAlDivnqMCdfUfc-4WoAVSGc2o819oxpg';

const links=[['clinic','Клиника'],['treatment','Лечение'],['route','Дорога'],['trips','Поездки'],['reviews','Отзывы'],['faq','Вопросы']] as const;

export function Logo({className}:{className?:string}){
 return <a href="#top" className={cn('flex items-center gap-3',className)} aria-label="Жуйкан, наверх"><span className="seal" aria-hidden="true">瑞<br/>康</span><span className="font-serif text-[23px] font-semibold tracking-[-.02em]">Жуйкан</span></a>;
}

export function SiteHeader(){
 const {scrollY,scrollYProgress}=useScroll();
 const progress=useSpring(scrollYProgress,{stiffness:140,damping:30,restDelta:.001});
 const [hidden,setHidden]=useState(false),[scrolled,setScrolled]=useState(false),[menu,setMenu]=useState(false),[active,setActive]=useState('');
 const toggle=useRef<HTMLButtonElement|null>(null),firstLink=useRef<HTMLAnchorElement|null>(null);

 // Шапка уезжает, когда листают вниз, и возвращается при движении вверх.
 useMotionValueEvent(scrollY,'change',v=>{
  const prev=scrollY.getPrevious()??0;
  setScrolled(v>16);
  if(Math.abs(v-prev)>4)setHidden(v>prev&&v>480);
 });

 // Наблюдатель подсвечивает текущий раздел без обработки каждого события прокрутки. Шаги поездки относятся к «Дороге».
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)setActive((e.target as HTMLElement).dataset.nav??e.target.id)},{rootMargin:'-40% 0px -55% 0px'});
  document.querySelectorAll('main section[id]').forEach(el=>observer.observe(el));
  return()=>observer.disconnect();
 },[]);

 useEffect(()=>{
  if(!menu)return;
  document.documentElement.style.overflow='hidden';
  firstLink.current?.focus();
  const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setMenu(false);toggle.current?.focus()}};
  window.addEventListener('keydown',close);
  return()=>{document.documentElement.style.overflow='';window.removeEventListener('keydown',close)};
 },[menu]);

 function go(id:string){
  setMenu(false);
  requestAnimationFrame(()=>{const target=document.getElementById(id);target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true})});
 }

 return <>
  <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-red" style={{scaleX:progress}}/>
  <motion.header initial={{y:-90,opacity:0}} animate={{y:hidden&&!menu?-96:0,opacity:1}} transition={{duration:.5,ease}} className={cn('fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',scrolled||menu?'bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl':'bg-transparent')}>
   <div className="wrap flex h-[76px] items-center gap-6">
    <Logo/>
    <nav aria-label="Разделы сайта" className="ml-auto hidden items-center lg:flex">
     {links.map(([id,label])=><a key={id} href={'#'+id} aria-current={active===id?'location':undefined} className="relative px-3.5 py-2 text-[15px] text-soft transition-colors hover:text-ink aria-[current]:text-ink">
      {label}
      {active===id&&<motion.span layoutId="nav-dot" className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-red" transition={{type:'spring',bounce:.3,duration:.6}}/>}
     </a>)}
    </nav>
    <a href={PHONE_LINK} className="ml-auto hidden items-center gap-2.5 rounded-full bg-ink py-2.5 pr-5 pl-4 text-[15px] font-medium text-paper transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-teal sm:inline-flex lg:ml-4"><Phone className="size-4"/>{PHONE}</a>
    <button ref={toggle} type="button" className="ml-auto grid size-11 place-items-center rounded-full border border-line bg-paper sm:ml-0 lg:hidden" aria-controls="mobile-menu" aria-expanded={menu} aria-label={menu?'Закрыть меню':'Открыть меню'} onClick={()=>setMenu(!menu)}>{menu?<X className="size-5"/>:<Menu className="size-5"/>}</button>
   </div>
  </motion.header>
  <AnimatePresence>
   {menu&&<motion.div id="mobile-menu" key="menu" className="fixed inset-x-0 top-[76px] bottom-0 z-40 overflow-y-auto overscroll-contain bg-paper lg:hidden" initial={{clipPath:'inset(0 0 100% 0)'}} animate={{clipPath:'inset(0 0 0% 0)'}} exit={{clipPath:'inset(0 0 100% 0)'}} transition={{duration:.55,ease}}>
    <nav aria-label="Меню" className="wrap flex min-h-full flex-col pt-4 pb-[max(28px,env(safe-area-inset-bottom))]">
     {[...links,['contact','Контакты'] as const].map(([id,label],i)=><motion.a key={id} ref={i===0?firstLink:undefined} href={'#'+id} onClick={()=>go(id)} className="flex items-center justify-between border-b border-line py-4 font-serif text-[30px] leading-tight" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6,ease,delay:.12+i*.05}}>{label}<ArrowUpRight className="size-6 text-soft"/></motion.a>)}
     <motion.a href={PHONE_LINK} className="mt-auto flex items-center justify-center gap-3 rounded-full bg-ink py-4 text-lg font-medium text-paper" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.45}}><Phone className="size-5"/>{PHONE}</motion.a>
    </nav>
   </motion.div>}
  </AnimatePresence>
 </>;
}

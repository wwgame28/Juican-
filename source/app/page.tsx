'use client';
import {MotionConfig} from 'motion/react';
import {SiteHeader} from '@/components/site-header';
import {Hero} from '@/components/hero';
import {Clinic} from '@/components/clinic';
import {Treatment} from '@/components/treatment';
import {RouteSection} from '@/components/route-planner';
import {Journey} from '@/components/journey';
import {TripGallery} from '@/components/trip-gallery';
import {Reviews} from '@/components/reviews';
import {Questions} from '@/components/questions';
import {Contact,Footer} from '@/components/contact';

// Если в системе просят меньше движения, motion сам отключает сдвиги и масштаб.
export default function Page(){
 return <MotionConfig reducedMotion="user">
  <a className="skip" href="#main">К содержанию</a>
  <SiteHeader/>
  <main id="main">
   <Hero/>
   <Clinic/>
   <Treatment/>
   <RouteSection/>
   <Journey/>
   <TripGallery/>
   <Reviews/>
   <Questions/>
   <Contact/>
  </main>
  <Footer/>
 </MotionConfig>;
}

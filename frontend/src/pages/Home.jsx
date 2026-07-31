import HeroSection            from '../components/home/HeroSection';
import CategoriesSection      from '../components/home/CategoriesSection';
import FeaturedCoursesSection from '../components/home/FeaturedCoursesSection';
import WhyLearnodaysSection    from '../components/home/WhyLearnodaysSection';
import TestimonialsSection    from '../components/home/TestimonialsSection';
import CTASection             from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <WhyLearnodaysSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
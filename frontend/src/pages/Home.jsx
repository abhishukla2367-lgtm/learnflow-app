import HeroSection            from '../components/home/HeroSection';
import CategoriesSection      from '../components/home/CategoriesSection';
import FeaturedCoursesSection from '../components/home/FeaturedCoursesSection';
import WhyLearnflowSection    from '../components/home/WhyLearnflowSection';
import TestimonialsSection    from '../components/home/TestimonialsSection';
import CTASection             from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <WhyLearnflowSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
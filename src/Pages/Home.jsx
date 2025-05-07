import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import StatsSection from "../components/home/StatsSection";
import SuccessStories from "../components/home/SuccessStories";
import CallToAction from "../components/home/CallToAction";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <SuccessStories />
      <CallToAction />
    </div>
  );
};

export default Home;

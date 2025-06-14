import HeroSection from "./HeroSection";
import RoadMap from "./RoadMap";
import StatsCard from "./StatsCard";
import TopContributors from "./TopContributors";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <RoadMap />
      <TopContributors />
      <StatsCard />
    </div>
  );
};

export default Home;

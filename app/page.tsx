// import Image from "next/image";
// import EventCalendar from "./components/Eventcalander";
import EventReviews from "@/components/EventReviews";
import BrowseByCountry from "../components/browse-by-country";
import BrowseEventsByCity from "../components/BrowseEventsByCity";
import ExploreVenues from "../components/ExploreVenues";
import FeaturedEvents from "../components/FeaturedEvents";
import FeaturedOrganizers from "../components/FeaturedOrganizers";
import HeroHighlighter from "../components/HeroHighlighter";
import { PageBanner } from "@/components/page-banner";
import { InlineBanner } from "@/components/inline-banner";

export default function Home() {
  return (
    <div>
    <div className="bg-white min-h-screen">
       <HeroHighlighter />
        <div className="px-6 py-6 border-b border-gray-200 max-w-7xl mx-auto">
        <PageBanner page="homepage" height={150} autoplay={true} autoplayInterval={5000} showControls={true} />
      </div>
       {/* <FeaturedEvents />                                */}
       <BrowseEventsByCity />
         <div className="px-6 py-6 border-b border-gray-200 max-w-7xl mx-auto">
         <PageBanner page="events" height={150} autoplay={true} autoplayInterval={5000} showControls={true} className="my-8" />
          
      </div>
       <BrowseByCountry />
       <ExploreVenues />
       <FeaturedOrganizers />
       
       <EventReviews />
       {/* <GetAppSection /> */}
       <div className="px-6 py-6 border-b border-gray-200 max-w-6xl mx-auto">
        <InlineBanner page="speakers" maxBanners={3} dismissible={true} />
       </div>
    </div>
    </div>
  );
}

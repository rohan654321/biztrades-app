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
import FeaturedSpeakers from "@/components/FeaturedSpeaker";
import RFQComponent from "@/components/Rfq";
import CategoryGrid from "@/components/catagories";
// import TrandingEvents from "@/components/trandingEvents";

export default function Home() {
  return (
    <div>
    <div className="bg-[#f1f7fb] min-h-screen">
       <HeroHighlighter />
        <div className="px-6 py-6  max-w-7xl mx-auto">
        <PageBanner page="homepage" height={150} autoplay={true} autoplayInterval={5000} showControls={true} />
      </div>
      <CategoryGrid/>
      <EventReviews />
       {/* <FeaturedEvents />                                */}
       <BrowseEventsByCity />
         <div className="px-6 py-6  max-w-7xl mx-auto">
         <PageBanner page="events" height={150} autoplay={true} autoplayInterval={5000} showControls={true} className="my-8" />
          
      </div>
      <RFQComponent/>
       <BrowseByCountry />
       
       <ExploreVenues />
       <FeaturedOrganizers />
       
       
       {/* <GetAppSection /> */}

       <FeaturedSpeakers/>
              <div className="px-6 py-6 border-b border-gray-200 max-w-7xl mx-auto">
        <InlineBanner page="speakers" maxBanners={3} dismissible={true} />
       </div>
    </div>
    </div>
  );
}

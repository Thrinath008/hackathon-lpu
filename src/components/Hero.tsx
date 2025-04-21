
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-20 md:py-32 container">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl animate-fade-in">
          Find the perfect <span className="text-brand-purple">collaborator</span> for your next project
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl animate-fade-in [animation-delay:200ms]">
          Connect with skilled individuals based on your project needs. From study partners to hackathon teams, startup co-founders to creative collaborators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in [animation-delay:400ms]">
          <Button className="bg-brand-purple hover:bg-brand-purple/90 py-6 px-8 text-lg" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
          <Button variant="outline" className="py-6 px-8 text-lg" asChild>
            <Link to="/features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

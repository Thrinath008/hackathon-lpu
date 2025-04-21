
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-brand-lightPurple">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-3xl mx-auto">
          Ready to find your next teammate?
        </h2>
        <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
          Join thousands of users already connecting and collaborating on exciting projects.
        </p>
        <div className="mt-10">
          <Button className="bg-brand-purple hover:bg-brand-purple/90 py-6 px-8 text-lg" asChild>
            <Link to="/register">Get Started Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

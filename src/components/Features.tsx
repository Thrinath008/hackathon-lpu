
import { 
  Users, 
  Code, 
  BookOpen, 
  Search 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-2 hover:border-brand-purple/50 transition-all">
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-brand-lightPurple flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function Features() {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-brand-purple" />,
      title: "Find Study Partners",
      description: "Connect with fellow students in your field to form study groups and exchange knowledge.",
    },
    {
      icon: <Code className="h-6 w-6 text-brand-purple" />,
      title: "Hackathon Teams",
      description: "Build the perfect team with complementary skills for your next hackathon project.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-brand-purple" />,
      title: "Startup Co-founders",
      description: "Meet potential co-founders who share your vision and bring different skills to the table.",
    },
    {
      icon: <Search className="h-6 w-6 text-brand-purple" />,
      title: "AI-Powered Matching",
      description: "Our algorithm matches you with the most compatible collaborators for your specific needs.",
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our platform makes it easy to find the right people for any project or learning opportunity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

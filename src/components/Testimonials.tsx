
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

type TestimonialProps = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

function Testimonial({ quote, name, role, avatar, initials }: TestimonialProps) {
  return (
    <Card className="p-6 h-full flex flex-col">
      <CardContent className="pt-4 flex-1 flex flex-col">
        <blockquote className="text-lg text-foreground/80 mb-6 flex-1">
          "{quote}"
        </blockquote>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      quote: "I found my co-founder through FriendForge. Our complementary skills made building our startup so much easier!",
      name: "Sarah Johnson",
      role: "Tech Entrepreneur",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop",
      initials: "SJ",
    },
    {
      quote: "The skill matching algorithm is amazing. I found the perfect team for our hackathon and we ended up winning first place!",
      name: "Michael Chen",
      role: "Software Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&auto=format&fit=crop",
      initials: "MC",
    },
    {
      quote: "As a remote worker, FriendForge helped me find study partners who kept me accountable during my online courses.",
      name: "Emma Rodriguez",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop",
      initials: "ER",
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Success Stories</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Hear from users who found their perfect collaborators on our platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              avatar={testimonial.avatar}
              initials={testimonial.initials}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

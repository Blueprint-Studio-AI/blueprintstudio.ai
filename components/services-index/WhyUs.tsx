import { motion } from 'framer-motion';
import { Compass, Target, Brain, Rocket, Sparkles, Users } from 'lucide-react';
import { SectionTitle } from '../ui/section-title';

const strengths = [
  {
    title: "Service Design First",
    description: "We map your entire business ecosystem to identify and solve the root problems, not just symptoms.",
    icon: Compass,
  },
  {
    title: "AI-Native Approach",
    description: "Leveraging cutting-edge AI to amplify human creativity and deliver 10x results.",
    icon: Brain,
  },
  {
    title: "Rapid Innovation",
    description: "Fast, iterative development with continuous learning and adaptation.",
    icon: Rocket,
  },
  {
    title: "Full-Stack Team",
    description: "One team with all the skills needed to bring ambitious ideas to life.",
    icon: Users,
  }
];

export function WhyUs() {
  return (
    <section className="py-32 relative overflow-visible">
      {/* Background elements span full width */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container px-4 relative overflow-visible">
        {/* Constrain the content width */}
        <div className="max-w-5xl mx-auto">
          <SectionTitle
            title="Why Blueprint"
            description="A different kind of digital partner"
            align="center"
          />

          {/* Main content grid */}
          <div className="mt-20">
            {/* Strengths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {strengths.map((strength, index) => (
                <motion.div
                  key={strength.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >

                {/* Large background number */}
                <div className="absolute -left-8 -top-8 text-8xl font-bold text-primary/5">
                  {index + 1}
                </div>

                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 rounded-xl bg-primary/5">
                      <strength.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{strength.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {strength.description}
                  </p>
                </div>

                {/* Decorative elements */}
                {/* <div className="absolute -z-10 top-1/2 -translate-y-1/2 -left-4 w-2 h-16 bg-gradient-to-b from-primary/20 to-transparent" /> */}
                </motion.div>
              ))}
            </div>

            {/* Featured Quote */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 text-center max-w-3xl mx-auto"
            >
            <blockquote className="text-2xl font-serif text-muted-foreground">
              &quot;We make the complex feel inevitable.&quot;
            </blockquote>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

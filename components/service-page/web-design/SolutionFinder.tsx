// components/service-page/web-design/SolutionFinder.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// -------------------------
// Types
// -------------------------

// Each module represents a building block of the final solution.
type Module = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  estimatedTime: string;
  features: string[];
  techStack?: string[];
};

// The dynamic solution is built by combining modules.
type DynamicSolution = {
  name: string;
  description: string;
  price: string;
  features: string[];
  timeline: string;
  modules: Module[];
};

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    icon?: string;
  }[];
};

// -------------------------
// Animations
// -------------------------
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// -------------------------
// Questions Data
// -------------------------
const questions: Question[] = [
  {
    id: 'purpose',
    text: "What's the main purpose of your website?",
    options: [
      { id: 'business', text: 'Showcase my business & services' },
      { id: 'sell', text: 'Sell products online' },
      { id: 'leads', text: 'Generate leads & appointments' },
      { id: 'custom', text: 'Build a custom web application' },
      { id: 'portfolio', text: 'Create a portfolio/personal site' },
      { id: 'startup', text: 'Launch a startup/MVP' }
    ]
  },
  {
    id: 'industry',
    text: 'What industry are you in?',
    options: [
      { id: 'retail', text: 'Retail & E-commerce' },
      { id: 'professional', text: 'Professional Services' },
      { id: 'healthcare', text: 'Healthcare' },
      { id: 'realestate', text: 'Real Estate' },
      { id: 'tech', text: 'Technology' },
      { id: 'hospitality', text: 'Hospitality & Restaurants' },
      { id: 'construction', text: 'Construction & HVAC' },
      { id: 'other', text: 'Other' }
    ]
  },
  {
    id: 'features',
    text: 'What features do you need?',
    options: [
      { id: 'basic', text: 'Basic website (info, contact, about)' },
      { id: 'cms', text: 'Content Management System' },
      { id: 'ecommerce', text: 'Online Store' },
      { id: 'booking', text: 'Booking & Appointments' },
      { id: 'custom', text: 'Custom Functionality' },
      { id: 'unsure', text: 'Not sure yet' }
    ]
  },
  {
    id: 'timeline',
    text: 'When do you need your website?',
    options: [
      { id: 'asap', text: 'As soon as possible (1-2 weeks)' },
      { id: 'soon', text: 'Soon (2-4 weeks)' },
      { id: 'month', text: 'Within 1-2 months' },
      { id: 'flexible', text: 'Flexible / Not urgent' }
    ]
  },
  {
    id: 'budget',
    text: "What's your budget range?",
    options: [
      { id: 'starter', text: '$1,000 - $3,000' },
      { id: 'basic', text: '$3,000 - $5,000' },
      { id: 'professional', text: '$5,000 - $10,000' },
      { id: 'premium', text: '$10,000 - $20,000' },
      { id: 'enterprise', text: '$20,000+' }
    ]
  },
  {
    id: 'management',
    text: 'How would you like to manage your website?',
    options: [
      { id: 'self', text: 'I want to manage everything myself' },
      { id: 'partial', text: 'I want to manage content, you handle technical' },
      { id: 'full', text: 'I want full service management' }
    ]
  }
];

// -------------------------
// Modules Definitions
// -------------------------
const modules: Record<string, Module> = {
  design: {
    id: 'design',
    name: 'Responsive Design',
    description: 'A modern, mobile-friendly design as the backbone of your site.',
    basePrice: 1500,
    estimatedTime: '1-2 weeks',
    features: ['Mobile-responsive layout', 'UX/UI best practices']
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce Module',
    description:
      'Fully integrated online store with secure payment and order management.',
    basePrice: 2500,
    estimatedTime: '2-3 weeks',
    features: ['Product catalog', 'Shopping cart', 'Secure checkout'],
    techStack: ['Shopify', 'WooCommerce']
  },
  cms: {
    id: 'cms',
    name: 'Content Management System',
    description:
      'A flexible CMS that empowers you to easily update and manage content.',
    basePrice: 2000,
    estimatedTime: '2-3 weeks',
    features: ['Easy content editing', 'Customizable templates']
  },
  booking: {
    id: 'booking',
    name: 'Booking & Appointments',
    description:
      'An integrated booking system to manage appointments and reservations.',
    basePrice: 1800,
    estimatedTime: '1-2 weeks',
    features: ['Calendar integration', 'Automated reminders']
  },
  custom: {
    id: 'custom',
    name: 'Custom Web Application',
    description:
      'Bespoke web application development tailored to your unique requirements.',
    basePrice: 5000,
    estimatedTime: '4-6 weeks',
    features: ['Custom user flows', 'API integrations', 'Database setup']
  },
  portfolio: {
    id: 'portfolio',
    name: 'Portfolio Module',
    description:
      'A sleek, minimalist design ideal for showcasing your work and projects.',
    basePrice: 1200,
    estimatedTime: '1-2 weeks',
    features: ['Image galleries', 'Project showcases', 'Blog integration']
  }
};

// -------------------------
// Dynamic Solution Generator
// -------------------------

const timelineMapping: Record<string, string> = {
    asap: "1-2 weeks",
    soon: "2-4 weeks",
    month: "1-2 months",
    flexible: "Flexible / Not urgent"
  };
  
const generateDynamicSolution = (
    answers: Record<string, string>
  ): DynamicSolution => {
    const selectedModules: Module[] = [];
    let totalPrice = 0;
  
    // Always include the design module
    selectedModules.push(modules.design);
    totalPrice += modules.design.basePrice;
  
    // E-commerce: if the purpose is selling or the user selects e-commerce features.
    if (answers.purpose === 'sell' || answers.features === 'ecommerce') {
      selectedModules.push(modules.ecommerce);
      totalPrice += modules.ecommerce.basePrice;
    }
  
    // CMS: if the user chooses CMS as a feature.
    if (answers.features === 'cms') {
      selectedModules.push(modules.cms);
      totalPrice += modules.cms.basePrice;
    }
  
    // Booking: if the user needs appointment booking.
    if (answers.features === 'booking') {
      selectedModules.push(modules.booking);
      totalPrice += modules.booking.basePrice;
    }
  
    // Custom: if the user wants a custom web application or is launching a startup.
    if (answers.purpose === 'custom' || answers.purpose === 'startup') {
      selectedModules.push(modules.custom);
      totalPrice += modules.custom.basePrice;
    }
  
    // Portfolio: if the purpose is a portfolio/personal site.
    if (answers.purpose === 'portfolio') {
      selectedModules.push(modules.portfolio);
      totalPrice += modules.portfolio.basePrice;
    }
  
    // Use the timeline answer directly.
    const timeline = timelineMapping[answers.timeline] || "TBD";
    const solutionName = 'Custom Web Design Solution';
    const description = `Based on your responses, we've crafted a solution that includes: ${selectedModules
      .map((mod) => mod.name)
      .join(', ')}.`;
  
    return {
      name: solutionName,
      description,
      price: `Starting at $${totalPrice}`,
      features: selectedModules.flatMap((mod) => mod.features),
      timeline,
      modules: selectedModules
    };
  };
  

// -------------------------
// Components
// -------------------------

// Renders each question with its options.
function QuestionStep({
  question,
  onAnswer,
  onBack,
  showBack
}: {
  question: Question;
  onAnswer: (questionId: string, answerId: string) => void;
  onBack: () => void;
  showBack: boolean;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="mb-8">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
        )}
        <h3 className="text-xl font-semibold mb-2">{question.text}</h3>
      </div>
      <div className="grid gap-4">
        {question.options.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => onAnswer(question.id, option.id)}
            className="group relative p-4 border rounded-xl text-left hover:border-primary transition-all duration-200 hover:bg-primary/5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Renders the dynamic solution result.
function SolutionResult({
  solution,
  onRestart
}: {
  solution: DynamicSolution;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 mb-6">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Your Custom Solution</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{solution.name}</h3>
        <p className="text-muted-foreground mb-4">{solution.description}</p>
        <div className="text-xl font-semibold text-primary">{solution.price}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Estimated Timeline: {solution.timeline}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Included Features</h4>
        <div className="grid gap-3">
          {solution.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          className="flex-1"
          onClick={() => (window.location.href = 'https://cal.com/blueprint-studio/intro-call')}
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button variant="outline" className="flex-1" onClick={onRestart}>
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}

// -------------------------
// Main Component
// -------------------------
export function SolutionFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedSolution, setGeneratedSolution] = useState<DynamicSolution | null>(null);

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep((current) => current + 1);
    } else {
      // When all questions have been answered, dynamically generate the solution.
      const solution = generateDynamicSolution(newAnswers);
      setGeneratedSolution(solution);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setGeneratedSolution(null);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              Build Your Custom Web Design Solution
            </h2>
            <p className="text-muted-foreground">
              Answer a few questions and see a tailored solution built just for you.
            </p>
          </motion.div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            {!generatedSolution && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>
                    {Math.round(((currentStep + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentStep + 1) / questions.length) * 100}%`
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!generatedSolution ? (
                <QuestionStep
                  key={currentStep}
                  question={questions[currentStep]}
                  onAnswer={handleAnswer}
                  onBack={goBack}
                  showBack={currentStep > 0}
                />
              ) : (
                <SolutionResult solution={generatedSolution} onRestart={restart} />
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>
              Not sure what you need?{' '}
              <button
                onClick={() =>
                  window.open('https://cal.com/blueprint-studio/intro-call', '_blank')
                }
                className="text-primary hover:underline"
              >
                Schedule a free consultation
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

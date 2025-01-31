// components/service-page/web-design/SolutionFinder.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types
type Solution = {
  id: string;
  name: string;
  description: string;
  price: string;
  link: string;
  features: string[];
  idealFor: string[];
  timeline: string;
  techStack?: string[];
}

type Question = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    icon?: string;
  }[];
};

// Animation variants
const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  };

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Questions data
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

// Solutions catalog
const solutions: Record<string, Solution> = {
  'small-business': {
    id: 'small-business',
    name: 'Small Business Website',
    description: 'Professional, conversion-focused website perfect for local businesses',
    price: 'Starting at $2,999',
    link: '/web-design/small-business',
    features: [
      'Mobile-responsive design',
      'SEO optimization',
      'Contact forms & maps',
      'Content management system',
      'Analytics integration',
      'Social media integration'
    ],
    idealFor: ['Local businesses', 'Professional services', 'Restaurants', 'Retail'],
    timeline: '2-3 weeks',
    techStack: ['WordPress', 'Framer', 'Webflow']
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce Solution',
    description: 'Fully-featured online store with seamless shopping experience',
    price: 'Starting at $4,999',
    link: '/web-design/ecommerce',
    features: [
      'Product catalog & inventory',
      'Secure payments',
      'Order management',
      'Customer accounts',
      'Marketing tools',
      'Analytics & reporting'
    ],
    idealFor: ['Online retailers', 'D2C brands', 'Boutiques'],
    timeline: '4-6 weeks',
    techStack: ['Shopify', 'WooCommerce', 'Custom']
  },
  'startup': {
    id: 'startup',
    name: 'Startup Launch Kit',
    description: 'Modern, scalable website designed for rapid growth',
    price: 'Starting at $3,999',
    link: '/web-design/startup',
    features: [
      'Growth-focused design',
      'A/B testing ready',
      'Lead generation',
      'Marketing automation',
      'Analytics suite',
      'API integration ready'
    ],
    idealFor: ['Tech startups', 'SaaS companies', 'Digital services'],
    timeline: '3-4 weeks',
    techStack: ['Next.js', 'React', 'Tailwind']
  },
  'mvp': {
    id: 'mvp',
    name: 'Custom Web Application',
    description: 'Full-featured web application with custom functionality',
    price: 'Starting at $10,000',
    link: '/web-design/mvp',
    features: [
      'Custom user flows',
      'Database architecture',
      'API development',
      'User authentication',
      'Admin dashboard',
      'Scalable infrastructure'
    ],
    idealFor: ['Digital products', 'Enterprise solutions', 'Platforms'],
    timeline: '8-12 weeks',
    techStack: ['Next.js', 'React', 'Node.js', 'PostgreSQL']
  }
};

// Solution recommendation logic
const recommendSolution = (answers: Record<string, string>): Solution => {
  const purposeMap: Record<string, string> = {
    'business': 'small-business',
    'sell': 'ecommerce',
    'startup': 'startup',
    'custom': 'mvp'
  };

  const budgetMap: Record<string, string[]> = {
    'starter': ['small-business'],
    'basic': ['small-business', 'startup'],
    'professional': ['ecommerce', 'startup'],
    'premium': ['mvp'],
    'enterprise': ['mvp']
  };

  const timelineMap: Record<string, string[]> = {
    'asap': ['small-business'],
    'soon': ['small-business', 'startup', 'ecommerce'],
    'month': ['startup', 'ecommerce', 'mvp'],
    'flexible': ['mvp']
  };

  let recommendedSolution = purposeMap[answers.purpose] || 'small-business';
  
  if (budgetMap[answers.budget]?.includes(recommendedSolution)) {
    return solutions[recommendedSolution];
  }

  return solutions[budgetMap[answers.budget]?.[0] || 'small-business'];
};

// QuestionStep component
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
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
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
            className="group relative p-4 border rounded-xl text-left hover:border-primary 
              transition-all duration-200 hover:bg-primary/5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.text}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 
                transition-opacity" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// SolutionResult component
function SolutionResult({ 
    solution, 
    onRestart 
  }: { 
    solution: Solution;
    onRestart: () => void;
  }) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ 
          duration: 0.3,
          ease: "easeOut"
        }}
        className="space-y-8"
      >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 mb-6">
          <Settings2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Recommended Solution</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{solution.name}</h3>
        <p className="text-muted-foreground mb-4">{solution.description}</p>
        <div className="text-xl font-semibold text-primary">{solution.price}</div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Included Features</h4>
        <div className="grid gap-3">
          {solution.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {solution.techStack && (
        <div className="space-y-4">
          <h4 className="font-medium">Technology Stack</h4>
          <div className="flex flex-wrap gap-2">
            {solution.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-gray-100 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button 
          className="flex-1"
          onClick={() => window.location.href = solution.link}
        >
          Learn More
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onRestart}
        >
          Start Over
        </Button>
      </div>
    </motion.div>
  );
}

// Main SolutionFinder component
export function SolutionFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendedSolution, setRecommendedSolution] = useState<Solution | null>(null);

  const handleAnswer = (questionId: string, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(current => current + 1);
    } else {
      const solution = recommendSolution(newAnswers);
      setRecommendedSolution(solution);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(current => current - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendedSolution(null);
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
              Find Your Perfect Web Design Solution
            </h2>
            <p className="text-muted-foreground">
              Answer a few questions to get a customized recommendation
            </p>
          </motion.div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            {!recommendedSolution && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ 
                    width: `${((currentStep + 1) / questions.length) * 100}%` 
                }}
                transition={{ 
                    duration: 0.4,
                    ease: "easeInOut"
                }}
                />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!recommendedSolution ? (
                <QuestionStep
                  key={currentStep}
                  question={questions[currentStep]}
                  onAnswer={handleAnswer}
                  onBack={goBack}
                  showBack={currentStep > 0}
                />
              ) : (
                <SolutionResult
                  key="result"
                  solution={recommendedSolution}
                  onRestart={restart}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Additional context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>
              Not sure what you need? {' '}
              <button
                onClick={() => window.open('https://cal.com/blueprint/intro', '_blank')}
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
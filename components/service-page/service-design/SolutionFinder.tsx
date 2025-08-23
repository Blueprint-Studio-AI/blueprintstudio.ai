// components/service-page/service-design/SolutionFinder.tsx
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
  methodologies?: string[];
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
    text: "What's your main service design goal?",
    options: [
      { id: 'customer', text: 'Improve customer experience' },
      { id: 'efficiency', text: 'Optimize internal processes' },
      { id: 'innovation', text: 'Create new service offerings' },
      { id: 'digital', text: 'Digitize existing services' },
      { id: 'employee', text: 'Enhance employee experience' },
      { id: 'strategy', text: 'Develop service strategy' }
    ]
  },
  {
    id: 'industry',
    text: 'What industry are you in?',
    options: [
      { id: 'healthcare', text: 'Healthcare' },
      { id: 'financial', text: 'Financial Services' },
      { id: 'retail', text: 'Retail & Hospitality' },
      { id: 'tech', text: 'Technology' },
      { id: 'government', text: 'Government & Public Sector' },
      { id: 'education', text: 'Education' },
      { id: 'manufacturing', text: 'Manufacturing' },
      { id: 'other', text: 'Other' }
    ]
  },
  {
    id: 'scope',
    text: 'What is the scope of your service design project?',
    options: [
      { id: 'single', text: 'Single service or touchpoint' },
      { id: 'multiple', text: 'Multiple connected services' },
      { id: 'department', text: 'Department-wide transformation' },
      { id: 'organization', text: 'Organization-wide transformation' },
      { id: 'ecosystem', text: 'Service ecosystem redesign' },
      { id: 'unsure', text: 'Not sure yet' }
    ]
  },
  {
    id: 'timeline',
    text: 'What is your project timeline?',
    options: [
      { id: 'urgent', text: 'Urgent (1-2 months)' },
      { id: 'standard', text: 'Standard (3-6 months)' },
      { id: 'extended', text: 'Extended (6-12 months)' },
      { id: 'flexible', text: 'Flexible / Not urgent' }
    ]
  },
  {
    id: 'budget',
    text: "What's your budget range?",
    options: [
      { id: 'small', text: '$5,000 - $15,000' },
      { id: 'medium', text: '$15,000 - $30,000' },
      { id: 'large', text: '$30,000 - $75,000' },
      { id: 'enterprise', text: '$75,000+' }
    ]
  },
  {
    id: 'involvement',
    text: 'How would you like to be involved in the process?',
    options: [
      { id: 'collaborative', text: 'Highly collaborative partnership' },
      { id: 'guided', text: 'Guided involvement at key milestones' },
      { id: 'turnkey', text: 'Turnkey solution with minimal involvement' }
    ]
  }
];

// -------------------------
// Modules Definitions
// -------------------------
const modules: Record<string, Module> = {
  research: {
    id: 'research',
    name: 'User Research & Insights',
    description: 'Deep understanding of user needs, behaviors, and pain points.',
    basePrice: 8000,
    estimatedTime: '4-6 weeks',
    features: ['Stakeholder interviews', 'User interviews', 'Journey mapping', 'Insights analysis']
  },
  experience: {
    id: 'experience',
    name: 'Customer Experience Design',
    description:
      'Holistic design of customer experiences across all touchpoints.',
    basePrice: 12000,
    estimatedTime: '6-8 weeks',
    features: ['Experience strategy', 'Touchpoint design', 'Emotional journey mapping', 'Service blueprinting'],
    methodologies: ['Design Thinking', 'Jobs-to-be-Done', 'Experience Mapping']
  },
  process: {
    id: 'process',
    name: 'Process Optimization',
    description:
      'Streamlining internal processes to improve efficiency and effectiveness.',
    basePrice: 10000,
    estimatedTime: '6-8 weeks',
    features: ['Process mapping', 'Efficiency analysis', 'Workflow redesign', 'Implementation planning']
  },
  digital: {
    id: 'digital',
    name: 'Digital Service Transformation',
    description:
      'Transforming traditional services into digital experiences.',
    basePrice: 15000,
    estimatedTime: '8-12 weeks',
    features: ['Digital strategy', 'Service digitization', 'Platform selection', 'Integration planning']
  },
  innovation: {
    id: 'innovation',
    name: 'Service Innovation',
    description:
      'Creating new service offerings that address unmet customer needs.',
    basePrice: 18000,
    estimatedTime: '10-14 weeks',
    features: ['Opportunity identification', 'Concept development', 'Service prototyping', 'Business model design']
  },
  implementation: {
    id: 'implementation',
    name: 'Implementation Support',
    description:
      'Guidance and support for successfully implementing service design changes.',
    basePrice: 8000,
    estimatedTime: '8-12 weeks',
    features: ['Change management', 'Staff training', 'Pilot testing', 'Rollout planning']
  }
};

// -------------------------
// Dynamic Solution Generator
// -------------------------

const timelineMapping: Record<string, string> = {
    urgent: "1-2 months",
    standard: "3-6 months",
    extended: "6-12 months",
    flexible: "Flexible timeline"
  };
  
const generateDynamicSolution = (
    answers: Record<string, string>
  ): DynamicSolution => {
    const selectedModules: Module[] = [];
    let totalPrice = 0;
  
    // Always include the research module as a foundation
    selectedModules.push(modules.research);
    totalPrice += modules.research.basePrice;
  
    // Customer Experience: if the purpose is improving customer experience
    if (answers.purpose === 'customer') {
      selectedModules.push(modules.experience);
      totalPrice += modules.experience.basePrice;
    }
  
    // Process Optimization: if the purpose is optimizing internal processes
    if (answers.purpose === 'efficiency') {
      selectedModules.push(modules.process);
      totalPrice += modules.process.basePrice;
    }
  
    // Digital Transformation: if the purpose is digitizing services
    if (answers.purpose === 'digital') {
      selectedModules.push(modules.digital);
      totalPrice += modules.digital.basePrice;
    }
  
    // Service Innovation: if the purpose is creating new offerings
    if (answers.purpose === 'innovation') {
      selectedModules.push(modules.innovation);
      totalPrice += modules.innovation.basePrice;
    }
  
    // Implementation: add for larger scope projects
    if (['department', 'organization', 'ecosystem'].includes(answers.scope)) {
      selectedModules.push(modules.implementation);
      totalPrice += modules.implementation.basePrice;
    }
  
    // Use the timeline answer directly
    const timeline = timelineMapping[answers.timeline] || "TBD";
    const solutionName = 'Custom Service Design Solution';
    const description = `Based on your needs, we've crafted a solution that includes: ${selectedModules
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
            className="group relative p-4 border rounded-xl text-left hover:border-primary/20 transition-all duration-200 hover:bg-primary/5"
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
              Build Your Custom Service Design Solution
            </h2>
            <p className="text-muted-foreground">
              Answer a few questions and see a tailored service design approach built just for you.
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
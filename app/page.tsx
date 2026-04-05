import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CheckCircle, Zap, BarChart3, ShieldCheck } from "lucide-react"; 

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-screen  text-white ">
      <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
        <DotLottieReact
          src="/bg.json"
          loop
          autoplay
          className="h-full w-full object-cover opacity-30 grayscale-[0.5]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#05070a]/50 to-[#05070a]" />
      </div>

    

      <main className="relative z-10 pt-14">
        {/* Hero Section */}
        <section className="mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            New: Personalized AI Feedback 2.0
          </div>

          <h1 className="max-w-4xl bg-linear-to-br from-white to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-6xl">
            Ace your next interview <br /> with AI-powered prep
          </h1>

          <p className="mt-8 max-w-2xl text-md leading-relaxed text-slate-400 md:text-lg">
            Stop guessing your performance. Practice with industry-specific AI personas, 
            receive real-time critiques, and track your growth on a data-driven dashboard.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="group  relative flex items-center gap-2 rounded-xl bg-white/8 px-8 py-4 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
             {session ? "Go to Dashboard" : "Get Started"}
            </Link>
            <button className="rounded-xl border border-slate-700  px-8 py-4 font-bold backdrop-blur-sm transition-all hover:bg-slate-800">
              Watch Demo
            </button>
          </div>
          
          <div className="mt-16 flex items-center gap-8 text-slate-500 grayscale opacity-70">
            <p className="text-sm font-medium uppercase tracking-widest">Trusted by candidates at</p>
            {/* Add small brand icons/names here if desired */}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-16 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard 
              icon={<ShieldCheck className="text-indigo-400" />}
              title="Role-Specific AI"
              description="Tailored questions for Software Engineering, Product Management, Sales, and 20+ other roles."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-indigo-400" />}
              title="Deep Analytics"
              description="Get a sentiment analysis of your tone and a breakdown of your technical accuracy."
            />
            <FeatureCard 
              icon={<CheckCircle className="text-indigo-400" />}
              title="Resume Integration"
              description="Upload your CV and let the AI grill you on your specific experience and projects."
            />
          </div>
            {/* Visual Connector (Optional Decorative Element) */}
  <div className="mt-20 flex justify-center">
     <div className="h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-700 to-transparent" />
  </div>
        </section>
        {/* How It Works Section */}
<section className="relative mx-auto max-w-7xl px-16 py-24">
  <div className="mb-16 text-center">
    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
      Master your interview in <span className="text-indigo-400">3 simple steps</span>
    </h2>
    <p className="mt-4 text-slate-400 text-lg">No more prep-anxiety. Just practice and precision.</p>
  </div>

  <div className="grid gap-12 lg:grid-cols-3">
    {/* Step 1 */}
    <div className="group relative">
      <div className="absolute -left-4 -top-4 text-8xl font-black text-white/5 transition-colors group-hover:text-indigo-500/10">01</div>
      <div className="relative z-10 flex flex-col items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-500/20">
          1
        </div>
        <h3 className="text-2xl font-bold">Define Your Goal</h3>
        <p className="text-slate-400 leading-relaxed">
          Select your target role (e.g., Frontend Dev) and paste the job description. 
          Our AI tailors the questions to the specific tech stack and seniority level.
        </p>
      </div>
    </div>

    {/* Step 2 */}
    <div className="group relative">
      <div className="absolute -left-4 -top-4 text-8xl font-black text-white/5 transition-colors group-hover:text-indigo-500/10">02</div>
      <div className="relative z-10 flex flex-col items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-500/20">
          2
        </div>
        <h3 className="text-2xl font-bold">The Live Session</h3>
        <p className="text-slate-400 leading-relaxed">
          Engage in a real-time conversation. The AI listens to your responses, 
          asks follow-up questions, and challenges your technical depth.
        </p>
      </div>
    </div>

    {/* Step 3 */}
    <div className="group relative">
      <div className="absolute -left-4 -top-4 text-8xl font-black text-white/5 transition-colors group-hover:text-indigo-500/10">03</div>
      <div className="relative z-10 flex flex-col items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-500/20">
          3
        </div>
        <h3 className="text-2xl font-bold">Review & Refine</h3>
        <p className="text-slate-400 leading-relaxed">
          Receive a detailed score on your body language, tone, and technical accuracy 
          alongside "Perfect Answer" examples for every question.
        </p>
      </div>
    </div>
  </div>

  {/* Visual Connector (Optional Decorative Element) */}
  <div className="mt-20 flex justify-center">
     <div className="h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-700 to-transparent" />
  </div>
</section>
{/* Pricing Section */}
<section className="mx-auto max-w-7xl px-16 py-24">
  <div className="mb-16 text-center">
    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Transparent Pricing</h2>
    <p className="mt-4 text-slate-400">Invest in your career. Preparation is the best ROI.</p>
  </div>

  <div className="grid gap-8 lg:grid-cols-3">
    {/* Free Tier */}
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/[0.07]">
      <h3 className="text-lg font-semibold text-slate-400">Free</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">$0</span>
        <span className="text-sm text-slate-500">/mo</span>
      </div>
      <ul className="mt-8 space-y-4 text-sm text-slate-300">
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> 2 Interviews per month</li>
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Basic AI Feedback</li>
        <li className="flex items-center gap-3 text-slate-500"><CheckCircle className="h-4 w-4 opacity-20" /> No Resume Analysis</li>
      </ul>
      <Link href="/register" className="mt-8 block w-full rounded-xl border border-slate-700 py-3 text-center font-semibold transition-hover hover:bg-slate-800">Get Started</Link>
    </div>

    {/* Pro Tier (Highlighted) */}
    <div className="relative rounded-2xl border-2 border-indigo-500 bg-indigo-500/5 p-8 shadow-[0_0_40px_rgba(79,70,229,0.15)]">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-4 py-1 text-xs font-bold tracking-widest uppercase">Most Popular</div>
      <h3 className="text-lg font-semibold text-indigo-400">Pro</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">$19</span>
        <span className="text-sm text-slate-400">/mo</span>
      </div>
      <ul className="mt-8 space-y-4 text-sm text-slate-200">
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Unlimited Interviews</li>
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Resume-Specific Questions</li>
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Video & Audio Analysis</li>
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Behavioral & Tech Drills</li>
      </ul>
      <Link href="/register" className="mt-8 block w-full rounded-xl bg-indigo-600 py-3 text-center font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500">Go Pro</Link>
    </div>

    {/* Lifetime Tier */}
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/[0.07]">
      <h3 className="text-lg font-semibold text-slate-400">Lifetime</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">$99</span>
        <span className="text-sm text-slate-500">one-time</span>
      </div>
      <ul className="mt-8 space-y-4 text-sm text-slate-300">
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Everything in Pro</li>
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Early Access to Features</li>
        <li className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-indigo-500" /> Priority Support</li>
      </ul>
      <Link href="#" className="mt-8 block w-full rounded-xl border border-slate-700 py-3 text-center font-semibold hover:bg-slate-800">Buy Lifetime</Link>
    </div>
  </div>
    {/* Visual Connector (Optional Decorative Element) */}
  <div className="mt-20 flex justify-center">
     <div className="h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-700 to-transparent" />
  </div>
</section>

{/* FAQ Section */}
<section className="mx-auto max-w-4xl px-12 py-24 ">
  <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
  <div className="grid gap-8 md:grid-cols-2">
    <div>
      <h4 className="font-bold text-indigo-400">How realistic are the interviews?</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">We use fine-tuned LLMs trained on actual industry interview transcripts from companies like FAANG and top startups.</p>
    </div>
    <div>
      <h4 className="font-bold text-indigo-400">Is my data private?</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">Absolutely. Your recordings and resumes are encrypted and never shared. We only use them to provide your personal feedback.</p>
    </div>
    <div>
      <h4 className="font-bold text-indigo-400">Can I practice for non-tech roles?</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">Yes! While we excel at technical roles, our AI supports Sales, Marketing, HR, and Executive positions.</p>
    </div>
    <div>
      <h4 className="font-bold text-indigo-400">Do I need a webcam?</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">It’s recommended for non-verbal feedback, but you can also choose audio-only or text-only modes.</p>
    </div>
  </div>
</section>
      </main>

   
    </div>
  );
}

// Helper Component for Features
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-white/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}
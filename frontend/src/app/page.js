import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Online Therapy <br />
                <span className="text-teal-600 dark:text-teal-400">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Connect with licensed therapists from the comfort of your home. 
                Professional, secure, and personalized mental health support.
              </p>
              <div className="flex gap-4">
                <Link href="/register" prefetch={true}>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
                    Get Started
                  </Button>
                </Link>
                <Link href="/therapists" prefetch={true}>
                  <Button variant="outline" className="px-8 py-3">
                    Find Therapists
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">100+</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Licensed Therapists</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">3K+</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Sessions Completed</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">4.9★</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Average Rating</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-4xl font-bold text-teal-600 dark:text-teal-400">24/7</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose SoulSupport
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                100% Confidential
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your privacy is our priority. All sessions are encrypted and secure.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Licensed Professionals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with verified, experienced therapists who care.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Book sessions that fit your schedule, from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Areas We Help With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Anxiety', 'Depression', 'Relationships', 'Stress',
              'Trauma', 'Self-Esteem', 'Grief', 'Career'
            ].map((area) => (
              <div key={area} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                <p className="font-medium text-gray-900 dark:text-white">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-teal-600 dark:bg-teal-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-teal-50 mb-8">
            Take the first step towards better mental health today.
          </p>
          <Link href="/register" prefetch={true}>
            <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

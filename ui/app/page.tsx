import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Welcome to <span className="text-blue-200">FamLink</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl max-w-3xl mx-auto text-blue-100">
            Simplify family life with smart chore tracking, schedules, and AI-powered event management.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block bg-blue-200 text-blue-900 font-semibold py-4 px-8 rounded-full shadow-lg hover:bg-blue-300 hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Why Choose FamLink?
          </h2>
          <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto">
            FamLink helps busy families stay organized with intuitive tools and AI magic.
          </p>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Chore Checklists */}
            <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Chore Checklists</h3>
              <p className="mt-3 text-gray-600">
                Assign daily chores to each family member with easy-to-use checklists.
              </p>
            </div>

            {/* Feature 2: Prize Incentives */}
            <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Prize Incentives</h3>
              <p className="mt-3 text-gray-600">
                Motivate kids with random prizes for completing chores.
              </p>
            </div>

            {/* Feature 3: Family Schedules */}
            <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-teal-50 text-teal-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Family Schedules</h3>
              <p className="mt-3 text-gray-600">
                Keep everyone on track with a shared family calendar.
              </p>
            </div>

            {/* Feature 4: AI Event Extraction */}
            <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-50 text-purple-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4m0 0l4 4m-4-4v10m6-6h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Event Extraction</h3>
              <p className="mt-3 text-gray-600">
                Upload images or links, and let AI add events to your calendar.
              </p>
            </div>

            {/* Feature 5: Inter-Family Coordination */}
            <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Inter-Family Coordination</h3>
              <p className="mt-3 text-gray-600">
                Link families to share events and find the best times to meet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 FamLink. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/about" className="text-gray-400 hover:text-blue-200 mx-2 transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-blue-200 mx-2 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
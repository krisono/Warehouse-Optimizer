"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Package,
  TrendingUp,
  Map,
  Zap,
  Github,
  BarChart3,
  Route,
  Calendar,
  Menu,
  X,
  MapPin,
  Users,
  ClipboardList,
  Target,
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-slate-900">
                Warehouse Optimizer
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/routes"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Route Planner
              </Link>
              <Link
                href="/analytics"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Performance
              </Link>
              <Link
                href="/tasks"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Tasks
              </Link>
              <Link
                href="/routes"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <Link
                href="/routes"
                className="block text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Route Planner
              </Link>
              <Link
                href="/analytics"
                className="block text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Performance
              </Link>
              <Link
                href="/tasks"
                className="block text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tasks
              </Link>
              <Link
                href="/routes"
                className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
            📦 Simulation demo • No real data required
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-slate-900 leading-tight">
            Plan faster warehouse picks
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              with smarter routes
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Design a warehouse layout, simulate pick routes, and see how smarter
            task planning can reduce walking time, errors, and overtime.
            Portfolio demo using shortest-path routing, batched picks, and
            multi-factor task scoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/routes"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              Open Route Planner <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/analytics"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Performance Dashboard
            </Link>
          </div>
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Portfolio demo project</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Fully client-side simulation</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0">
          <FeatureCard
            icon={<Route className="w-10 h-10 text-blue-600" />}
            title="Route Optimization"
            description="Plans efficient walking paths through aisles and docks to cut wasted steps"
            badge="Fewer steps"
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10 text-emerald-600" />}
            title="Real-time Analytics"
            description="Track throughput, pick time, and queue health in a single, visual dashboard"
            badge="Live metrics"
          />
          <FeatureCard
            icon={<Calendar className="w-10 h-10 text-violet-600" />}
            title="Smart Prioritization"
            description="Ranks tasks by deadlines, value, and workload so associates always know what to do next"
            badge="Focus where it matters"
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-amber-600" />}
            title="Visual Insights"
            description="Heatmaps and scenario comparisons that make hotspots, bottlenecks, and trade-offs obvious"
            badge="Spot bottlenecks"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <p className="text-slate-600 mb-2 text-sm font-medium uppercase tracking-wide">
              Pick Time Reduction
            </p>
            <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              40%
            </p>
            <p className="text-slate-500 text-sm">
              Simulated time saved with smarter paths
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 mb-2 text-sm font-medium uppercase tracking-wide">
              Labor Cost Savings
            </p>
            <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              25%
            </p>
            <p className="text-slate-500 text-sm">
              Fewer steps means less overtime
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl">
                <Zap className="w-8 h-8 text-violet-600" />
              </div>
            </div>
            <p className="text-slate-600 mb-2 text-sm font-medium uppercase tracking-wide">
              Error Reduction
            </p>
            <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              35%
            </p>
            <p className="text-slate-500 text-sm">
              Clearer priorities reduce mistakes
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 md:mb-20 mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Map your layout
              </h3>
              <p className="text-slate-600 text-sm">
                Use the layout editor to define zones, aisles, and dock
                positions for your simulated warehouse
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Import or type orders
              </h3>
              <p className="text-slate-600 text-sm">
                Add pick tasks with SKUs, locations, priorities, and deadlines
                to simulate a real order batch
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Run optimization & review metrics
              </h3>
              <p className="text-slate-600 text-sm">
                Generate routes and view analytics showing time saved,
                priorities scored, and bottlenecks identified
              </p>
            </div>
          </div>
        </div>

        {/* Who This Helps */}
        <div className="mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900">
            Who this helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Warehouse Managers
              </h3>
              <p className="text-slate-600 text-sm">
                Test layout changes and routing strategies before rolling them
                out to your team
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Operations Supervisors
              </h3>
              <p className="text-slate-600 text-sm">
                Visualize task priorities and worker assignments to balance
                workload across shifts
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Associates
              </h3>
              <p className="text-slate-600 text-sm">
                See how better routing reduces daily walking distance and makes
                pick lists easier to follow
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-white text-center mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to explore the demo?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-4">
            Start with the route planner to design a layout, or jump into the
            performance dashboard to see simulated metrics.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/routes"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:shadow-lg active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <Map className="w-5 h-5" />
              Open Route Planner
            </Link>
            <Link
              href="/tasks"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-all border-2 border-blue-400 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View Task Board
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-6 h-6 text-blue-600" />
                <span className="font-bold text-slate-900 text-lg">
                  Warehouse Optimizer
                </span>
              </div>
              <p className="text-slate-600 text-sm">
                A portfolio demo simulating route planning, task prioritization,
                and performance analytics for warehouse operations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/routes"
                  className="block text-slate-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Route Planner
                </Link>
                <Link
                  href="/analytics"
                  className="block text-slate-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Performance Dashboard
                </Link>
                <Link
                  href="/tasks"
                  className="block text-slate-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Task Board
                </Link>
                <Link
                  href="/settings"
                  className="block text-slate-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wide">
                Portfolio & Contact
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Built by{" "}
                <a
                  href="https://www.nnaemekaonochie.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Nnaemeka Onochie
                </a>
              </p>
              <a
                href="https://github.com/krisono/Warehouse-Optimizer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 text-center">
            <p className="text-slate-500 text-xs">
              © 2025 Warehouse Optimizer Demo. For portfolio demonstration
              purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl sm:hover:scale-105 transition-all group">
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          {badge}
        </span>
      </div>
      <div className="mb-4 p-2 sm:p-3 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl w-fit">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

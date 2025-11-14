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
                Routes
              </Link>
              <Link
                href="/analytics"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Analytics
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
                Routes
              </Link>
              <Link
                href="/analytics"
                className="block text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
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
            🚀 Algorithm-Driven Warehouse Management
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-slate-900 leading-tight">
            Optimize Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Warehouse Operations
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Reduce picking time by 40% with intelligent route optimization using
            advanced algorithms (A*, TSP, K-means), real-time analytics, and
            smart task management. Built for modern warehouses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/routes"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              Start Optimizing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/analytics"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Demo
            </Link>
          </div>
          <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free forever</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20 px-4 sm:px-0">
          <FeatureCard
            icon={<Route className="w-10 h-10 text-blue-600" />}
            title="Route Optimization"
            description="A* pathfinding, Nearest Neighbor TSP, and K-means clustering for optimal picking paths"
            badge="40% faster"
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10 text-emerald-600" />}
            title="Real-time Analytics"
            description="Track KPIs, efficiency metrics, and system health with interactive dashboards"
            badge="Live data"
          />
          <FeatureCard
            icon={<Calendar className="w-10 h-10 text-violet-600" />}
            title="Smart Prioritization"
            description="Multi-factor scoring based on SLA, revenue impact, urgency, and task complexity"
            badge="15+ factors"
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-amber-600" />}
            title="Visual Insights"
            description="Heatmaps, scenario comparisons, and analytics for data-driven decisions"
            badge="Advanced"
          />
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 md:mb-20 mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <StatCard
              label="Pick Time Reduction"
              value="40%"
              sublabel="Optimized routing"
              icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
            />
            <StatCard
              label="Labor Cost Savings"
              value="25%"
              sublabel="Efficient paths"
              icon={<Package className="w-8 h-8 text-blue-600" />}
            />
            <StatCard
              label="Error Reduction"
              value="35%"
              sublabel="Smart prioritization"
              icon={<Zap className="w-8 h-8 text-violet-600" />}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-white text-center mx-4 sm:mx-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Transform Your Warehouse?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-4">
            Join modern warehouses using algorithm-powered optimization. Start
            with our interactive demo or dive into the full platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/routes"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:shadow-lg active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <Map className="w-5 h-5" />
              Create Layout
            </Link>
            <Link
              href="/tasks"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-all border-2 border-blue-400 active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Manage Tasks
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <span className="font-semibold text-slate-900 text-sm sm:text-base">
                Warehouse Optimizer
              </span>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm text-center">
              Built by{" "}
              <a
                href="https://www.nnaemekaonochie.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Nnaemeka Onochie
              </a>{" "}
              • Software Engineer crafting digital experiences
            </p>
            <a
              href="https://github.com/krisono/Warehouse-Optimizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
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

function StatCard({
  label,
  value,
  sublabel,
  icon,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center group">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <p className="text-slate-600 mb-2 text-sm font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {value}
      </p>
      <p className="text-slate-500 text-sm">{sublabel}</p>
    </div>
  );
}

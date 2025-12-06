"use client";

import Link from "next/link";
import {
  ArrowRight,
  Route,
  Sliders,
  BarChart3,
  MapPin,
  Package,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Simple Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-100">
                Warehouse Optimizer
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/routes"
                className="hidden sm:inline-block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
              >
                Route Planner
              </Link>
              <Link
                href="/analytics"
                className="hidden sm:inline-block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
              >
                Performance
              </Link>
              <Link
                href="/routes"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Two Column */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-block mb-4 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
              Simulation demo · Warehouse operations
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              Plan faster pick routes before you change the floor
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Sketch a warehouse, simulate pick lists, and test different
              routing strategies. See how layout changes and task rules impact
              walk time, workload, and service levels before you roll them out
              on the floor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="/routes"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Open Route Planner
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/analytics"
                className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                View Performance Dashboard
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Simulated data only. No real customer information.
            </p>
          </div>

          {/* Right Column - Mini Dashboard */}
          <div>
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 shadow-xl border-2 border-slate-200 dark:border-slate-600">
              <div className="space-y-4">
                {/* Mini warehouse grid */}
                <div className="grid grid-cols-4 gap-3 h-52 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-inner">
                  <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-md border border-blue-200 dark:border-blue-800 hover:scale-105 transition-transform">
                    Zone A
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-md border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-transform">
                    Zone B
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-md border border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform">
                    Zone C
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg flex items-center justify-center text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-md border border-amber-200 dark:border-amber-800 hover:scale-105 transition-transform">
                    Dock
                  </div>
                  <div className="col-span-4 relative bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-lg p-3 border border-slate-300 dark:border-slate-700 shadow-inner">
                    <svg className="w-full h-32" viewBox="0 0 100 40">
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur
                            stdDeviation="2"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient
                          id="pathGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>

                      {/* Background grid pattern */}
                      <defs>
                        <pattern
                          id="grid"
                          width="10"
                          height="10"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 10 0 L 0 0 0 10"
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="0.5"
                            opacity="0.3"
                          />
                        </pattern>
                      </defs>
                      <rect width="100" height="40" fill="url(#grid)" />

                      {/* Warehouse shelves/boxes as background elements */}
                      <rect
                        x="15"
                        y="18"
                        width="4"
                        height="4"
                        fill="#93c5fd"
                        opacity="0.3"
                        rx="0.5"
                      />
                      <rect
                        x="35"
                        y="8"
                        width="4"
                        height="4"
                        fill="#93c5fd"
                        opacity="0.3"
                        rx="0.5"
                      />
                      <rect
                        x="48"
                        y="23"
                        width="4"
                        height="4"
                        fill="#93c5fd"
                        opacity="0.3"
                        rx="0.5"
                      />
                      <rect
                        x="65"
                        y="13"
                        width="4"
                        height="4"
                        fill="#93c5fd"
                        opacity="0.3"
                        rx="0.5"
                      />
                      <rect
                        x="85"
                        y="28"
                        width="4"
                        height="4"
                        fill="#6ee7b7"
                        opacity="0.3"
                        rx="0.5"
                      />

                      {/* Main path with gradient */}
                      <path
                        d="M 10,20 L 30,10 L 50,25 L 70,15 L 90,30"
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="5 3"
                        filter="url(#glow)"
                        className="animate-pulse"
                      />

                      {/* Connecting lines from path to boxes */}
                      <line
                        x1="17"
                        y1="20"
                        x2="17"
                        y2="18"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.4"
                        strokeDasharray="1 1"
                      />
                      <line
                        x1="37"
                        y1="10"
                        x2="37"
                        y2="8"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.4"
                        strokeDasharray="1 1"
                      />
                      <line
                        x1="50"
                        y1="25"
                        x2="50"
                        y2="23"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.4"
                        strokeDasharray="1 1"
                      />
                      <line
                        x1="67"
                        y1="15"
                        x2="67"
                        y2="13"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        opacity="0.4"
                        strokeDasharray="1 1"
                      />
                      <line
                        x1="87"
                        y1="30"
                        x2="87"
                        y2="28"
                        stroke="#10b981"
                        strokeWidth="1"
                        opacity="0.4"
                        strokeDasharray="1 1"
                      />

                      {/* Path waypoint circles with animation */}
                      <circle
                        cx="10"
                        cy="20"
                        r="4"
                        fill="#3b82f6"
                        className="drop-shadow-lg"
                      >
                        <animate
                          attributeName="r"
                          values="4;5;4"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="30"
                        cy="10"
                        r="3"
                        fill="#60a5fa"
                        opacity="0.9"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.9;1;0.9"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="50"
                        cy="25"
                        r="3"
                        fill="#60a5fa"
                        opacity="0.9"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.9;1;0.9"
                          dur="1.5s"
                          begin="0.3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="70"
                        cy="15"
                        r="3"
                        fill="#60a5fa"
                        opacity="0.9"
                      >
                        <animate
                          attributeName="opacity"
                          values="0.9;1;0.9"
                          dur="1.5s"
                          begin="0.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx="90"
                        cy="30"
                        r="4"
                        fill="#10b981"
                        className="drop-shadow-lg"
                      >
                        <animate
                          attributeName="r"
                          values="4;5;4"
                          dur="2s"
                          begin="0.5s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Start and end labels */}
                      <text
                        x="10"
                        y="32"
                        fontSize="3"
                        fill="#3b82f6"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        START
                      </text>
                      <text
                        x="90"
                        y="38"
                        fontSize="3"
                        fill="#10b981"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        END
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      124m
                    </p>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                      Distance
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-emerald-200 dark:border-emerald-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      8min
                    </p>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                      Est. Time
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      12
                    </p>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                      Picks
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features - 3 Specific Blocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Route className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Route experiments, not just pretty maps
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Test different start points, return-to-dock rules, and zone
                  assignments to see how much walking you can remove from a
                  typical pick list.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                <Sliders className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Task rules you can explain to your team
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Score work by due time, value, and distance so it's easy to
                  explain why one pallet moves before another.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Performance views that match real shifts
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Look at today vs this week, and spot zones or hours where
                  orders back up.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Metrics with Context */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <Stat
              label="Walk distance reduced"
              value="40%"
              sublabel="Simulated, based on redirecting picks through closer aisles and reducing backtracking"
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            />
          </Card>

          <Card>
            <Stat
              label="Labor hours saved"
              value="25%"
              sublabel="In a typical route scenario with 50 picks across 4 zones and return-to-dock rules"
              icon={<Package className="w-5 h-5 text-blue-600" />}
            />
          </Card>

          <Card>
            <Stat
              label="Task clarity improvement"
              value="35%"
              sublabel="Associates spend less time deciding what to pick next when priorities are clear"
              icon={<MapPin className="w-5 h-5 text-purple-600" />}
            />
          </Card>
        </div>
      </section>

      {/* Real Building Example */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-slate-700">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">
            Example: changing a dock assignment
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Sketch your current layout
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Define dock, aisles, and a few high-volume zones (overstock,
                bulk, claims, etc.).
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Load a realistic pick list
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter 20–50 line items from a typical shift: SKUs, locations,
                and deadlines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Compare routes before and after
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Move the dock location or zone boundaries and see how travel
                distance and task ordering change.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Warehouse Optimizer
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                A simulation-only tool for exploring route planning, task
                prioritization, and warehouse optimization strategies. Test
                different scenarios before implementing changes on the floor.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.nnaemekaonochie.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/routes"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Route className="w-4 h-4" />
                    Route Planner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Performance Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks"
                    className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    Task Board
                  </Link>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
                Features
              </h3>
              <ul className="space-y-3">
                <li className="text-slate-700 dark:text-slate-300 text-sm font-medium flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Route Optimization</span>
                </li>
                <li className="text-slate-700 dark:text-slate-300 text-sm font-medium flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Task Prioritization</span>
                </li>
                <li className="text-slate-700 dark:text-slate-300 text-sm font-medium flex items-start gap-2">
                  <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Performance Analytics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                © {new Date().getFullYear()} Warehouse Optimizer. Portfolio
                project by Nnaemeka Onochie.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/settings"
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium"
                >
                  Settings
                </Link>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  •
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Simulation data only
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

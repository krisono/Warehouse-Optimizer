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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold !text-slate-900 dark:!text-white mb-6 leading-tight">
            Optimize Warehouse Routes & Minimize Walk Time
          </h1>
        </div>

        {/* Warehouse Layout Card */}
        <Card className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200/20 dark:border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Warehouse Layout & Routes
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Simulated multi-zone layout with receiving, storage, packing,
                and shipping
              </p>
            </div>

            {/* Warehouse Image */}
            <div className="relative mb-6">
              <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/80 p-6 border border-slate-200 dark:border-slate-700">
                <img
                  src="/warehouse-layout.png"
                  alt="Warehouse isometric layout"
                  className="w-full h-auto object-contain mx-auto"
                  style={{ maxHeight: "500px" }}
                />
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Active worker
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Pick location
                  </span>
                </div>
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  7
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                  Active zones
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  76
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                  Workers on floor
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  93.1%
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                  Avg efficiency
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  R→A/B/C→P→S
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">
                  Typical path
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-center">
                Zones closer to receiving handle fast-moving items. Packing and
                shipping sit at the far end so routes move forward instead of
                zig-zagging.
              </p>
            </div>
          </div>
        </Card>

        {/* Description and CTAs */}
        <div className="text-center max-w-3xl mx-auto mt-12">
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Model your warehouse zones, simulate pick lists, and test different
            routes. Minimize walking distance, make routes easy to explain to
            associates, and see how layout changes impact walk time and workload
            before you roll them out on the floor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
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

"use client";

import Link from "next/link";
import {
  ArrowRight,
  Route,
  BarChart3,
  MapPin,
  Package,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

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
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Warehouse Optimizer
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/routes"
                className="hidden sm:inline-block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
              >
                Route Planner
              </Link>
              <Link
                href="/analytics"
                className="hidden sm:inline-block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
              >
                Performance
              </Link>
              <Link
                href="/tasks"
                className="hidden md:inline-block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
              >
                Tasks
              </Link>
              <Link
                href="/settings"
                className="hidden md:inline-block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
              >
                Settings
              </Link>
              <Link
                href="/routes"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold !text-slate-900 dark:!text-white mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Optimize Warehouse Routes
            </span>
            <br />
            <span className="text-slate-800 dark:text-slate-200">
              & Minimize Walk Time
            </span>
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
        <div className="text-center max-w-3xl mx-auto mt-8">
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
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Warehouse Optimizer
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4 max-w-md">
                A simulation-only tool for exploring route planning, task
                prioritization, and warehouse optimization strategies.
              </p>
              <a
                href="https://www.nnaemekaonochie.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <span>View Portfolio</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:!text-white uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/routes"
                    className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Route className="w-3 h-3" />
                    Route Planner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <BarChart3 className="w-3 h-3" />
                    Performance Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks"
                    className="text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Package className="w-3 h-3" />
                    Task Board
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                © {new Date().getFullYear()} Warehouse Optimizer. Portfolio
                project by Nnaemeka Onochie.
              </p>
              <Link
                href="/settings"
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

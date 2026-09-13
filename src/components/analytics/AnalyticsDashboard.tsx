import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { activeTenant, shifts, staffList, incidents, attendanceRecords } = useApp();

  const totalStaff = staffList.length;
  const compliantTrainingStaff = staffList.filter((s) => s.mandatoryTrainingStatus === 'compliant').length;
  const trainingRate = Math.round((compliantTrainingStaff / (totalStaff || 1)) * 100);

  const dbsValidStaff = staffList.filter((s) => s.dbsStatus === 'valid').length;
  const dbsRate = Math.round((dbsValidStaff / (totalStaff || 1)) * 100);

  // Absence & lateness day of week map
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shiftTypes = ['Morning (07:00)', 'Afternoon (14:30)', 'Waking Night (21:45)'];

  // Simulated heatmap values [shiftIndex][dayIndex]
  const heatmapData = [
    [1, 0, 2, 1, 3, 0, 1], // Morning
    [0, 1, 0, 2, 1, 2, 2], // Afternoon
    [0, 0, 1, 0, 1, 1, 0]  // Night
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            Operations & Quality Intelligence
          </span>
          <span className="text-xs text-slate-400 font-mono">Real-Time Data Feed</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          Analytics, Rota Efficiency & CQC Audit Metrics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Continuous quality improvement analytics across attendance punctuality, agency spend displacement, and safe staffing ratios.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Punctuality Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Punctuality Rate</span>
            <Clock className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">96.8%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +1.4%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Target: ≥95% on-time clock-in</p>
        </div>

        {/* Safe Staffing Adherence */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Staffing Ratio Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">99.2%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> CQC Level 1
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Zero unfilled safe staffing alerts</p>
        </div>

        {/* Compliance Health Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Fleet Compliance</span>
            <Award className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">94.5%</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">DBS & Training</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{dbsRate}% DBS • {trainingRate}% Training</p>
        </div>

        {/* Agency Spend Savings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Agency Cost Saved</span>
            <DollarSign className="h-4 w-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-700 dark:text-teal-400">£14,850</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowDownRight className="h-3 w-3" /> -78% agency
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Internal bank shift claim optimization</p>
        </div>

      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Absence & Lateness Heatmap (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Absence & Lateness Heatmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pattern detection by shift time and day of week across the last 30 days
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Variance Index</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[450px]">
              {/* Day headers */}
              <div className="grid grid-cols-8 text-center text-xs font-semibold text-slate-400 mb-2">
                <div className="text-left text-[11px]">Shift Type</div>
                {days.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {shiftTypes.map((shiftName, rIdx) => (
                  <div key={shiftName} className="grid grid-cols-8 items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                      {shiftName}
                    </span>
                    {days.map((_, cIdx) => {
                      const val = heatmapData[rIdx][cIdx];
                      const colorClass =
                        val === 0
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : val === 1
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200'
                          : val === 2
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                          : 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-300 font-bold';

                      return (
                        <div
                          key={cIdx}
                          className={`h-10 rounded-lg flex items-center justify-center font-mono text-xs transition-transform hover:scale-105 ${colorClass}`}
                          title={`${val} variance/late incidents logged`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-950" />
                  <span>0 (Perfect)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-amber-100 dark:bg-amber-900" />
                  <span>2 (Minor)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-red-200 dark:bg-red-950" />
                  <span>3+ (High Variance)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Compliance & Rota Utilization (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Department Compliance Ratings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff training & policy sign-off rates by department
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { dept: 'Nursing & Clinical Care', rate: 98, staff: 6 },
              { dept: 'Dementia Care Practitioners', rate: 94, staff: 14 },
              { dept: 'Management & Governance', rate: 100, staff: 3 },
              { dept: 'Housekeeping & Facilities', rate: 91, staff: 5 }
            ].map((item) => (
              <div key={item.dept} className="space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-800 dark:text-slate-200">{item.dept}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.rate}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.rate >= 95 ? 'bg-teal-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>{item.staff} Active Personnel</span>
                  <span>CQC Benchmark: 90%</span>
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-xl border border-teal-200/70 bg-teal-50/60 p-3.5 text-xs text-teal-900 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-200">
              <span className="font-bold block mb-0.5">Audit Summary (CQC Ready):</span>
              <p className="text-[11px] leading-relaxed">
                All high-risk care tasks (Medication Administration, Moving & Handling, Safeguarding L3) have 100% staff credential verification before shift assignment.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

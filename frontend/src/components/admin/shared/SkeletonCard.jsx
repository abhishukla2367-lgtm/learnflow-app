/* ── Shared Skeleton Components ─────────────────────────────
   Import what you need:
   import SkeletonCard, {
     SkeletonRow, SkeletonCourseCard, SkeletonUserCard,
     SkeletonEnrollCard, SkeletonInstructorCard, SkeletonTopCourseCard
   } from "../shared/SkeletonCard";
──────────────────────────────────────────────────────────── */

/* ── Generic stat card (Dashboard overview) ── */
export default function SkeletonCard({ wide = false }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-12 h-5 rounded-full bg-slate-100" />
      </div>
      <div className="h-3 w-20 bg-slate-100 rounded-lg mb-2" />
      <div className={`h-7 ${wide ? "w-36" : "w-24"} bg-slate-100 rounded-lg`} />
    </div>
  );
}

/* ── Table row ── */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-2.5 w-44 rounded-full bg-slate-200" />
        <div className="h-2 w-28 rounded-full bg-slate-100" />
      </div>
      <div className="h-2.5 w-16 rounded-full bg-slate-200" />
      <div className="h-6 w-16 rounded-full bg-slate-100" />
    </div>
  );
}

/* ── Course card ── */
export function SkeletonCourseCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-16 bg-slate-100 rounded-full" />
          <div className="h-5 w-14 bg-slate-100 rounded-full" />
        </div>
        <div className="h-px bg-slate-100" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 bg-slate-100 rounded-xl" />
          <div className="h-8 bg-slate-100 rounded-xl" />
          <div className="h-8 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── User card ── */
export function SkeletonUserCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-100 rounded-lg" />
            <div className="h-3 w-20 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="w-8 h-8 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-lg mb-2" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
        <div className="h-5 w-14 bg-slate-100 rounded-full" />
      </div>
      <div className="h-px bg-slate-100 mb-3" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 bg-slate-100 rounded-xl" />
        <div className="h-8 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ── Enrollment card ── */
export function SkeletonEnrollCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded-lg" />
            <div className="h-3 w-24 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="w-11 h-11 rounded-full bg-slate-100 flex-shrink-0" />
      </div>
      <div className="h-16 bg-slate-100 rounded-xl mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-20 bg-slate-100 rounded-full" />
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-px bg-slate-100 mb-3" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 bg-slate-100 rounded-xl" />
        <div className="h-8 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ── Instructor card ── */
export function SkeletonInstructorCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-28 bg-slate-100" />
      <div className="px-5 pb-5 mt-4 space-y-3">
        <div className="h-4 w-32 bg-slate-100 rounded-lg" />
        <div className="h-3 w-44 bg-slate-100 rounded-lg" />
        <div className="h-3 w-full bg-slate-100 rounded-lg" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-lg" />
        <div className="h-3 w-40 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── Reports top course card ── */
export function SkeletonTopCourseCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse space-y-3">
      <div className="flex justify-between">
        <div className="w-8 h-8 bg-slate-100 rounded-xl" />
        <div className="w-16 h-6 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-2 bg-slate-100 rounded-full" />
    </div>
  );
}

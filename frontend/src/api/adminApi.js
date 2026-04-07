import API from "./axiosConfig";

// ── Dashboard ──────────────────────────────────────────────
export const fetchDashboard    = ()                   => API.get("/admin/dashboard");
export const fetchAdminStats   = ()                   => API.get("/admin/stats");

// ── Courses ────────────────────────────────────────────────
export const fetchAdminCourses = (params = {})        => API.get("/admin/courses", { params });
export const publishCourse     = (id)                 => API.patch(`/courses/${id}/publish`);
export const deleteCourse      = (id)                 => API.delete(`/courses/${id}`);

// ── Users ──────────────────────────────────────────────────
export const fetchAdminUsers   = (params = {})        => API.get("/admin/users", { params });
export const toggleUser        = (id)                 => API.patch(`/admin/users/${id}/toggle`);

// ── Enrollments ────────────────────────────────────────────
export const fetchAdminEnrollments = (params = {})    => API.get("/admin/enrollments", { params });
export const deleteAdminEnrollment = (id)             => API.delete(`/admin/enrollments/${id}`);
export const restoreAdminEnrollment = (id)            => API.patch(`/admin/enrollments/${id}/restore`); 

// ── Reports ────────────────────────────────────────────────
export const fetchReports      = (period = "monthly") => API.get("/admin/reports", { params: { period } });

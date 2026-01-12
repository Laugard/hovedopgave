const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("auth_token") || "";
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Auth
export async function apiActivate(payrollNumber: string, password: string) {
  return apiFetch<{ token: string; user: any }>("/auth/activate", {
    method: "POST",
    body: JSON.stringify({ payrollNumber, password }),
  });
}

export async function apiLogin(payrollNumber: string, password: string) {
  return apiFetch<{ token: string; user: any }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ payrollNumber, password }),
  });
}

// Guides
export async function apiGetCategories() {
  return apiFetch<{ categories: Array<{ id: number; slug: string; title: string }> }>("/categories");
}

export async function apiGetGuides(categorySlug?: string) {
  const qs = categorySlug ? `?categorySlug=${encodeURIComponent(categorySlug)}` : "";
  return apiFetch<{ guides: Array<{ id: number; slug: string; title: string; category_slug: string }> }>(`/guides${qs}`);
}

export async function apiGetGuide(area: string, slug: string) {
  return apiFetch<{ guide: any }>(`/guides/${area}/${slug}`);
}

// Feedback + Suggestions
export async function apiGetFeedback(guideId: number) {
  return apiFetch<{ feedback: any[] }>(`/feedback?guideId=${guideId}`);
}

export async function apiPostFeedback(guideId: number, message: string) {
  return apiFetch<{ ok: true }>(`/feedback`, {
    method: "POST",
    body: JSON.stringify({ guideId, message }),
  });
}

export async function apiGetSuggestions(guideId?: number) {
  const qs = guideId ? `?guideId=${guideId}` : "";
  return apiFetch<{ suggestions: any[] }>(`/suggestions${qs}`);
}

export async function apiPostSuggestion(guideId: number, title: string, proposedChanges: string) {
  return apiFetch<{ ok: true }>(`/suggestions`, {
    method: "POST",
    body: JSON.stringify({ guideId, title, proposedChanges }),
  });
}

export async function apiApproveSuggestion(suggestionId: number, decision: "APPROVED" | "REJECTED", comment?: string) {
  return apiFetch<{ ok: true }>(`/approvals`, {
    method: "POST",
    body: JSON.stringify({ suggestionId, decision, comment: comment || "" }),
  });
}

// Admin
export async function apiAdminGetAllowlist() {
  return apiFetch<{ allowlist: any[] }>(`/admin/allowlist`);
}

export async function apiAdminAddAllowlist(payrollNumber: string, role: "EMPLOYEE" | "APPROVER" | "ADMIN") {
  return apiFetch<{ ok: true }>(`/admin/allowlist`, {
    method: "POST",
    body: JSON.stringify({ payrollNumber, role }),
  });
}

export async function apiAdminPatchAllowlist(id: number, patch: { isApproved?: boolean; role?: string }) {
  return apiFetch<{ ok: true }>(`/admin/allowlist/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function apiAdminGetUsers() {
  return apiFetch<{ users: any[] }>(`/admin/users`);
}

export async function apiAdminPatchUser(id: number, patch: { isActive?: boolean; role?: string }) {
  return apiFetch<{ ok: true }>(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message ?? "Request failed", response.status);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: import("@/types").User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) =>
      request<{ token: string; user: import("@/types").User }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      ),
    forgotPassword: (email: string) =>
      request<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    me: () => request<import("@/types").User>("/auth/me"),
  },

  tasks: {
    list: (params?: Record<string, string>) => {
      const query = params
        ? `?${new URLSearchParams(params).toString()}`
        : "";
      return request<{
        tasks: import("@/types").Task[];
        pagination: import("@/types").Pagination;
      }>(`/tasks${query}`);
    },
    recent: () => request<import("@/types").Task[]>("/tasks/recent"),
    overdue: () => request<import("@/types").OverdueTask[]>("/tasks/overdue"),
    upcomingDeadlines: () =>
      request<import("@/types").DeadlineItem[]>("/tasks/upcoming-deadlines"),
    create: (data: Record<string, unknown>) =>
      request<import("@/types").Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown>) =>
      request<import("@/types").Task>(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/tasks/${id}`, { method: "DELETE" }),
  },

  categories: {
    list: () => request<import("@/types").Category[]>("/categories"),
    names: () => request<string[]>("/categories/names"),
    create: (data: Record<string, unknown>) =>
      request<import("@/types").Category>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ message: string }>(`/categories/${id}`, {
        method: "DELETE",
      }),
    getTasks: (id: string) =>
      request<{
        category: import("@/types").Category;
        tasks: import("@/types").Task[];
      }>(`/categories/${id}/tasks`),
  },

  dashboard: {
    stats: () => request<import("@/types").DashboardStats>("/dashboard/stats"),
  },

  invitations: {
    list: () => request<import("@/types").Invitation[]>("/invitations"),
    accept: (id: string) =>
      request<{ message: string }>(`/invitations/${id}/accept`, {
        method: "POST",
      }),
    reject: (id: string) =>
      request<{ message: string }>(`/invitations/${id}/reject`, {
        method: "POST",
      }),
  },

  users: {
    search: (q: string, taskId?: string) => {
      const params = new URLSearchParams({ q });
      if (taskId) params.set("taskId", taskId);

      return request<import("@/types").TeamMember[]>(
        `/users/search?${params.toString()}`,
      );
    },
    inviteToTask: (taskId: string, userId: string, role: string) =>
      request<{ message: string }>(`/users/tasks/${taskId}/invite`, {
        method: "POST",
        body: JSON.stringify({ userId, role }),
      }),
  },

  profile: {
    get: () => request<import("@/types").User>("/profile"),
    update: (data: Record<string, string | null>) =>
      request<import("@/types").User>("/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: () =>
      request<{ message: string }>("/profile", { method: "DELETE" }),
  },
};

export { ApiError };

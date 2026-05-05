const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api';

type ApiErrorBody = {
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  status?: number;
};

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  role: 'ADMIN' | 'USER';
  user: {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string | null;
    address: string | null;
    role: 'ADMIN' | 'USER';
    createdAt: string;
    hasProfilePhoto: boolean;
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  hasProfilePhoto: boolean;
}

export interface MembershipInfo {
  membershipId: string;
  memberSince: string;
}

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export const setAuthUser = (user: any) => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const getAuthUser = () => {
  const user = localStorage.getItem('auth_user');
  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem('auth_user');
    return null;
  }
};

const parseResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  const bodyText = await response.text();

  if (!bodyText) {
    return null;
  }

  if (contentType.includes('application/json') || bodyText.trim().startsWith('{') || bodyText.trim().startsWith('[')) {
    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  }

  return bodyText;
};

const getErrorMessage = (body: unknown, fallback: string) => {
  if (!body) {
    return fallback;
  }

  if (typeof body === 'string') {
    return body;
  }

  const errorBody = body as ApiErrorBody;
  return errorBody.message || errorBody.detail || errorBody.title || errorBody.error || fallback;
};

const fetchJson = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  });

  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(body, 'Request failed'));
  }

  return body as T;
};

const fetchEnvelopeData = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const envelope = await fetchJson<ApiEnvelope<T>>(input, init);
  return envelope.data;
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  return fetchJson<AuthResponse>(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

export const register = async (request: RegisterRequest) => {
  return fetchJson(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

export const getProfile = async (): Promise<UserProfile> => {
  return fetchJson<UserProfile>(`${API_BASE_URL}/user/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
};

export const getMembershipInfo = async (): Promise<MembershipInfo> => {
  return fetchJson<MembershipInfo>(`${API_BASE_URL}/user/membership`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
};

export const updateProfile = async (data: {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
}): Promise<UserProfile> => {
  return fetchJson<UserProfile>(`${API_BASE_URL}/user/profile/edit`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return fetchJson(`${API_BASE_URL}/user/password/edit`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const uploadProfilePhoto = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetchJson(`${API_BASE_URL}/user/photo/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
};

export const getProfilePhoto = async (): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/user/photo`, {
    method: 'GET',
    headers: {
      Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : '',
    },
  });

  if (!response.ok) {
    throw new Error('Profile photo not found');
  }

  return response.blob();
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  return fetchJson<UserProfile[]>(`${API_BASE_URL}/admin/users`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
};

export const updateUserRole = async (
  userId: number,
  role: 'ADMIN' | 'USER'
): Promise<UserProfile> => {
  return fetchJson<UserProfile>(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
  role?: 'ADMIN' | 'USER';
}): Promise<UserProfile> => {
  return fetchJson<UserProfile>(`${API_BASE_URL}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (userId: number) => {
  return fetchJson(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

export interface CatalogCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface LibraryBranch {
  id: number;
  name: string;
  location: string | null;
  createdAt: string;
}

export interface LibraryBook {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  description: string | null;
  quantity: number;
  availableQuantity: number;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  createdAt: string;
  hasCoverImage: boolean;
  category: CatalogCategory | null;
  branch: LibraryBranch | null;
}

export interface BorrowingItem {
  id: number;
  userId: number;
  username: string;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string | null;
    coverBase64: string | null;
    category: CatalogCategory | null;
    branch: LibraryBranch | null;
  };
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  createdAt: string;
}

export const getCategories = async (): Promise<CatalogCategory[]> => {
  return fetchEnvelopeData<CatalogCategory[]>(`${API_BASE_URL}/categories`, {
    method: 'GET',
  });
};

export const createCategory = async (payload: { name: string; description?: string }) => {
  return fetchEnvelopeData<CatalogCategory>(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const updateCategory = async (id: number, payload: { name: string; description?: string }) => {
  return fetchEnvelopeData<CatalogCategory>(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const deleteCategory = async (id: number) => {
  return fetchEnvelopeData<void>(`${API_BASE_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

export const getBranches = async (): Promise<LibraryBranch[]> => {
  return fetchEnvelopeData<LibraryBranch[]>(`${API_BASE_URL}/branches`, {
    method: 'GET',
  });
};

export const createBranch = async (payload: { name: string; location?: string }) => {
  return fetchEnvelopeData<LibraryBranch>(`${API_BASE_URL}/admin/branches`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const updateBranch = async (id: number, payload: { name: string; location?: string }) => {
  return fetchEnvelopeData<LibraryBranch>(`${API_BASE_URL}/admin/branches/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const deleteBranch = async (id: number) => {
  return fetchEnvelopeData<void>(`${API_BASE_URL}/admin/branches/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

export const getBooks = async (params?: {
  category?: number;
  branch?: number;
  status?: 'AVAILABLE' | 'UNAVAILABLE';
  search?: string;
}): Promise<LibraryBook[]> => {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', String(params.category));
  if (params?.branch) query.set('branch', String(params.branch));
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  const suffix = query.toString() ? `?${query.toString()}` : '';

  return fetchEnvelopeData<LibraryBook[]>(`${API_BASE_URL}/books${suffix}`, {
    method: 'GET',
  });
};

export const createBook = async (payload: {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  categoryId?: number;
  branchId?: number;
  quantity: number;
}) => {
  return fetchEnvelopeData<LibraryBook>(`${API_BASE_URL}/admin/books`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const updateBook = async (
  id: number,
  payload: {
    title: string;
    author: string;
    isbn?: string;
    description?: string;
    categoryId?: number;
    branchId?: number;
    quantity: number;
  }
) => {
  return fetchEnvelopeData<LibraryBook>(`${API_BASE_URL}/admin/books/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
};

export const deleteBook = async (id: number) => {
  return fetchEnvelopeData<void>(`${API_BASE_URL}/admin/books/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
};

export const borrowBook = async (bookId: number) => {
  return fetchEnvelopeData<BorrowingItem>(`${API_BASE_URL}/user/borrow/${bookId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
};

export const returnBook = async (borrowingId: number) => {
  return fetchEnvelopeData<void>(`${API_BASE_URL}/user/return/${borrowingId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
};

export const getMyBorrowings = async (): Promise<BorrowingItem[]> => {
  return fetchEnvelopeData<BorrowingItem[]>(`${API_BASE_URL}/user/my-books`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
};

export const getAllBorrowings = async (): Promise<BorrowingItem[]> => {
  return fetchEnvelopeData<BorrowingItem[]>(`${API_BASE_URL}/admin/borrowings`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
};

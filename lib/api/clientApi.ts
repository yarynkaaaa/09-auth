import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  username: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = "", tag } = params;

  const queryParams: Record<string, string | number> = { page, perPage };

  if (search) queryParams.search = search;
  if (tag && tag.toLowerCase() !== "all") queryParams.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: queryParams,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${encodeURIComponent(id)}`);
  return data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${encodeURIComponent(id)}`);
  return data;
};

export const register = async (body: RegisterRequest): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
};

export const login = async (body: LoginRequest): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | "">("/auth/session");
  return data || null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (body: UpdateMeRequest): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", body);
  return data;
};

import { cookies } from "next/headers";
import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = "", tag } = params;

  const queryParams: Record<string, string | number> = { page, perPage };

  if (search) queryParams.search = search;
  if (tag && tag.toLowerCase() !== "all") queryParams.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: queryParams,
    headers: await getCookieHeader(),
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${encodeURIComponent(id)}`, {
    headers: await getCookieHeader(),
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me", {
    headers: await getCookieHeader(),
  });
  return data;
};

export const checkSession = async () => {
  return api.get<User | "">("/auth/session", {
    headers: await getCookieHeader(),
  });
};

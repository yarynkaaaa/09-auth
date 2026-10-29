import axios from "axios";
import type { Note, NoteTag } from "@/types/note";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

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

export const fetchNotes = async (
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = "", tag } = params;

  const queryParams: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search) {
    queryParams.search = search;
  }

  if (tag && tag.toLowerCase() !== "all") {
    queryParams.tag = tag;
  }

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

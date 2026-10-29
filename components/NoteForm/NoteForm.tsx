"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
  });

  async function handleSubmit(formData: FormData) {
    const values: NoteFormValues = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    };

    if (values.title.length < 3 || values.title.length > 50) {
      return;
    }

    if (values.content.length > 500) {
      return;
    }

    try {
      await createNoteMutation.mutateAsync(values);
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          value={draft.title}
          onChange={(event) => setDraft({ title: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          className={css.textarea}
          value={draft.content}
          onChange={(event) => setDraft({ content: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(event) => setDraft({ tag: event.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>

      {createNoteMutation.isError && (
        <p role="alert" className={css.error}>
          Failed to create note. Please try again.
        </p>
      )}
    </form>
  );
}

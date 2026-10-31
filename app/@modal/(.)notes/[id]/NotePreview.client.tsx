"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import css from "@/(private routes)/notes/[id]/NoteDetails.module.css";
interface NotePreviewClientProps {
  id: string;
}
export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {isLoading && <p>Loading, please wait...</p>}
        {isError || (!isLoading && !note) ? (
          <p>Something went wrong.</p>
        ) : (
          note && (
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
              </div>
              <p className={css.tag}>{note.tag}</p>
              <p className={css.content}>{note.content}</p>
              <p className={css.date}>
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}

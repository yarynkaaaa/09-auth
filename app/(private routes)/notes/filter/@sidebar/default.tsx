import Link from "next/link";
import type { NoteTag } from "@/types/note";
import css from "./SidebarNotes.module.css";

export default function SidebarNotes() {
  const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/all" className={css.menuLink}>
          All
        </Link>
      </li>
      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

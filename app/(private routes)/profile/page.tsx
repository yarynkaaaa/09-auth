import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  const title = `${user.username} | Profile`;
  const description = `Profile page of ${user.username} in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://notehub.com/profile",
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub — notes management application",
        },
      ],
      type: "profile",
    },
  };
}

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}

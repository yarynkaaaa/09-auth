"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      const username = formData.get("username") as string;

      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.response?.message ||
            err.response?.data?.message ||
            err.message,
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!user) {
    return null;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user.username}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}

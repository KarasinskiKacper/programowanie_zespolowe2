"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TextInput from "@/components/TextInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getCookie } from "../app/actions";
import { changePassword } from "../auth/lib";
import jwt from "jsonwebtoken";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const fetchCookie = async () => {
    const cookie = await getCookie("access_token");
    if (!cookie) {
      router.push("/logowanie");
    } else {
      return cookie;
    }
  };

  const sendChangePasswordRequest = async () => {
    let isDataCorrect = true;
    if (oldPassword === "") {
      setOldPasswordError("Podaj stare hasło");
      isDataCorrect = false;
    } else {
      setOldPasswordError("");
    }
    if (newPassword === "") {
      setNewPasswordError("Podaj nowe hasło");
      isDataCorrect = false;
    } else {
      setNewPasswordError("");
    }
    if (confirmNewPassword === "") {
      setConfirmNewPasswordError("Powtórz nowe hasło");
      isDataCorrect = false;
    } else {
      setConfirmNewPasswordError("");
    }
    if (!isDataCorrect) return;

    if (newPassword !== confirmNewPassword) {
      setNewPasswordError("Hasła nie zgadzają się");
      setConfirmNewPasswordError("Hasła nie zgadzają się");
      return;
    }

    const cookie = await fetchCookie();
    const res = await changePassword(cookie, oldPassword, newPassword);

    if (res?.error === "Invalid old password") {
      setOldPasswordError("Złe hasło");
    } else {
      setOldPasswordError("");
      setConfirmNewPasswordError("Pomyślnie zmieniono hasło");
    }
  };

  return (
    <div className="flex-col">
      <div className="p-16 flex-col gap-8">
        <TextInput
          label="Login"
          placeholder="Wpisz nowy login"
          value={username}
          setValue={setUsername}
          error={usernameError}
        />
        <Button
          label="Zmień login"
          onClick={() => {
            setUsernameError("Nie można zmieniać loginu.");
          }}
        />
      </div>

      <div className="p-16 flex-col gap-8">
        <TextInput
          label="Hasło"
          placeholder="Wpisz hasło"
          value={oldPassword}
          setValue={setOldPassword}
          error={oldPasswordError}
          isPassword
        />
        <TextInput
          label="Nowe hasło"
          placeholder="Wpisz nowe hasło"
          value={newPassword}
          setValue={setNewPassword}
          error={newPasswordError}
          isPassword
        />
        <TextInput
          label="Powtórz nowe hasło"
          placeholder="Powtórz nowe hasło"
          value={confirmNewPassword}
          setValue={setConfirmNewPassword}
          error={
            confirmNewPasswordError !== "Pomyślnie zmieniono hasło" ? confirmNewPasswordError : ""
          }
          success={
            confirmNewPasswordError === "Pomyślnie zmieniono hasło" ? confirmNewPasswordError : ""
          }
          isPassword
        />
        <Button
          label="Zmień hasło"
          onClick={() => {
            sendChangePasswordRequest();
          }}
        />
      </div>
    </div>
  );
}

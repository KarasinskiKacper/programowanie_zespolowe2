"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TextInput from "@/components/TextInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getCookie } from "../app/actions";
import { getPublicRooms, getChatMessages, getChatMembers } from "../auth/lib";
import jwt from "jsonwebtoken";

const fetchChatMessages = async (roomId: number) => {
  const fetchedChatMessages = await getChatMessages(roomId);
  return fetchedChatMessages;
};

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

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
        <TextInput label="Hasło" placeholder="Wpisz hasło" value={""} setValue={() => {}} />
        <TextInput
          label="Nowe hasło"
          placeholder="Wpisz nowe hasło"
          value={""}
          setValue={() => {}}
        />
        <TextInput
          label="Powtórz nowe hasło"
          placeholder="Powtórz nowe hasło"
          value={""}
          setValue={() => {}}
        />
        <Button label="Zmień hasło" onClick={() => {}} />
      </div>
    </div>
  );
}

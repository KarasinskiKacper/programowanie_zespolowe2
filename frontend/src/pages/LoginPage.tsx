"use client";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { test } from "../auth/lib";
import { log } from "console";

export default function Page() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  // const [fetchedData, setFetchedData] = useState(null);

  // useEffect(() => {
  //   if (!fetchedData) {
  //     const fetchData = async () => {
  //       const users = await test();
  //       if (users) {
  //         setFetchedData(users);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, []);

  return (
    <div className="min-h-screen justify-between items-center overflow-hidden">
      <div className="flex-1 self-stretch p-32 flex justify-center items-center gap-2.5">
        <Logo />
      </div>
      <div className="self-stretch py-16 flex justify-start items-center gap-2.5 overflow-hidden">
        <div className="w-1 self-stretch relative bg-[#ACD266]" />
      </div>
      <div className="flex-1 self-stretch px-32 bg-white inline-flex flex-col justify-center items-center gap-16">
        <div className="self-stretch justify-start text-[#6D66D2] text-8xl font-normal font-['Inter']">
          Zaloguj się
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <TextInput
            label="Login"
            placeholder="Wpisz swój login..."
            value={login}
            setValue={setLogin}
          />
          <TextInput
            label="Hasło"
            placeholder="Wpisz swoje hasło..."
            value={password}
            setValue={setPassword}
            isPassword
          />
        </div>
        <Button
          label="Zaloguj się"
          onClick={() => {
            router.push("/dashboard");
          }}
        />
        <div className="self-stretch inline-flex justify-center items-center gap-4">
          <div className="flex-1 h-1 bg-[#ACD266] rounded-lg" />
          <div className="justify-start text-black text-xl font-normal font-['Inter']">
            Nie masz konta?
          </div>
          <div className="flex-1 h-1 bg-[#ACD266] rounded-lg" />
        </div>
        <Button
          label="Zarejestruj się"
          onClick={() => {
            router.push("/rejestracja");
          }}
          type="outline"
        />
      </div>
    </div>
  );
}

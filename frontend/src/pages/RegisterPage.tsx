"use client";
import Button from "@/components/Button";
import Logo from "@/components/Logo";
import TextInput from "@/components/TextInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "../auth/lib";
import { createCookie } from "../app/actions";

const register = async (login: string, password: string) => {
  const response = await registerUser(login, password);
  if (response.status === 201) {
    const jsonData = await response.json();
    await createCookie("access_token", jsonData.access_token);

    return true;
  }
  return false;
};

export default function Page() {
  const router = useRouter();
  const [username, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessageLogin, setErrorMessageLogin] = useState<string>("");
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>("");
  const [errorMessageConfirmPassword, setErrorMessageConfirmPassword] = useState<string>("");

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
          Zarejestruj się
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-8">
          <TextInput
            label="Login"
            placeholder="Wpisz swój login..."
            value={username}
            setValue={setLogin}
            error={errorMessageLogin}
          />
          <TextInput
            label="Hasło"
            placeholder="Wpisz swoje hasło..."
            value={password}
            setValue={setPassword}
            error={errorMessagePassword}
            isPassword
          />
          <TextInput
            label="Powtórz hasło"
            placeholder="Wpisz swoje hasło..."
            value={confirmPassword}
            setValue={setConfirmPassword}
            error={errorMessageConfirmPassword}
            isPassword
          />
        </div>
        <Button
          label="Zarejestruj się"
          onClick={async () => {
            let isDataEntered = true;
            if (!username) {
              setErrorMessageLogin("Podaj login");
              isDataEntered = false;
            } else {
              setErrorMessageLogin("");
            }

            if (!password) {
              setErrorMessagePassword("Podaj hasło");
              isDataEntered = false;
            } else {
              setErrorMessagePassword("");
            }

            if (!confirmPassword) {
              setErrorMessageConfirmPassword("Podaj hasło");
              isDataEntered = false;
            } else {
              setErrorMessageConfirmPassword("");
            }

            if (!isDataEntered) return;

            if (password !== confirmPassword) {
              setErrorMessageConfirmPassword("Podane hasła są różne");
              return;
            }

            setErrorMessageConfirmPassword("");

            if (!(await register(username, password))) {
              setErrorMessageLogin("Użytkownik o podanym loginie już istnieje");
            } else {
              setErrorMessageLogin("");
              router.push("/dashboard");
            }
          }}
        />

        <div className="self-stretch inline-flex justify-center items-center gap-4">
          <div className="flex-1 h-1 bg-[#ACD266] rounded-lg" />
          <div className="justify-start text-black text-xl font-normal font-['Inter']">
            Masz już konto?
          </div>
          <div className="flex-1 h-1 bg-[#ACD266] rounded-lg" />
        </div>
        <Button
          label="Zaloguj się"
          onClick={() => {
            router.push("/logowanie");
          }}
          type="outline"
        />
      </div>
    </div>
  );
}

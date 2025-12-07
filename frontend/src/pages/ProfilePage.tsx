"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TextInput from "@/components/TextInput";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getCookie } from "../app/actions";
import { getProfilData } from "../auth/lib";
import jwt from "jsonwebtoken";

export default function Page() {
  const router = useRouter();

  const fetchCookie = async () => {
    const cookie = await getCookie("access_token");
    if (!cookie) {
      router.push("/logowanie");
    } else {
      setUsername(jwt.decode(cookie).sub);
      return cookie;
    }
  };
  const fetchData = async () => {
    const cookie = await fetchCookie();
    const data = await getProfilData(cookie);
    setProfilData(data);
  };

  const [profilData, setProfilData] = useState({});
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="self-stretch p-16 inline-flex flex-col justify-start items-start gap-32 overflow-hidden">
      <div className="self-stretch inline-flex justify-start items-center gap-8 overflow-hidden">
        <Icon name="avatar" className="w-24 h-24 text-white" />
        <div className="inline-flex flex-col justify-center items-center">
          <div className="inline-flex justify-center items-center gap-4">
            <div className="items-center text-indigo-500 text-6xl font-bold font-['Inter']">
              {username}fdsafdsadfsa
            </div>
          </div>
          {/* <div className="justify-start text-neutral-400 text-4xl font-normal font-['Inter']">
            Dołączył: 23.11.2025
          </div> */}
        </div>
      </div>
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-center items-center gap-4">
          <div className="inline-flex justify-start items-start gap-32">
            <div className="inline-flex flex-col justify-start items-center">
              <Icon name="chats" className="w-48 h-48 text-[#ACD266]" />
              <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">
                {profilData.message_count}
              </div>
            </div>
          </div>
          <div className="justify-start text-stone-500 text-6xl font-bold font-['Inter']">
            Wiadomości
          </div>
        </div>
        <div className="inline-flex flex-col justify-center items-center gap-4">
          <div className="inline-flex justify-start items-start gap-32">
            <div className="inline-flex flex-col justify-start items-center">
              <Icon name="lock" className="w-40 h-40 text-[#ACD266]" />
              <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">
                {profilData.private_rooms_owned}
              </div>
            </div>
            <div className="inline-flex flex-col justify-start items-center">
              <Icon name="unlock" className="w-40 h-40 text-[#ACD266]" />
              <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">
                {profilData.public_rooms_owned}
              </div>
            </div>
          </div>
          <div className="justify-start text-stone-500 text-6xl font-bold font-['Inter']">
            Utworzone pokoje
          </div>
        </div>
        <div className="inline-flex flex-col justify-center items-center gap-4">
          <div className="inline-flex justify-start items-start gap-32">
            <div className="inline-flex flex-col justify-start items-center">
              <Icon name="lock" className="w-40 h-40 text-[#ACD266]" />
              <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">
                {profilData.private_rooms_member}
              </div>
            </div>
            <div className="inline-flex flex-col justify-start items-center">
              <Icon name="unlock" className="w-40 h-40 text-[#ACD266]" />
              <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">
                {profilData.public_rooms_member}
              </div>
            </div>
          </div>
          <div className="justify-start text-stone-500 text-6xl font-bold font-['Inter']">
            Członek pokoi
          </div>
        </div>
      </div>
    </div>
  );
}

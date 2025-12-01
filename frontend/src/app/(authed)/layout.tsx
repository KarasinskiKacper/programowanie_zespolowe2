"use client";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRooms } from "../../components/context/RoomContext";

import { getCookie, deleteCookie } from "../actions";

import { getPublicRooms, getUserRooms } from "../../auth/lib";

import jwt from "jsonwebtoken";

const logout = async () => {
  await deleteCookie("access_token");
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [topIcon, setTopIcon] = useState<string>("");
  // const [rooms, setRooms] = useState<Object[]>([]);
  // const [chosenRoom, setChosenRoom] = useState<number | null>(null);
  const { rooms, setRooms, chosenRoom, setChosenRoom, userRooms, setUserRooms } = useRooms();

  useEffect(() => {
    const fetchData = async () => {
      const cookie = await getCookie("access_token");
      if (!cookie) {
        router.push("/logowanie");
      } else {
        setAccessToken(cookie);
      }

      if (rooms.length === 0) {
        const fetchedRooms = await getPublicRooms();
        // const fetchedUserRooms = [];
        const fetchedUserRooms = await getUserRooms(jwt.decode(cookie).sub);

        let resultRooms: Object[] = [];

        fetchedRooms.forEach((room) => {
          resultRooms.push({ name: room.room_name, id: room.room_id, isPrivate: false });
        });

        let resultUserRooms: Object[] = [];
        fetchedUserRooms.forEach((room) => {
          if (!resultRooms.find((r) => r["id"] === room.room_id)) {
            resultRooms.push({ name: room.room_name, id: room.room_id, isPrivate: true }); // TODO change id to name
          }
          resultUserRooms.push(room);
        });
        setRooms(resultRooms);
        console.log(resultRooms);

        setUserRooms(resultUserRooms);
      }
    };
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (chosenRoom !== null && chosenRoom !== undefined) {
      setTopIcon(rooms.find((room) => room.id === chosenRoom)?.isPrivate ? "lock" : "unlock");
    } else {
      setTopIcon("");
    }
  }, [chosenRoom]);

  console.log(topIcon, chosenRoom);

  return (
    <div className="flex-1 min-h-screen bg-white inline-flex justify-start items-start overflow-hidden">
      <div className="w-24 self-stretch inline-flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch p-4 inline-flex justify-center items-center gap-2.5">
          <div className="w-16 h-16 bg-white/0 flex justify-start items-center gap-2.5 overflow-hidden">
            <Logo />
          </div>
        </div>
        <div className="self-stretch flex-1 bg-[#6D66D2] flex flex-col justify-between items-center overflow-hidden">
          <div className="flex flex-col justify-start items-start">
            <div className="w-24 h-24 inline-flex justify-center items-center gap-2.5">
              <Icon
                name="chats"
                className="w-12 h-12 text-white"
                onClick={() => router.push("/dashboard")}
              />
            </div>
          </div>
          <div className="flex flex-col justify-start items-start">
            <div className="w-24 h-24 inline-flex justify-center items-center gap-2.5">
              <Icon
                name="settings"
                className="w-12 h-12 text-white"
                onClick={() => router.push("/ustawienia")}
              />
            </div>
            <div
              className="w-24 h-24 inline-flex justify-center items-center gap-2.5"
              onClick={() => {
                setChosenRoom(null);
                setRooms([]);
                logout();
                router.push("/logowanie");
              }}
            >
              <Icon name="logout" className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch h-24 px-4 bg-[#6D66D2] inline-flex justify-between items-center overflow-hidden">
          <div className="justify-start text-white text-4xl font-normal font-['Inter']">
            {/* <Icon name="lock" className="w-12 h-12 text-[#ACD266]" /> */}
            {/* <Icon name="settings" className="w-12 h-12 text-[#ACD266]" /> */}
            {/* <Icon name="avatar" className="w-12 h-12 text-[#ACD266]" /> */}
            {topIcon === "lock" && <Icon name="lock" className="w-12 h-12 text-[#ACD266]" />}
            {topIcon === "unlock" && <Icon name="unlock" className="w-12 h-12 text-[#ACD266]" />}
            {rooms.find((room) => room.id === chosenRoom)?.name}
          </div>
          <div
            className="flex justify-center items-center gap-2.5"
            onClick={() => {
              router.push("/profil");
            }}
          >
            <div className="justify-start text-white text-3xl font-normal font-['Inter']">
              {accessToken && jwt.decode(accessToken).sub}
            </div>
            <div className="w-8 h-8 relative bg-black/0 overflow-hidden">
              <Icon name="avatar" className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

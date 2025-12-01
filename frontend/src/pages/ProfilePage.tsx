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
  const [leftAside, setLeftAside] = useState<string>("ROOMS");
  const [workspace, setWorkspace] = useState<string>("ROOM_CHAT");
  const [rightAside, setRightAside] = useState<string>("ROOM_USERS");

  const [rooms, setRooms] = useState<Object[]>([]); // TODO change to rooms passed from layout
  const [chosenRoom, setChosenRoom] = useState<number | null>(null); // TODO change to chosenRoom passed from layout

  const [accessToken, setAccessToken] = useState<string>("");
  const [messages, setMessages] = useState<Object[]>([]);
  const [members, setMembers] = useState<Object[]>([]);

  useEffect(() => { 
    const fetchCookie = async () => {
      const cookie = await getCookie("access_token");
      if (!cookie) {
        router.push("/logowanie");
      } else {
        setAccessToken(cookie);
        console.log("username:", jwt.decode(cookie).sub);
      }
    };
    fetchCookie();

    const fetchData = async () => {
      if (rooms.length === 0) {
        const fetchedRooms = await getPublicRooms();
        let resultRooms: Object[] = [];

        fetchedRooms.forEach((room) => {
          resultRooms.push({ name: room.room_name, id: room.room_id });
        });
        setRooms(resultRooms);
        if (resultRooms.length > 0) {
          setChosenRoom(resultRooms[0].id);
        }
      }

      if (chosenRoom !== null) {
        const fetchedMessages = await fetchChatMessages(chosenRoom);
        const fetchedMembers = await getChatMembers(chosenRoom);

        let resultMessages: Object[] = [];
        fetchedMessages.forEach((fetchedMessage) => {
          const dateTime = new Date(fetchedMessage.create_date);
          const formattedDate = new Intl.DateTimeFormat("pl-PL", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(dateTime);

          const formattedTime = new Intl.DateTimeFormat("pl-PL", {
            hour: "numeric",
            minute: "numeric",
          }).format(dateTime);

          resultMessages.push({
            author: fetchedMessage.user_name,
            content: fetchedMessage.message,
            date: `${formattedDate}`,
            time: `${formattedTime}`,
          });
        });

        let resultMembers: Object[] = [];
        fetchedMembers.forEach((fetchedMember) => {
          resultMembers.push({
            username: fetchedMember.user_name,
          });
        });

        setMessages(resultMessages);
        setMembers(resultMembers);
      }
    };

    fetchData();
  }, [chosenRoom]);

  // TODO remove
  // const rooms = [{ name: "Public room 1" }, { name: "Public room 2" }, { name: "Public room 3" }];

  // const messages = [
  //   {
  //     author: "My name",
  //     content: "Message dsaf sda fsdaf sadf sdaf sfda",
  //     date: "07.05.25",
  //     time: "14:21",
  //   },
  //   {
  //     author: "My name",
  //     content: "Message dsaf sda fsdaf sadf sdaf sa",
  //     date: "07.05.25",
  //     time: "14:22",
  //   },
  //   {
  //     author: "My name",
  //     content: "Message dsaf sda fsdaf sadf sdaf sa",
  //     date: "07.05.25",
  //     time: "14:23",
  //   },
  //   {
  //     author: "My name",
  //     content: "Message dsaf sda fsdaf sadf sdaf sa",
  //     date: "07.05.25",
  //     time: "14:24",
  //   },
  //   {
  //     author: "My name",
  //     content: "Message dsaf sda fsdaf sadf sdaf sa",
  //     date: "07.05.25",
  //     time: "14:25",
  //   },
  // ];
  return (
    <div className="self-stretch p-16 inline-flex flex-col justify-start items-start gap-32 overflow-hidden">
    <div className="self-stretch inline-flex justify-start items-start gap-8 overflow-hidden">
        <Icon name="avatar" className="w-24 h-24 text-white" />
        <div className="inline-flex flex-col justify-start items-start">
            <div className="inline-flex justify-start items-end gap-4">
                <div className="justify-start text-indigo-500 text-6xl font-bold font-['Inter']">DawLip</div>
            </div>
            <div className="justify-start text-neutral-400 text-4xl font-normal font-['Inter']">Dołączył: 23.11.2025</div>
        </div>
    </div>
    <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-center items-center gap-4">
            <div className="inline-flex justify-start items-start gap-32">
                <div className="inline-flex flex-col justify-start items-center">
                    <Icon name="chats" className="w-48 h-48 text-[#ACD266]" />
                    <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">159</div>
                </div>
            </div>
            <div className="justify-start text-stone-500 text-6xl font-bold font-['Inter']">Wiadomości</div>
        </div>
        <div className="inline-flex flex-col justify-center items-center gap-4">
            <div className="inline-flex justify-start items-start gap-32">
                <div className="inline-flex flex-col justify-start items-center">
                    <Icon name="lock" className="w-40 h-40 text-[#ACD266]" />
                    <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">4</div>
                </div>
                <div className="inline-flex flex-col justify-start items-center">
                    <Icon name="unlock" className="w-40 h-40 text-[#ACD266]" />
                    <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">7</div>
                </div>
            </div>
            <div className="justify-start text-stone-500 text-6xl font-bold font-['Inter']">Utworzone pokoje</div>
        </div>
        <div className="inline-flex flex-col justify-center items-center gap-4">
            <div className="inline-flex justify-start items-start gap-32">
                <div className="inline-flex flex-col justify-start items-center">
                    <Icon name="lock" className="w-40 h-40 text-[#ACD266]" />
                    <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">12</div>
                </div>
                <div className="inline-flex flex-col justify-start items-center">
                    <Icon name="unlock" className="w-40 h-40 text-[#ACD266]" />
                    <div className="justify-start text-indigo-500 text-9xl font-bold font-['Inter']">9</div>
                </div>
            </div>
            <div className="justify-start text-stone-500 text-6xl font-bold font-['Inter']">Członek pokoi</div>
        </div>
    </div>
</div>
  );
}

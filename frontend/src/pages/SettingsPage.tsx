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
    <div className="flex-col">
      <div className="p-16 flex-col gap-8">
        <TextInput
            label="Login"
            placeholder="Wpisz nowy login"
            value={""}
            setValue={() => {}}
          />
          <Button
            label="Zmień login"
            onClick={() => {
            }}
          />
      </div>

      <div className="p-16 flex-col gap-8">
        <TextInput label="Hasło" placeholder="Wpisz hasło" value={""} setValue={() => {}} />
        <TextInput label="Nowe hasło" placeholder="Wpisz nowe hasło" value={""} setValue={() => {}} />
        <TextInput label="Powtórz nowe hasło" placeholder="Powtórz nowe hasło" value={""} setValue={() => {}} />
          <Button
            label="Zmień hasło"
            onClick={() => {
            }}
          />
        </div>
          
        </div>
  );
}

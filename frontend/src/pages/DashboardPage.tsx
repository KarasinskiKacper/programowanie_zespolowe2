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
    <div className="self-stretch flex-1 inline-flex justify-start items-start overflow-hidden">
      <LeftAside
        aside={leftAside}
        setChosenRoom={setChosenRoom}
        payload={{ rooms, setWorkspace }}
      />
      <Workspace workspace={workspace} payload={{ messages, setWorkspace }} />
      <RightAside aside={rightAside} payload={{ members }} />
    </div>
  );
}
const LeftAside = ({
  aside,
  setChosenRoom,
  payload,
}: {
  aside: string;
  setChosenRoom: any;
  payload?: any;
}) => {
  if (aside === "ROOMS")
    return (
      <div className="w-80 self-stretch p-4 border-r-2 border-[#6D66D2] inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
        <Button label="Nowy pokój" onClick={() => payload.setWorkspace("CREATE_ROOM")} size="small" />
        <Button
          label="Dołącz do pokoju"
          onClick={() => {
            payload.setWorkspace("JOIN_ROOM");
          }}
          type="outline"
          size="small"
        />
        <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="justify-start text-[#6D66D2] text-xl font-bold font-['Inter']">
              Pokoje publiczne
            </div>
            <div className="self-stretch pl-4 flex flex-col justify-start items-start gap-2">
              {payload.rooms.map((room) => (
                <RoomItem
                  key={room.name}
                  name={room.name}
                  onClick={() => {
                    setChosenRoom(room.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="self-stretch p-2 outline outline-2 outline-offset-[-2px] outline-[#6D66D2] inline-flex justify-between items-center overflow-hidden">
          <input type="text" placeholder="Szukaj..." />
          <Icon name="loop" className="w-8 h-8 text-[#6D66D2]" />
        </div>
      </div>
    );
};
const Workspace = ({
  workspace,
  disable = false,
  payload,
}: {
  workspace: string;
  disable?: boolean;
  payload?: any;
}) => {
  const messages = payload?.messages || [];

  if (disable) return null;
  if (workspace === "ROOM_CHAT")
    return (
      <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch flex-1 flex flex-col justify-end items-start">
          {messages.map((message, index) => (
            <Message
              key={`${message.author}-${message.date}-${message.time}`}
              author={message.author}
              content={message.content}
              date={message.date}
              time={message.time}
            />
          ))}
        </div>
        <div className="self-stretch">
          <div className="p-6">
            <Icon name="edit" className="w-12 h-12 text-[#6D66D2] " onClick={() => {
              payload.setWorkspace("ROOM_SETTINGS");
            }} />
          </div>
          
          <div className="self-stretch flex-1 p-4 flex flex-col justify-start items-start overflow-hidden">
          <div className="self-stretch outline outline-2 outline-offset-[-2px] outline-[#6D66D2] inline-flex justify-between items-center overflow-hidden">
            <input
              type="text"
              className="flex-1 px-4 flex justify-center items-center gap-2.5 text-2xl"
              placeholder="Napisz coś..."
            />
            <div className="w-16 h-16 bg-[#6D66D2] flex justify-center items-center gap-2.5">
              <Icon name="play" className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  if (workspace === "JOIN_ROOM")
    return (
      <div className="flex-1 self-stretch  inline-flex flex-col justify-center items-center gap-8 overflow-hidden">
        <div className="p-16 bg-white  outline-4  outline-[#6D66D2] flex flex-col justify-start items-start gap-8">
          <TextInput
            label="Nazwa pokoju"
            placeholder="Wpisz nazwę pokoju"
            value={""}
            setValue={() => {}}
          />
          <TextInput label="Hasło" placeholder="Wpisz hasło" value={""} setValue={() => {}} />
          <Button
            label="Wejdź"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            color="secondary"
          />
          <Button
            label="Anuluj"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            type="outline"
          />
        </div>
      </div>
    );
    if (workspace === "CREATE_ROOM")
    return (
      <div className="flex-1 self-stretch  inline-flex flex-col justify-center items-center gap-8 overflow-hidden">
        <div className="p-16 bg-white  outline-4  outline-[#6D66D2] flex flex-col justify-start items-start gap-8">
          <TextInput
            label="Nazwa pokoju"
            placeholder="Wpisz nazwę pokoju"
            value={""}
            setValue={() => {}}
          />
          <TextInput label="Hasło" placeholder="Wpisz hasło" value={""} setValue={() => {}} />
          <TextInput label="Powtórz hasło" placeholder="Powtórz hasło" value={""} setValue={() => {}} />
            <div>
              <input type="checkbox" className="h-8 w-8 border-4 appearance-none border-[#6D66D2] checked:bg-[#6D66D2] checked:border-transparent" />
              <label className="ml-4 justify-start text-black text-2xl font-normal font-['Inter']">Prywatny pokój</label>
            </div>
          
          <Button
            label="Utwórz"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            color="secondary"
          />
          <Button
            label="Anuluj"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            type="outline"
          />
        </div>
      </div>
    );
    if (workspace === "ROOM_SETTINGS")
    return (
      <div className="flex-1 self-stretch  inline-flex flex-col justify-center items-center gap-8 overflow-hidden">
        <div className="p-16 bg-white  outline-4  outline-[#6D66D2] flex flex-col justify-start items-start gap-8">
          <TextInput
            label="Nazwa pokoju"
            placeholder="Wpisz nazwę pokoju"
            value={""}
            setValue={() => {}}
          />
          <TextInput label="Hasło" placeholder="Wpisz hasło" value={""} setValue={() => {}} />
          <TextInput label="Powtórz hasło" placeholder="Powtórz hasło" value={""} setValue={() => {}} />
            <div>
              <input type="checkbox" className="h-8 w-8 border-4 appearance-none border-[#6D66D2] checked:bg-[#6D66D2] checked:border-transparent" />
              <label className="ml-4 justify-start text-black text-2xl font-normal font-['Inter']">Prywatny pokój</label>
            </div>
          
          <Button
            label="Edytuj"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            color="secondary"
          />
          <Button
            label="Anuluj"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            type="outline"
          />
          <Button
            label="Usuń pokój"
            onClick={() => {
              payload.setWorkspace("ROOM_CHAT");
            }}
            type="outline"
            className="outline-[#F35454]"
            classNameT="text-red-600"
          />
        </div>
      </div>
    );
  return null;
};
const RightAside = ({
  aside,
  disable = false,
  payload,
}: {
  aside: string;
  disable?: boolean;
  payload?: any;
}) => {
  const members = payload?.members || [];
  if (disable) return null;
  if (aside === "ROOM_USERS")
    return (
      <div className="w-80 self-stretch p-4 border-l-2 border-[#6D66D2] inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
        <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-8">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="justify-start text-[#6D66D2] text-xl font-bold font-['Inter']">
              Członkowie
            </div>
            <div className="self-stretch pl-4 flex flex-col justify-start items-start gap-2">
              {members.map((member, index) => (
                <div
                  key={index}
                  className=" self-stretch text-black text-xl font-light font-['Inter']"
                >
                  <div className="flex-1 justify-start items-center gap-2">
                    <div className="h-4 w-4 bg-[#1bb33c] rounded-full"></div>
                  {member.username}
                  </div>
                  <div className="h-8 w-4 items-center"><div className="h-1 w-4 bg-[#ACD266] rounded-full"></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  return null;
};

const RoomItem = ({ name, onClick }: { name: string; onClick: () => void }) => {
    return (
        <div
            className="self-stretch inline-flex justify-between items-center hover:bg-black/5 hover:cursor-pointer"
            onClick={onClick}
        >
            <div className="justify-start text-black text-xl font-light font-['Inter']">
                {name}
            </div>
            <Icon name="play" className="w-4 h-4 text-[#ACD266]" />
        </div>
    );
};

const Message = ({
    author,
    time,
    date,
    content,
}: {
    author: string;
    time: string;
    date: string;
    content: string;
}) => {
    return (
        <div className="self-stretch p-4 inline-flex justify-start items-start gap-4 overflow-hidden">
            <div className="w-16 h-16 bg-[#ACD266] rounded-[32px] flex justify-center items-center gap-2.5 overflow-hidden">
                <Icon name="avatar" className="w-16 h-16 text-[#6D66D2]" />
            </div>
            <div className="inline-flex flex-col justify-start items-start">
                <div className="inline-flex justify-start items-center gap-4">
                    <div className="justify-start text-[#6D66D2] text-2xl font-bold font-['Inter']">
                        {author}
                    </div>
                    <div className="justify-start text-stone-500 text-xl font-normal font-['Inter']">
                        {date}, {time}
                    </div>
                </div>
                <div className="justify-start text-slate-900 text-2xl font-normal font-['Inter']">
                    {content}
                </div>
            </div>
        </div>
    );
};

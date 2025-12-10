"use client";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import TextInput from "@/components/TextInput";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";

import { useRooms } from "../components/context/RoomContext";
import useInterval from "@/components/useInterval";
import { socket } from "../socket";
import { io } from "socket.io-client";

import { getCookie } from "../app/actions";
import {
  getChatMessages,
  getChatMembers,
  joinPublicRoom,
  createRoomRequest,
  joinPrivateRoom,
  getPublicRooms,
  getUserRooms,
  getOnlineUsers,
  kickUser,
  leaveRoom,
  updateRoom,
  deleteRoom,
} from "../auth/lib";
import jwt from "jsonwebtoken";

/**
 * Retrieves a list of all chat messages in a given room.
 * @param {number} roomId The ID of the room to retrieve the chat messages from.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each containing information about a chat message.
 */
const fetchChatMessages = async (roomId: number) => {
  const fetchedChatMessages = await getChatMessages(roomId);
  return fetchedChatMessages;
};

export default function Page() {
  const router = useRouter();
  const [leftAside, setLeftAside] = useState<string>("ROOMS");
  const [workspace, setWorkspace] = useState<string>("ROOM_CHAT");
  const [rightAside, setRightAside] = useState<string>("ROOM_USERS");

  const {
    rooms,
    setRooms,
    chosenRoom,
    setChosenRoom,
    userRooms,
    setUserRooms,
    isReFetchNeeded,
    setIsReFetchNeeded,
  } = useRooms();

  const [shownRooms, setShownRooms] = useState<Object[]>(rooms);
  const [shownRoomsSearch, setShownRoomsSearch] = useState<string>("");

  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [accessToken, setAccessToken] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Object[]>([]);
  const [members, setMembers] = useState<Object[]>([]);

  const [joinRoomName, setJoinRoomName] = useState("");
  const [joinRoomNameError, setJoinRoomNameError] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [joinRoomPasswordError, setJoinRoomPasswordError] = useState("");

  const [joinPrivateRoomName, setJoinPrivateRoomName] = useState("");
  const [joinPrivateRoomNameError, setJoinPrivateRoomNameError] = useState("");
  const [joinPrivateRoomPassword, setJoinPrivateRoomPassword] = useState("");
  const [joinPrivateRoomPasswordError, setJoinPrivateRoomPasswordError] = useState("");

  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [createRoomConfirmPassword, setCreateRoomConfirmPassword] = useState("");
  const [createRoomIsPrivate, setCreateRoomIsPrivate] = useState(false);

  const [createRoomNameError, setCreateRoomNameError] = useState("");
  const [createRoomPasswordError, setCreateRoomPasswordError] = useState("");
  const [createRoomConfirmPasswordError, setCreateRoomConfirmPasswordError] = useState("");

  const [updateRoomName, setUpdateRoomName] = useState("");
  const [updateRoomPassword, setUpdateRoomPassword] = useState("");
  const [updateRoomConfirmPassword, setUpdateRoomConfirmPassword] = useState("");
  const [updateRoomIsPrivate, setUpdateRoomIsPrivate] = useState(false);

  const [updateRoomNameError, setUpdateRoomNameError] = useState("");
  const [updateRoomPasswordError, setUpdateRoomPasswordError] = useState("");
  const [updateRoomConfirmPasswordError, setUpdateRoomConfirmPasswordError] = useState("");

  const [activeUsers, setActiveUsers] = useState([]);

/**
 * Joins a private room.
 * @returns {Promise<boolean>} A promise that resolves to true if the join room request was successful, false otherwise.
 */
  const sendJoinRoomRequest = async () => {
    console.log("sendJoinRoomRequest1");

    let isProperData = true;
    if (joinRoomPassword === "") {
      setJoinRoomPasswordError("Podaj klucz");
      isProperData = false;
    } else {
      setJoinRoomPasswordError("");
    }

    if (!isProperData) {
      return isProperData;
    }

    if (!isProperData) {
      return isProperData;
    }
    console.log("sendJoinRoomRequest2");

    console.log(accessToken, joinRoomPassword);

    const response = await joinPrivateRoom(accessToken, joinRoomPassword);
    console.log(response);
    console.log(response.status);

    if (response?.status === 200) {
      return true;
    } else {
      setJoinRoomPasswordError("Błędny klucz");
      return false;
    }
  };

/**
 * Retrieves a list of all public rooms available in the application and a list of all rooms the user is currently in.
 */
  const fetchRoomListData = async () => {
    const cookie = await getCookie("access_token");
    if (!cookie) {
      router.push("/logowanie");
    } else {
      setAccessToken(cookie);
    }

    const fetchedRooms = await getPublicRooms();
    // const fetchedUserRooms = [];
    const fetchedUserRooms = await getUserRooms(cookie);

    let resultRooms: Object[] = [];

    fetchedRooms.forEach((room) => {
      resultRooms.push({
        name: room.room_name,
        id: room.room_id,
        isPrivate: false,
        room_owner: room.room_owner,
      });
    });

    let resultUserRooms: Object[] = [];
    fetchedUserRooms.forEach((room) => {
      if (!resultRooms.find((r) => r["id"] === room.room_id)) {
        resultRooms.push({
          name: room.room_name,
          id: room.room_id,
          isPrivate: true,
          room_owner: room.room_owner,
        }); // TODO change id to name
      }
      resultUserRooms.push(room);
    });
    // console.log(`[Dashboard/fetchRoomListData/resultRooms] ${resultRooms}`);
    // console.log(`[Dashboard/fetchRoomListData/resultRooms] ${resultUserRooms}`);
    setRooms(resultRooms);

    setUserRooms(resultUserRooms);
  };

/**
 * Updates a room with the given properties.
 * If the user is not logged in, redirects them to the login page.
 * If the room name is empty, sets an error message.
 * If the room password or confirm password is empty and the room is private, sets an error message.
 * If the room password and confirm password do not match and the room is private, sets an error message.
 * If the chosen room is null or undefined, returns false.
 * @returns {Promise<boolean>} A promise that resolves to true if the update room request was successful, false otherwise.
 */
  const sendUpdateRoomRequest = async () => {
    let isProperData = true;
    if (updateRoomName === "") {
      setUpdateRoomNameError("Podaj nazwę pokoju");
      isProperData = false;
    } else {
      setUpdateRoomNameError("");
    }
    if (updateRoomPassword === "" && updateRoomIsPrivate) {
      setUpdateRoomPasswordError("Podaj klucz");
      isProperData = false;
    } else {
      setUpdateRoomPasswordError("");
    }
    if (updateRoomConfirmPassword === "" && updateRoomIsPrivate) {
      setUpdateRoomConfirmPasswordError("Potwierdź klucz");
      isProperData = false;
    } else {
      setUpdateRoomConfirmPasswordError("");
    }

    if (!isProperData) {
      return isProperData;
    }

    if (updateRoomPassword !== updateRoomConfirmPassword && updateRoomIsPrivate) {
      setUpdateRoomConfirmPasswordError("Klucze nie zgadzają się");
      isProperData = false;
    } else {
      setUpdateRoomConfirmPasswordError("");
    }

    if (!isProperData) {
      return isProperData;
    }

    if (chosenRoom === null || chosenRoom === undefined) return false;
    console.log(updateRoomIsPrivate);

    const response = await updateRoom(
      accessToken,
      chosenRoom,
      updateRoomPassword,
      updateRoomName,
      updateRoomIsPrivate
    );

    if (response?.message === "Room edited successfully") return true;
    else {
      setUpdateRoomPasswordError("Błędny klucz");
      return false;
    }
  };

/**
 * Creates a room with the given properties.
 * If the user is not logged in, redirects them to the login page.
 * If the room name is empty, sets an error message.
 * If the room password or confirm password is empty and the room is private, sets an error message.
 * If the room password and confirm password do not match and the room is private, sets an error message.
 * If the room creation request was successful, returns true, false otherwise.
 * @returns {Promise<boolean>} A promise that resolves to true if the room creation request was successful, false otherwise.
 */
  const sendCreateRoomRequest = async () => {
    let isProperData = true;
    if (createRoomName === "") {
      setCreateRoomNameError("Podaj nazwę pokoju");
      isProperData = false;
    } else {
      setCreateRoomNameError("");
    }
    if (createRoomPassword === "" && createRoomIsPrivate) {
      setCreateRoomPasswordError("Podaj klucz");
      isProperData = false;
    } else {
      setCreateRoomPasswordError("");
    }
    if (createRoomConfirmPassword === "" && createRoomIsPrivate) {
      setCreateRoomConfirmPasswordError("Potwierdź klucz");
      isProperData = false;
    } else {
      setCreateRoomConfirmPasswordError("");
    }

    if (!isProperData) {
      return isProperData;
    }

    if (createRoomPassword !== createRoomConfirmPassword && createRoomIsPrivate) {
      setCreateRoomConfirmPasswordError("Klucze nie zgadzają się");
      isProperData = false;
    } else {
      setCreateRoomConfirmPasswordError("");
    }

    if (!isProperData) {
      return isProperData;
    }

    const response = await createRoomRequest(
      accessToken,
      createRoomName,
      createRoomIsPrivate,
      createRoomPassword
    );

    if (response?.message === "Room created successfully") return true;
    else {
      setCreateRoomPasswordError("Błędny klucz");
      return false;
    }
  };

/**
 * Retrieves the access token cookie and sets it in the state if found.
 * If the cookie is not found, redirects the user to the login page.
 * @returns {Promise<string | undefined>} A promise that resolves to the access token cookie if found, or undefined if not found.
 */
  const fetchCookie = async () => {
    const cookie = await getCookie("access_token");
    if (!cookie) {
      router.push("/logowanie");
    } else {
      setAccessToken(cookie);
      return cookie;
    }
  };

/**
 * Retrieves the chat messages of the chosen room and sets them in the state.
 * If the chosen room is null or undefined, does nothing.
 * @returns {Promise<void>} A promise that resolves when the messages have been fetched and set in the state.
 */
  const fetchMessages = async () => {
    if (chosenRoom !== null && chosenRoom !== undefined) {
      const fetchedMessages = await fetchChatMessages(chosenRoom);
      let resultMessages: Object[] = [];
      fetchedMessages.forEach((fetchedMessage) => {
        const dateTime = new Date(fetchedMessage.create_date);
        dateTime.setHours(dateTime.getHours() - 1);
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

      setMessages(resultMessages);
    }
  };

/**
 * Retrieves the members of the chosen room and sets them in the state.
 * If the chosen room is null or undefined, does nothing.
 * For each member, the following information is retrieved and stored in the state:
 *   - username: the username of the member
 *   - kickable: whether the current user can kick the member from the room
 *   - leaveable: whether the current user can leave the room
 *   - isOwner: whether the current user is the owner of the room
 * @returns {Promise<void>} A promise that resolves when the members have been fetched and set in the state.
 */
  const fetchMembers = async () => {
    if (chosenRoom !== null && chosenRoom !== undefined) {
      const fetchedMembers = await getChatMembers(chosenRoom);
      let resultMembers: Object[] = [];

      const token = accessToken ? accessToken : await fetchCookie();
      const username = jwt.decode(token).sub;
      const currentRooms = rooms ? rooms : await getUserRooms(username);

      const chosenRoomData = currentRooms.find((room) => room.id === chosenRoom);

      fetchedMembers.forEach((fetchedMember) => {
        resultMembers.push({
          username: fetchedMember.user_name,
          //qqqqqqqqq
          kickable: username === chosenRoomData.room_owner && username !== fetchedMember.user_name,
          leaveable: username !== chosenRoomData.room_owner && username === fetchedMember.user_name,
          isOwner: chosenRoomData.room_owner === fetchedMember.user_name,
        });
      });

      setMembers(resultMembers);
    }
  };

/**
 * Retrieves the data of the chosen room and sets it in the state.
 * If the chosen room is null or undefined, does nothing.
 * The data retrieved includes the chat messages of the room, the members of the room, and the active users in the room.
 * @returns {Promise<void>} A promise that resolves when the room data has been fetched and set in the state.
 */
  const fetchRoomData = async () => {
    await fetchMessages();
    await fetchMembers();
    setTimeout(async () => {
      const onlineUsers = await getOnlineUsers(accessToken);
      console.log(onlineUsers);
      setActiveUsers(onlineUsers);
    }, 200);
  };

/**
 * Sets the is connected state to true when the socket is connected.
 * This is a callback function for the socket.io 'connect' event.
 */
  const onConnect = () => {
    setIsConnected(true);
  };

/**
 * Called when the socket is disconnected. Sets the is connected state to false.
 */
  const onDisconnect = () => {
    console.log("onDisconnect");

    setIsConnected(false);
    // setChosenRoom(null);
  };

/**
 * Emits a watchdog event to the server with the user's name.
 * The event is emitted only when the user is connected and has a chosen room.
 * The watchdog event is used by the server to update the user's last seen timestamp.
 */
  function watchdog() {
    if (accessToken && chosenRoom) {
      const user_name = jwt.decode(accessToken).sub;
      socket.emit("watchdog", {
        user_name: user_name,
      });
    }
  }

/**
 * Joins a public room with the given ID.
 * If the room ID is different from the currently chosen room, it will first join the room and then leave the old room.
 * If the currently chosen room is null, it will simply join the room.
 * After joining the room, it will emit a 'join' event to the server with the room ID and the user's name.
 * @param {number} room_id The ID of the public room to join.
 */
  const joinRoom = async (room_id: number) => {
    const user_name = jwt.decode(accessToken).sub;
    if (chosenRoom !== room_id) {
      await joinPublicRoom(room_id, accessToken);
    }

    if (chosenRoom !== null && chosenRoom !== room_id) {
      socket.emit("leave", { room_id: chosenRoom, user_name });
    }

    if (room_id != null) {
      setChosenRoom(room_id);
    }

    socket.emit("join", { room_id, user_name });
  };

/**
 * Sends a message to the currently chosen room.
 * If the chosen room is null or the new message is empty, does nothing.
 * Otherwise, it emits a 'message' event to the server with the room ID, the user's name, and the message.
 * After sending the message, it resets the new message state to an empty string.
 */
  const sendMessage = () => {
    if (chosenRoom === null || newMessage === "") return;
    const user_name = jwt.decode(accessToken).sub;
    socket.emit("message", {
      room_id: chosenRoom,
      user_name,
      message: newMessage,
    });
    setNewMessage("");
  };

/**
 * Updates the messages state with a new message fetched from the socket.io.
 * @param {Object} fetchedMessage The message object fetched from the server, containing the user's name, the message, and the creation date.
 */
  const onNewMessage = (fetchedMessage) => {
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

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        author: fetchedMessage.user_name,
        content: fetchedMessage.message,
        date: `${formattedDate}`,
        time: `${formattedTime}`,
      },
    ]);
  };

/**
 * Listens for user activity changes in the application and updates the state of active users.
 * When a user activity change is detected, it fetches the list of online users and updates the state of active users after a 200ms delay.
 * @param {Object} data The object containing information about the user whose activity changed, including their username.
 */
  const onUserActivityChange = async (data) => {
    console.log(`${data.user_name} ActivityChange`);
    setTimeout(async () => {
      const onlineUsers = await getOnlineUsers(accessToken);
      console.log(onlineUsers);
      setActiveUsers(onlineUsers);
    }, 200);
  };

/**
 * Called when the user list is updated. Fetches the room data again to update the state with the new user list.
 * The room data is fetched again to update the state of active users in the currently chosen room.
 */
  const onUserListUpdated = () => {
    fetchRoomData();
  };

/**
 * Called when the room list is updated. Fetches the room list data again to update the state with the new room list.
 * The room list data is fetched again to update the state of public rooms and user rooms.
 */
  const onRoomListUpdated = () => {
    console.log("onRoomListUpdated");
    fetchRoomListData();
  };

  useInterval(
    () => {
      watchdog();
    },
    isConnected ? 1000 : null
  );

/**
 * Called when the user is kicked from a room.
 * If the user who was kicked is the currently logged in user, reloads the page.
 * Otherwise, fetches the room data again to update the state with the new user list.
 * @param {Object} data The object containing information about the user who was kicked, including their username.
 */
  const onUserKicked = (data) => {
    if (data.user_name === jwt.decode(accessToken).sub) {
      location.reload();
    } else {
      fetchRoomData();
    }
  };

  useEffect(() => {
    setShownRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    fetchCookie();
    if (chosenRoom !== null) {
      fetchRoomData();
    }
  }, [chosenRoom]);

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("new_message", onNewMessage);
    socket.on("disconnect", onDisconnect);

    socket.on("user_online", onUserActivityChange);
    socket.on("user_offline", onUserActivityChange);


    socket.on("user_list_updated", onUserListUpdated);
    socket.on("room_list_updated", onRoomListUpdated);
    socket.on("user_kicked", onUserKicked);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_message", onNewMessage);
      socket.off("user_online", onUserActivityChange);
      socket.off("user_offline", onUserActivityChange);
      socket.off("user_list_updated", onUserListUpdated);
      socket.off("room_list_updated", onRoomListUpdated);
      socket.off("user_kicked", onUserKicked);
    };
  }, [chosenRoom]);

  useEffect(() => {
    if (
      !rooms.find((room) => room.id === chosenRoom)?.name &&
      (messages.length > 0 || members.length > 0)
    ) {
      location.reload();
    }
    console.log(chosenRoom, messages.length, members.length);
  }, [chosenRoom, rooms]);

  return (
    <div className="self-stretch flex-1 inline-flex justify-start items-start overflow-hidden">
      <LeftAside
        aside={leftAside}
        joinRoom={joinRoom}
        payload={{
          rooms,
          shownRooms,
          setWorkspace,
          shownRoomsSearch,
          setShownRoomsSearch,
          setShownRooms,
        }}
      />
      <Workspace
        workspace={workspace}
        payload={{
          messages,
          setWorkspace,
          newMessage,
          setNewMessage,
          sendMessage,
          chosenRoom,

          createRoomName,
          createRoomPassword,
          createRoomConfirmPassword,
          createRoomIsPrivate,
          setCreateRoomName,
          setCreateRoomPassword,
          setCreateRoomConfirmPassword,
          setCreateRoomIsPrivate,
          sendCreateRoomRequest,
          createRoomNameError,
          createRoomPasswordError,
          createRoomConfirmPasswordError,
          setCreateRoomNameError,
          setCreateRoomPasswordError,
          setCreateRoomConfirmPasswordError,

          setIsReFetchNeeded,
          joinRoomName,
          joinRoomPassword,
          joinRoomNameError,
          joinRoomPasswordError,
          setJoinRoomName,
          setJoinRoomPassword,
          setJoinRoomNameError,
          setJoinRoomPasswordError,
          sendJoinRoomRequest,

          joinPrivateRoomName,
          setJoinPrivateRoomName,
          joinPrivateRoomNameError,
          setJoinPrivateRoomNameError,
          joinPrivateRoomPassword,
          setJoinPrivateRoomPassword,
          joinPrivateRoomPasswordError,
          setJoinPrivateRoomPasswordError,

          updateRoomName,
          updateRoomPassword,
          updateRoomConfirmPassword,
          updateRoomIsPrivate,
          updateRoomNameError,
          updateRoomPasswordError,
          updateRoomConfirmPasswordError,

          setUpdateRoomName,
          setUpdateRoomPassword,
          setUpdateRoomConfirmPassword,
          setUpdateRoomIsPrivate,
          setUpdateRoomNameError,
          setUpdateRoomPasswordError,
          setUpdateRoomConfirmPasswordError,
          sendUpdateRoomRequest,

          members,
          username: jwt.decode(accessToken)?.sub,
          accessToken,
        }}
      />
      <RightAside aside={rightAside} payload={{ members, activeUsers, accessToken, chosenRoom }} />
    </div>
  );
}

const LeftAside = ({
  aside,
  joinRoom,
  payload,
}: {
  aside: string;
  joinRoom: any;
  payload?: any;
}) => {
  return (
    <div className="w-80 self-stretch p-4 border-r-2 border-[#6D66D2] inline-flex flex-col justify-start items-start gap-4 overflow-hidden">
      <Button
        label="Nowy pokój"
        onClick={() => {
          payload.setWorkspace("CREATE_ROOM");
        }}
        size="small"
      />
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
            {payload.shownRooms?.map((room, index) => {
              if (!room.isPrivate) {
                return (
                  <RoomItem
                    key={index}
                    name={room.name}
                    onClick={() => {
                      joinRoom(room.id);
                    }}
                  />
                );
              }
            })}
          </div>
          <div className="justify-start text-[#6D66D2] text-xl font-bold font-['Inter']">
            Pokoje prywatne
          </div>
          <div className="self-stretch pl-4 flex flex-col justify-start items-start gap-2">
            {payload.shownRooms?.map((room, index) => {
              if (room.isPrivate) {
                return (
                  <RoomItem
                    key={index}
                    name={room.name}
                    onClick={() => {
                      joinRoom(room.id);
                    }}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
      <div className="self-stretch p-2 outline outline-2 outline-offset-[-2px] outline-[#6D66D2] inline-flex justify-between items-center overflow-hidden">
        <input
          type="text"
          placeholder="Szukaj..."
          onChange={(e) => {
            if (e.target.value === "") {
              payload.setShownRooms(payload.rooms);
            } else {
              const lowerSearch = e.target.value.toLowerCase();
              const filteredRooms = payload.rooms.filter((room) =>
                room.name.toLowerCase().includes(lowerSearch)
              );
              payload.setShownRooms(filteredRooms);
            }
          }}
        />
        <div className="">
          <Icon name="loop" className="w-6 h-6 text-[#6D66D2] hover:text-[#ACD266]" />
        </div>
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

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (disable) return null;
  if (workspace === "ROOM_CHAT")
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="self-stretch h-[calc(100vh-192px)] overflow-y-scroll" ref={containerRef}>
          <div className="self-stretch flex-1 flex flex-col">
            {messages.map((message, index) => (
              <Message
                key={index}
                author={message.author}
                content={message.content}
                date={message.date}
                time={message.time}
              />
            ))}
          </div>
        </div>
        <div className="self-stretch">
          <div className="pl-6 pr-2 pt-6 pb-6">
            {payload.members.find((member) => member.isOwner)?.username === payload.username && (
              <Icon
                name="edit"
                className="w-12 h-12 text-[#6D66D2] "
                onClick={() => {
                  payload.setWorkspace("ROOM_SETTINGS");
                }}
              />
            )}
          </div>
          <div className="self-stretch flex-1 p-4 flex flex-col justify-start items-start overflow-hidden">
            <div className="self-stretch outline outline-2 outline-offset-[-2px] outline-[#6D66D2] inline-flex justify-between items-center overflow-hidden">
              <input
                type="text"
                className="flex-1 px-4 flex justify-center items-center gap-2.5 text-2xl"
                placeholder={
                  payload.chosenRoom !== null ? "Napisz coś..." : "Dołącz do pokoju, aby pisać..."
                }
                value={payload.newMessage}
                maxLength={999}
                onChange={(e) => payload.setNewMessage(e.target.value)}
                disabled={payload.chosenRoom === null}
              />
              <div
                className="w-16 h-16 bg-[#6D66D2] flex justify-center items-center gap-2.5 cursor-pointer hover:bg-[#ACD266]"
                onClick={() => payload.sendMessage()}
              >
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
            label="Klucz"
            placeholder="Wpisz Klucz"
            value={payload.joinRoomPassword}
            setValue={payload.setJoinRoomPassword}
            error={payload.joinRoomPasswordError}
            isPassword
          />
          <Button
            label="Wejdź"
            onClick={async () => {
              if (await payload.sendJoinRoomRequest()) {
                location.reload();
              }
            }}
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
            value={payload.createRoomName}
            setValue={payload.setCreateRoomName}
            error={payload.createRoomNameError}
          />
          <TextInput
            label="Klucz (dla pokoju prywatnego)"
            placeholder="Wpisz klucz"
            value={payload.createRoomPassword}
            setValue={payload.setCreateRoomPassword}
            disabled={!payload.createRoomIsPrivate}
            error={payload.createRoomPasswordError}
            isPassword
          />
          <TextInput
            label="Powtórz klucz (dla pokoju prywatnego)"
            placeholder="Powtórz klucz"
            value={payload.createRoomConfirmPassword}
            setValue={payload.setCreateRoomConfirmPassword}
            disabled={!payload.createRoomIsPrivate}
            error={payload.createRoomConfirmPasswordError}
            isPassword
          />
          <div>
            <input
              onChange={() => {
                if (payload.createRoomIsPrivate) {
                  payload.setCreateRoomPassword("");
                  payload.setCreateRoomConfirmPassword("");
                }
                payload.setCreateRoomIsPrivate(!payload.createRoomIsPrivate);
              }}
              checked={payload.createRoomIsPrivate}
              type="checkbox"
              className="h-8 w-8 border-4 accent-[#6D66D2] border-[#6D66D2] checked:bg-[#6D66D2] checked:border-transparent"
            />
            <label className="ml-4 justify-start text-black text-2xl font-normal font-['Inter']">
              Prywatny pokój
            </label>
          </div>

          <Button
            label="Utwórz"
            onClick={async () => {
              if (await payload.sendCreateRoomRequest()) {
                location.reload();
              }
            }}
            color="secondary"
          />
          <Button
            label="Anuluj"
            onClick={() => {
              payload.setCreateRoomName("");
              payload.setCreateRoomPassword("");
              payload.setCreateRoomConfirmPassword("");
              payload.setCreateRoomIsPrivate(false);
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
            value={payload.updateRoomName}
            setValue={payload.setUpdateRoomName}
            error={payload.updateRoomNameError}
          />
          <TextInput
            label="Hasło"
            placeholder="Wpisz hasło"
            value={payload.updateRoomPassword}
            setValue={payload.setUpdateRoomPassword}
            disabled={!payload.updateRoomIsPrivate}
            error={payload.updateRoomPasswordError}
            isPassword
          />
          <TextInput
            label="Powtórz hasło"
            placeholder="Powtórz hasło"
            value={payload.updateRoomConfirmPassword}
            setValue={payload.setUpdateRoomConfirmPassword}
            disabled={!payload.updateRoomIsPrivate}
            error={payload.updateRoomConfirmPasswordError}
            isPassword
          />
          <div>
            <input
              type="checkbox"
              className="h-8 w-8 border-4 accent-[#6D66D2] border-[#6D66D2] checked:bg-[#6D66D2] checked:border-transparent"
              onChange={() => {
                if (payload.updateRoomIsPrivate) {
                  payload.setUpdateRoomPassword("");
                  payload.setUpdateRoomConfirmPassword("");
                }
                payload.setUpdateRoomIsPrivate(!payload.updateRoomIsPrivate);
              }}
              checked={payload.updateRoomIsPrivate}
            />
            <label className="ml-4 justify-start text-black text-2xl font-normal font-['Inter']">
              Prywatny pokój
            </label>
          </div>

          <Button
            label="Edytuj"
            onClick={async () => {
              if (await payload.sendUpdateRoomRequest()) {
                location.reload();
              }
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
            onClick={async () => {
              const res = await deleteRoom(payload.accessToken, payload.chosenRoom);
              console.log(res);

              if (res.status === 200) {
                location.reload();
              }
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
                  className="self-stretch text-black text-xl font-light font-['Inter'] "
                >
                  <div className="flex-1 justify-start items-center gap-2">
                    {jwt.decode(payload.accessToken).sub === member.username ||
                    (payload?.activeUsers &&
                      payload?.activeUsers?.find(
                        (activeUser) => activeUser === member.username
                      )) ? (
                      <div className="h-4 w-4 bg-[#1bb33c] rounded-full"></div>
                    ) : (
                      <div className="h-4 w-4 bg-[#ff0000] rounded-full"></div>
                    )}

                    {member.username}
                  </div>
                  <div className="h-8 w-4 items-center">
                    {member.leaveable && (
                      <div
                        className="h-1 w-4 bg-[#ACD266] rounded-full"
                        onClick={async () => {
                          await leaveRoom(payload.chosenRoom, payload.accessToken);
                          location.reload();
                        }}
                      ></div>
                    )}
                    {member.kickable && (
                      <div
                        className="h-1 w-4 bg-[#ACD266] rounded-full"
                        onClick={async () => {
                          await kickUser(payload.chosenRoom, payload.accessToken, member.username);
                        }}
                      ></div>
                    )}
                  </div>
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
      <div className="justify-start text-black text-xl font-light font-['Inter']">{name}</div>
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
    <div className="self-stretch p-4 gap-4">
      <div className="w-16 h-16 bg-[#ACD266] rounded-[32px] flex justify-center items-center gap-2.5">
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

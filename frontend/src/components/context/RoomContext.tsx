"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { getPublicRooms } from "../../auth/lib";

interface Room {
  id: number;
  name: string;
}

interface RoomsContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  chosenRoom: number | null;
  setChosenRoom: React.Dispatch<React.SetStateAction<number | null>>;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
};

export const RoomsProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [chosenRoom, setChosenRoom] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (rooms.length === 0) {
        const fetchedRooms = await getPublicRooms();
        let resultRooms: Object[] = [];

        fetchedRooms.forEach((room) => {
          resultRooms.push({ name: room.room_name, id: room.room_id });
        });
        setRooms(resultRooms);
      }
    };
    fetchData();
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, setRooms, chosenRoom, setChosenRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

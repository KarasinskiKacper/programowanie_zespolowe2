"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Room {
  id: number;
  name: string;
}

interface RoomsContextType {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  chosenRoom: number | null;
  setChosenRoom: React.Dispatch<React.SetStateAction<number | null>>;
  userRooms: Object[];
  setUserRooms: React.Dispatch<React.SetStateAction<Object[]>>;
  isReFetchNeeded: boolean;
  setIsReFetchNeeded: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [userRooms, setUserRooms] = useState<Object[]>([]);
  const [isReFetchNeeded, setIsReFetchNeeded] = useState<boolean>(false);

  
  console.log("🔄 RoomsProvider render, chosenRoom:", chosenRoom);

  useEffect(() => {
    console.log("🎯 chosenRoom changed:", chosenRoom);
  }, [chosenRoom]);

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        setRooms,
        chosenRoom,
        setChosenRoom,
        userRooms,
        setUserRooms,
        isReFetchNeeded,
        setIsReFetchNeeded,
      }}
    >
      {children}
    </RoomsContext.Provider>
  );
};

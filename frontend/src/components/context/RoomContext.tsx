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
  const [ userRooms, setUserRooms] = useState<Object[]>([]);


  return (
    <RoomsContext.Provider value={{ rooms, setRooms, chosenRoom, setChosenRoom, userRooms, setUserRooms}}>
      {children}
    </RoomsContext.Provider>
  );
};

"use client";

import InfoIcon from "@/assets/icons/InfoIcon";
import PlayIcon from "@/assets/icons/PlayIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import LogoutIcon from "@/assets/icons/LogoutIcon";
import ChatsIcon from "@/assets/icons/ChatsIcon";
import AvatarIcon from "@/assets/icons/AvatarIcon";
import LoopIcon from "@/assets/icons/LoopIcon";

const icons = {
  info: InfoIcon,
  play: PlayIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
  chats: ChatsIcon,
  avatar: AvatarIcon,
  loop: LoopIcon,
} as const;

type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  const SelectedIcon = icons[name];

  if (!SelectedIcon) return null;

  return (
    <SelectedIcon
      className={`text-[#6D66D2] ${className ?? ""}`}
    />
  );
};

export default Icon;

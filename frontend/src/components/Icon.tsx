"use client";

import InfoIcon from "@/assets/icons/InfoIcon";
import PlayIcon from "@/assets/icons/PlayIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import LogoutIcon from "@/assets/icons/LogoutIcon";
import ChatsIcon from "@/assets/icons/ChatsIcon";
import AvatarIcon from "@/assets/icons/AvatarIcon";
import LoopIcon from "@/assets/icons/LoopIcon";
import EditIcon from "@/assets/icons/EditIcon";
import LockIcon from "@/assets/icons/LockIcon";
import UnlockIcon from "@/assets/icons/UnlockIcon";

const icons = {
  info: InfoIcon,
  play: PlayIcon,
  settings: SettingsIcon,
  logout: LogoutIcon,
  chats: ChatsIcon,
  avatar: AvatarIcon,
  loop: LoopIcon,
  edit: EditIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
} as const;

type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  className?: string;
  onClick?: () => void;
};

const Icon = ({ name, className, onClick }: IconProps) => {
  const SelectedIcon = icons[name];

  if (!SelectedIcon) return null;

  return (
    <div onClick={onClick} className="cursor-pointer">
      <SelectedIcon
        className={`text-[#6D66D2] ${className ?? ""}`}
      />
    </div>
  );
};

export default Icon;

import Icon from "@/components/Icon";
import Logo from "@/components/Logo";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                    <Icon name="chats" className="w-12 h-12 text-white"/>
                </div>
            </div>
            <div className="flex flex-col justify-start items-start">
                <div className="w-24 h-24 inline-flex justify-center items-center gap-2.5">
                    <Icon name="settings" className="w-12 h-12 text-white"/>
                </div>
                <div className="w-24 h-24 inline-flex justify-center items-center gap-2.5">
                    <Icon name="logout" className="w-12 h-12 text-white"/>
                </div>
            </div>
        </div>
    </div>
    <div className="flex-1 self-stretch inline-flex flex-col justify-start items-start overflow-hidden">
        <div className="self-stretch h-24 px-4 bg-[#6D66D2] inline-flex justify-between items-center overflow-hidden">
            <div className="justify-start text-white text-4xl font-normal font-['Inter']">Room name</div>
            <div className="flex justify-center items-center gap-2.5">
                <div className="justify-start text-white text-3xl font-normal font-['Inter']">DawLip</div>
                <div className="w-8 h-8 relative bg-black/0 overflow-hidden">
                    <Icon name="avatar" className="w-8 h-8 text-white"/>
                </div>
            </div>
        </div>
        {children}
    </div>
</div>
  );
}

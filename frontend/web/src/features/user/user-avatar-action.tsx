import {useState} from 'react';
import {LogOut} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {UserAvatarProps} from "@/types";
import {Button} from "@/components/ui/button.tsx";
import {UserAvatar} from "@/features/user";


const UserAvatarAction = ({nameOfUser, onLogout, btnClassName}: UserAvatarProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                variant="ghost"
                className={cn("bg-transparent w-fit h-full", btnClassName)
                }>
                <UserAvatar
                    nameOfUser={nameOfUser}
                    className={"lg:w-full pl-4 lg:px-6"}
                />
            </Button>
            {open && (
                <div className={cn(
                    "absolute top-18 border-indigo-200 border w-60 rounded-xl shadow-lg z-30 p-4 bg-accent hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 transition-all ease-in-out",
                )}>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            setOpen(false);
                            /*double check if onLogout is really a function*/
                            if (typeof onLogout === 'function') {
                                onLogout();
                            }
                        }}
                    >
                        Logout <LogOut/>
                    </Button>
                </div>
            )}
        </>
    );
};

export default UserAvatarAction;

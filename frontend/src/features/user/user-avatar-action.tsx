import {useState} from 'react';
import {LogOut} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {UserAvatarProps} from "@/types";
import {Button} from "@/components/ui/common/button.tsx";
import {UserAvatar} from "@/features/user";

const UserAvatarAction = ({nameOfUser, onLogout, btnClassName}: UserAvatarProps) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                variant="ghost"
                className={cn("bg-transparent hover:bg-transparent w-fit h-full", btnClassName)
                }>
                <UserAvatar
                    nameOfUser={nameOfUser}
                />
            </Button>
            {open && (
                <Button
                    className="absolute top-18 shadow-lg z-30"
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
            )}
        </>
    );
};

export default UserAvatarAction;

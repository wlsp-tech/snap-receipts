import {cn} from "@/lib/utils.ts";


const UserAvatar = ({nameOfUser = "", className} : {nameOfUser: string; className?: string}) => {

    const initials = nameOfUser
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();

    return (
        <div className={cn("flex items-center gap-4", className)}>
            <div
                className="w-fit h-fit min-w-12 min-h-12 bg-indigo-500 text-white font-medium flex overflow-hidden
                        items-center justify-center rounded-full cursor-pointer select-none"
            >
                {initials}
            </div>
            <p className="text-sm font-medium hidden md:inline-block">{nameOfUser}</p>
        </div>
    )
}

export default UserAvatar;
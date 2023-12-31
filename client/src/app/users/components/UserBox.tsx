"use client"

import getSession from "@/app/actions/getSession";
import Avatar from "@/app/components/Avatar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
}
interface UserBoxProps{
    data: User
}
const UserBox: React.FC<UserBoxProps> = ({data}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession()

    const handleClick = useCallback(() => {
        setIsLoading(true);
        axios.post(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/conversation`, {
            userId: data.id,
            name: data.name
        },{headers:{"Authorization": `Bearer ${session.data?.user.accessToken}`}})
        .then((data)=> {
            console.log(data);
            router.push(`/conversations/${data.data.data.id}`)
        })
        .finally(() => setIsLoading(false))
    }, [data, router, session])
    return ( 
    <div
        onClick={handleClick}
        className="
            w-full
            relative
            flex
            items-center
            space-x-3
            bg-white
            p-3
            hover:bg-neutral-100
            rounded-lg
            transition
            cursor-pointer
        "
    >
        <Avatar user={data}/>
        <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
                <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-1
                    "
                >
                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-900
                        "
                    >
                        {data.name}
                    </p>
                </div>
            </div>
        </div>
    </div> 
    );
}

export default UserBox;
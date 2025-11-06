import React, {useEffect, useState} from "react";
import {userService} from "../services/api.js";
import {Dices} from "lucide-react";

const UserAvatar = ({ userInfo, size = 120, className = "", randomizeButton = false }) => {
    const [avatarUrl, setAvatarUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getUserAvatar = async () => {
            if (!userInfo) {
                setAvatarUrl("https://api.dicebear.com/9.x/fun-emoji/svg?seed=anonymous");
                return
            }

            console.log(userInfo)

            if (userInfo.profileUrl) {
                setAvatarUrl(userInfo.profileUrl);
            }
        };

        getUserAvatar();
    }, [userInfo]);

    const handleRandomize = async () => {
        setIsLoading(true)
        const response = await userService.randomizeUserAvatar(userInfo.email);

        if (!response){
            return
        }
        const newUrl = response.profileUrl
        setAvatarUrl(newUrl);

        setTimeout(() => setIsLoading(false), 600);
    };

    return (
        <div className="relative inline-block" style={{ width: size, height: size }}>
            {/* Avatar image */}
            <div
                className={`rounded-full overflow-hidden border-2 border-gray-200 shadow-md ${className}`}
                style={{ width: size, height: size }}
            >
                <img
                    src={avatarUrl}
                    alt="User avatar"
                />
            </div>

            {randomizeButton && (
                <>
                    {/* Randomize Button */}
                    <button
                        onClick={handleRandomize}
                        className="absolute -top-2 -right-2 p-2 text-white bg-gray-100 rounded-full hover:bg-gray-300 transition-all shadow-md hover:shadow-lg hover:scale-110"
                        disabled={isLoading}
                        title="Randomizar avatar"
                    >
                        <Dices
                            size={18}
                            color="black"
                            className={`${isLoading ? "animate-spin" : ""}`}
                        />
                    </button>
                </>
            )}


        </div>
    );

};

export default UserAvatar;

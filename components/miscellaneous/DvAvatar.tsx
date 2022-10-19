import Image from "next/image";
import Avatar from "boring-avatars";
import { SITE_COLORS } from "../../utils";

interface DvAvatarProps {
    imageUrl?: string;
    imageAlt?: string;
    name?: string;
    colors?: any;
    size?: number;
    variant?: "marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus" | undefined;
    imageSize?: {
        height: number | string;
        width: number | string;
    }
}

export function DvAvatar({
    imageUrl = "",
    imageAlt = "NFT Image",
    name,
    colors,
    size = 33,
    variant = "beam",
    imageSize = {
        height: 300,
        width: 300
    }
}: DvAvatarProps) {
    imageUrl = typeof imageUrl === "string" && imageUrl.trim() ? imageUrl.trim() : "";
    name = typeof name === "string" && name.trim() ? name.trim() : "No Name";
    colors = typeof colors === "object" && colors.length ? colors.filter((i: any) => i) : SITE_COLORS()

    return (
        <>
            {
                imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={imageAlt}
                        className="rounded-full border border-gray-100 shadow-sm"
                        {...imageSize}
                    />
                ) : (
                    <div className="circle-token">
                        <Avatar
                            size={size}
                            name={name}
                            variant={variant}
                            colors={colors}
                        />
                    </div>
                )
            }
            {/* <div className="absolute top-0 right-0 h-3 w-3 my-1 border-2 border-white rounded-full  bg-[#571a81] z-2"></div> */}
        </>
    )
}
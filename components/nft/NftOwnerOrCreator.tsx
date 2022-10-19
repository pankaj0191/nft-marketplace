import { DvAvatar } from "components/miscellaneous";
import { MetamaskContextResponse, useMetamaskcontext } from "context/Metamask";
import { subString } from "helpers";
import Link from "next/link";
import { FC } from "react";

interface NftOwnerOrCreatorProps {
    creatorOrOwner: any;
    text?: string;
}

const NftOwnerOrCreator: FC<NftOwnerOrCreatorProps> = ({ creatorOrOwner = {}, text = "CREATED BY" }) => {
    const { user, isAuthenticated }: MetamaskContextResponse = useMetamaskcontext();
    if (!Object.keys(creatorOrOwner).length) {
        return (
            <></>
        );
    }
    const isYou = creatorOrOwner?.id === user?.id;
    const username = isYou ? "you" : `@${subString(creatorOrOwner?.username)}`;
    const url = `/creators/${isYou ? user.id : creatorOrOwner.id}`;

    return (
        <>
            <div className="flex items-center justify-start my-5 singlepage_owner_list">
                <div className="relative w-12 h-12">
                    <DvAvatar colors={creatorOrOwner?.colors} name={creatorOrOwner?.name} imageUrl={creatorOrOwner?.image} size={40} />
                </div>
                <div className="myprofile_onsale_column_box_creator_owned ml-2">
                    <h6 className="text-[#571a81]"><Link href={url}>{username}</Link> </h6>
                    <h6 className="dark:text-[#fff] text-[#000] text-xs font-bold">{text}</h6>
                </div>
            </div>
        </>
    )
}

export default NftOwnerOrCreator;
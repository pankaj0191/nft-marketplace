import Image from 'next/image';


interface DVProps {
    url: string;
    alt: string;
    type: string;
    size?: {
        height: number | string;
        width: number | string;
    }
}

const DVAsset = ({
    url = "",
    alt = "NFT Asset ",
    type = "",
    size = {
        height: 300,
        width: 300
    }
}: DVProps) => {

    return (
        <>
            {
                type === "image" ? (
                    <Image
                        className="object-cover w-full rounded-lg	hover:rounded-3xl"
                        src={url}
                        alt={alt}
                        {...size}
                    />
                ) : (
                    <video
                        loop
                        style={{height:"290px",width:"300px"}}
                        controls
                        controlsList='nodownload'
                        preload="auto"
                    >
                        <source src={url}
                        />
                    </video>
                )
            }
        </>
    )
}

export default DVAsset

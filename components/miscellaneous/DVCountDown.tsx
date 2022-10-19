import { FC } from "react";
import Countdown from "react-countdown"


interface DVCountDownProps {
    date: string | number | Date;
    className?: string;
}

const DVCountDown: FC<DVCountDownProps> = (props) => {
    let { date = Date.now(), className = "col-span-2" } = props;
    date = new Date(date).getTime();

    return (
        <div>
            <Countdown
                date={date}
                renderer={renderer}
                className={className}
            />
        </div>
    )

}


// Renderer callback with condition
const renderer = ({ formatted, completed, props }: any) => {
    const { seconds, minutes, hours, days } = formatted;
    const { className } = props;

    if (completed) {
        return <div className="py-2 px-4 text-lg text-center text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
            <span className="font-medium">Auction Finished!</span>
        </div>
    }

    return <div className={`${className} flex  items-center justify-between auctioncountdown_div`}>
        <div className="auction_countdown text-center">
            <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">{days}</h6>
            <div className="dark:text-[#fff] text-black font-semibold text-xs flex">DAYS</div>
        </div>

        <div className="auction_countdown text-center">
            <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">{hours}</h6>
            <div className="dark:text-[#fff] text-black font-semibold text-xs flex"  >HOURS</div>
        </div>

        <div className="auction_countdown text-center">
            <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">{minutes}</h6>
            <div className="dark:text-[#fff] text-black font-semibold text-xs flex"  >MINUTES</div>
        </div>

        <div className="auction_countdown text-center">
            <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">{seconds}</h6>
            <div className="dark:text-[#fff] text-black font-semibold text-xs flex"  >SECONDS</div>
        </div>

    </div>
};

export default DVCountDown;
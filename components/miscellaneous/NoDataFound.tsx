import CircularProgress from '@mui/material/CircularProgress';
import { ReactNode } from 'react';

interface NoDataFoundProps {
    children?: ReactNode;
    isLoading?: Boolean;
}

export default function NoDataFound({ children, isLoading = false }: NoDataFoundProps) {

    return (
        <div className="nodatafound_row lg:pb-10 md:pb-10 pb-10 px-3">
            <p className="dark:text-[#fff] text-[#969696] text-left text-sm my-3">
                {
                    isLoading ? (
                        <>
                            <CircularProgress />
                        </>
                    ) : children ? children : "No Data Found"
                }
            </p>
        </div>
    )
}
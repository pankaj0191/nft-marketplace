import DialogContent from '@mui/material/DialogContent';
import { ReactNode } from 'react';

const ModalContent = ({ children, ...props }: any) => {

    return (

        <DialogContent dividers {...props}>
            {children}
        </DialogContent>
    )
}

export default ModalContent;
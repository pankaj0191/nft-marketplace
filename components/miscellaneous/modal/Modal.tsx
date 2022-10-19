import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const CustomModal = ({ children, ...props }: any) => {
    return (
        <BootstrapDialog {
            ...{
                ...props,
                className: `diamond-verse-modal${props.className ? " " + props.className : ""}`
            }
        }>
            {children}
        </BootstrapDialog>
    )
}

export default CustomModal;
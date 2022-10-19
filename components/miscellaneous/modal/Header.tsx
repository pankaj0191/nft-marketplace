import PropTypes from 'prop-types';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { AiOutlineClose } from 'react-icons/ai'
import { useState } from 'react';


const ModalHeader = (props: any) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {typeof onClose === "function" ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <AiOutlineClose />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

ModalHeader.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default ModalHeader;
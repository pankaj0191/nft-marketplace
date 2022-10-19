import DialogActions from '@mui/material/DialogActions';

const ModalFooter = ({ children, ...props }: any) => {

    return (

        <DialogActions {...props}>
            { children }
        </DialogActions>
    )
}

export default ModalFooter;
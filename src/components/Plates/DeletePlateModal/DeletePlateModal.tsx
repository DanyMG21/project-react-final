import {Plate} from "../../../types/Plate";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    deletePlateInProgressSelector,

} from "../../../store/selectors/plates";
import Modal from "../../Modal";
import {Delete} from "@mui/icons-material";
import {PlatesActions} from "../../../store/actions/plates";

interface DeletePlateModalProps {
    plate: Plate;
    open: boolean;
    onClose: () => void
}

const DeletePlateModal: React.FC<DeletePlateModalProps> = ({plate, open, onClose}) => {

    const [deleteAttempt, setDeleteAttempt] = useState(false)
    const deleteInProgress = useSelector(deletePlateInProgressSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!deleteAttempt) return
        if (!(deleteInProgress)) {
            onClose();
            setDeleteAttempt(false);
        }
    }, [deleteInProgress, deleteAttempt, onClose])

    const handleOnConfirm = (plate: Plate) => {
        // @ts-ignore
        dispatch(PlatesActions.deletePlate(plate.id))
        setDeleteAttempt(true)
    }
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            onConfirm={() => handleOnConfirm(plate)}
            title="Eliminar curso"
            confirmLabel="Eliminar"
            updateInProgress={deleteInProgress}
            confirmIcon={<Delete/>}
            cancelLabel = "Cancelar"
        >

            <span>Esta seguro que quiere eliminar el curso {plate?.nombre} ?</span>


        </Modal>
    )
}

export default DeletePlateModal
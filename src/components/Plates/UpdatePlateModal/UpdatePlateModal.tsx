import { useEffect, useState } from "react";
import { Plate } from "../../../types/Plate";
import { useDispatch, useSelector } from "react-redux";
import {
  createPlateInProgressSelector,
  updatePlateInProgressSelector,
} from "../../../store/selectors/plates";
import Modal from "../../Modal/Modal";
import { TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { PlatesActions } from "../../../store/actions/plates";

interface UpdatePlateModalProps {
  plate?: Plate;
  open: boolean;
  onClose: () => void;
}

const UpdatePlateModal:React.FC<UpdatePlateModalProps> = ({ plate, open, onClose }) => {
  const [nombre, setNombre] = useState("");
  const [siglas, setSiglas] = useState("");
  const [estado, setEstado] = useState("");
  const [dirty,setDirty]=useState(false)
  const updateInProgress = useSelector(updatePlateInProgressSelector);
  const createInProgress = useSelector(createPlateInProgressSelector);
  const creationMode = !plate;
  const confirmLabel = creationMode ? "Crear" : "Modificar";
  const title = `${confirmLabel} Curso`;
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!plate){
      setNombre('')
      setSiglas('')
      setEstado('')
      return
    }
    setNombre(plate.nombre)
    setSiglas(plate.siglas)
    setEstado(String( plate.estado))
  },[plate])

  useEffect(()=>{
    if(!dirty)return 
    if(!(updateInProgress|| createInProgress)){
      onClose()
      setDirty(false)
      setNombre('')
      setSiglas('')
      setEstado('')
    }
  },[createInProgress,dirty,onClose,updateInProgress])

  const handleConfirm = (
    payload: Partial<Plate>,
    currentPlate: Plate | undefined
  ) => {
    const payloadCandidate: Plate = creationMode
      ? ({ ...payload, estado: true } as Plate)
      : ({ ...currentPlate, ...payload } as Plate);

    const disaptchAction = creationMode
      ? PlatesActions.createPlate
      : PlatesActions.updatePlate;

    //@ts-ignore
    dispatch(disaptchAction(payloadCandidate));
    setDirty(true)

  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      onConfirm={() => handleConfirm({ nombre: nombre, siglas:siglas, estado:Boolean(String(estado)) }, plate)}
      title={title}
      confirmLabel={confirmLabel}
      updateInProgress={updateInProgress || createInProgress}
      confirmIcon={<Save></Save>}
      cancelLabel = "Cancelar"
    >
      <>
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="Nombre Curso"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="Siglas Curso"
          value={siglas}
          onChange={(e) => setSiglas(e.target.value)}
        />
         <TextField
          type="text"
          fullWidth
          margin="dense"
          label="Estado Curso"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
      </>
    </Modal>
  );
};
export default UpdatePlateModal;

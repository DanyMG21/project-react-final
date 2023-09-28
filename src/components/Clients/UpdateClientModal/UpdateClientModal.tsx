import { useEffect, useState } from "react";
import { Client } from "../../../types/Client";
import { useDispatch, useSelector } from "react-redux";
import {
  createClientInProgressSelector,
  updateClientInProgressSelector,
} from "../../../store/selectors/clients";
import Modal from "../../Modal/Modal";
import { TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { ClientsActions } from "../../../store/actions/clients";

interface UpdateClientModalProps {
  client?: Client;
  open: boolean;
  onClose: () => void;
}

const UpdateClientModal:React.FC<UpdateClientModalProps> = ({ client, open, onClose }) => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [edad, setEdad] = useState("");
  const [dirty,setDirty]=useState(false)
  const updateInProgress = useSelector(updateClientInProgressSelector);
  const createInProgress = useSelector(createClientInProgressSelector);
  const creationMode = !client;
  const confirmLabel = creationMode ? "Crear" : "Modificar";
  const title = `${confirmLabel} Estudiante`;
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!client){
      setNombres('')
      setApellidos('')
      setDni('')
      setEdad('')
      return
    }
    setNombres(client.nombres)
    setApellidos(client.apellidos)
    setDni(client.dni)
    setEdad(client.edad.toString())
  },[client])

  useEffect(()=>{
    if(!dirty)return 
    if(!(updateInProgress|| createInProgress)){
      onClose()
      setDirty(false)
      setNombres('')
      setApellidos('')
      setDni('')
      setEdad('')
    }
  },[createInProgress,dirty,onClose,updateInProgress])

  const handleConfirm = (
    payload: Partial<Client>,
    currentClient: Client | undefined
  ) => {
    const payloadCandidate: Client = creationMode
      ? ({ ...payload, status: true } as Client)
      : ({ ...currentClient, ...payload } as Client);

    const disaptchAction = creationMode
      ? ClientsActions.createClient
      : ClientsActions.updateClient;

    //@ts-ignore
    dispatch(disaptchAction(payloadCandidate));
    setDirty(true)

  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      onConfirm={() => handleConfirm({nombres: nombres,apellidos: apellidos, dni: dni,edad:Number(edad) }, client)}
      title={title}
      confirmLabel={confirmLabel}
      updateInProgress={updateInProgress || createInProgress}
      confirmIcon={<Save></Save>}
      cancelLabel = "Cancel"
    >
      <>
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />
        <TextField
        type="text"
        fullWidth
        margin="dense"
        label="EDAD"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
      />
      </>
    </Modal>
  );
};
export default UpdateClientModal;

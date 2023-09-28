import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { format } from 'date-fns'
import { invoiceDetailSelector } from '../../store/selectors/invoices'
import { getInvoiceDetail } from '../../store/actions/invoices'
import Layout from '../../Layout'
import {
    PDFViewer,
    Page,
    Text,
    Document,
    StyleSheet,
    PDFDownloadLink,
} from '@react-pdf/renderer'
import { Button, CircularProgress, Dialog, DialogContent } from '@mui/material'

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    author: {
        fontSize: 12,
        marginBottom: 40,
        textAlign: 'center',
    },
    subTitle: {
        backgroundColor: '#f3f4f5',
        color: '#6435c9',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 12,
        padding: 10,
    },
    text: {
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 25,
        textAlign: 'justify',
    },
    textItem: {
        fontSize: 10,
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'justify',
    },
    price: {
        fontSize: 16,
        color: '#6435c9',
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 12,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
})

function InvoiceDetails() {
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)

    const invoiceDetail = useSelector(invoiceDetailSelector)

    const params = useParams() as any
    const dispatch = useDispatch()

    const loadData = () => {
        function fnCallback() {
            setLoading(false)
        }

        // @ts-ignore
        dispatch(getInvoiceDetail(params.id, fnCallback))
    }

    const findPlateCount = (id: any) => {
        return invoiceDetail.invoice.items.find((p: any) => p.curso.id === id)
            .quantity
    }

    const onDetailPDF = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const calculateTotal = () => {
        return invoiceDetail.plates.reduce((acc: any, curr: any) => {
            acc += curr.price * findPlateCount(curr.id)
            return acc
        }, 0)
    }

    useEffect(() => {
        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (loading) {
        return (
            <div className="centerLoading">
                <CircularProgress />
            </div>
        )
    }

    const pdfDocument = (
        <Document>
            <Page style={styles.body}>
                <Text style={styles.header}>~ Created with react-pdf ~</Text>
                <Text style={styles.title}>Matriculas</Text>
                <Text style={styles.author}>Mito-Rest</Text>
                <Text style={styles.subTitle}>Estudiantes</Text>
                <Text style={styles.text}>
                    {invoiceDetail.client.nombres}{' '}
                    {invoiceDetail.client.apellidos}
                </Text>
                <Text style={styles.subTitle}>Matricula Detalles</Text>
                <Text style={styles.text}>
                    Código Matricula: {invoiceDetail.invoice.id}
                </Text>
                <Text style={styles.text}>
                    Fecha: {invoiceDetail.invoice.fecha}
                </Text>
                {/*<Text style={styles.text}>*/}
                {/*    Created At:{' '}*/}
                {/*    {format(*/}
                {/*        new Date(invoiceDetail.invoice.creadoEn),*/}
                {/*        'MM/dd/yyyy'*/}
                {/*    )}*/}
                {/*</Text>*/}
                <Text style={styles.subTitle}>Cursos</Text>
                {invoiceDetail.plates.map((p: any) => (
                    <>
                        <Text style={styles.textItem}>Name: {p.nombre}</Text> 
                        <Text style={styles.textItem}>Price: {p.siglas}</Text>
                        <Text style={styles.textItem}>
                            Quantity: {'1'}
                        </Text>
                    </> 
                ))}
            </Page>
        </Document>
    )

    return (
        <Layout>
            <div className="invoiceDetail">
                <div className="titleArea">Datos Estudiante</div>
                <div className="boxArea">
                    Nombre: {invoiceDetail.client.nombres}{' '}
                    {invoiceDetail.client.apellidos}
                </div>
                <div className="titleArea">Información Matricula</div>
                <div className="boxArea">
                    <div>Código Matricula: {invoiceDetail.invoice.id}</div>
                    <div>Fecha: {invoiceDetail.invoice.fecha}</div>
                    <div>
                        Date:{' '}
                        {invoiceDetail.invoice.creadoEn &&
                            format(
                                new Date(invoiceDetail.invoice.creadoEn),
                                'MM/dd/yyyy'
                            )}
                    </div>
                </div>
                <div className="titleArea">Cursos</div>
                <div className="boxArea">
                    <div className="listPlatos">
                        <div className="plateList__head">
                            <div className="plateList__head--item">Nombre</div>
                            <div className="plateList__head--item">Siglas</div>
                            <div className="plateList__head--item">
                                Quantity
                            </div>
                        </div>
                        <div className="plateList__body">
                            {invoiceDetail.plates.map((p: any) => (
                                <div className="plateList__body--row">
                                    <div className="plateList__body--column">
                                        {p.nombre}
                                    </div>
                                    <div className="plateList__body--column">
                                        {p.siglas}
                                    </div>
                                    <div className="plateList__body--column">
                                        {findPlateCount(p.id)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="plateList__footer">
                            <div className="plateList__footer--item">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onDetailPDF}
                                >
                                    Download Pdf
                                </Button>

                                <PDFDownloadLink
                                    document={pdfDocument}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {({ url }: { url: any }) => {
                                        return (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                href={url as string}
                                                download
                                            >
                                                Download PDF en Bytes
                                            </Button>
                                        )
                                    }}
                                </PDFDownloadLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                fullWidth={true}
                maxWidth="lg"
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogContent>
                    <PDFViewer width="100%" height="500px">
                        {pdfDocument}
                    </PDFViewer>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

export default InvoiceDetails

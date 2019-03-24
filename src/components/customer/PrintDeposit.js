import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";

import "../../styles/print-frame.css";

import jsPDF from "jspdf";
import "jspdf-autotable";

import TransactionLogo from "../../images/TransactionLogo";

class PrintDeposit extends Component {
  constructor() {
    super();

    this.state = {
      transactionLogo: TransactionLogo
    };
  }

  async componentDidMount() {
    let depositId = this.props.match.params.id;
    let customerId = this.props.match.params.customer;

    let jspdfStyle = (pageContent = null, lastY = null, marginRight = null, marginLeft = null, useHeader = null) => ({
      addPageContent: pageContent || "",
      showHeader: useHeader === null ? true : false,
      margin: { top: 30, right: marginRight || 15, bottom: 44, left: marginLeft || 15 },
      startY: lastY === null ? 49 : lastY + 5,
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      styles: {
        font: "courier",
        fontSize: 8,
        textColor: [0, 0, 0],
        lineColor: [44, 62, 80],
        lineWidth: 0.25
      },
      headerStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        lineWidth: 0
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });

    let doc = new jsPDF("potrait", "mm", "a5");
    // Auto page width
    let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

    let staffInvoice = false;

    let pageContent = function(data) {
      // HEADER

      // HEADER LOGO
      doc.setFontSize(10);
      doc.setTextColor("#000");
      doc.setFontStyle("bold");
      doc.addImage(TransactionLogo, "png", data.settings.margin.left, 10, 10, 10);
      doc.text("Wishy Washy Laundry", data.settings.margin.left + 15, 15);

      doc.setFontSize(8);
      doc.setTextColor("#808080");
      doc.setFontStyle("normal");
      doc.text("We clean, you relax", data.settings.margin.left + 15, 19);
      // ================================================

      // HEADER INVOICE
      doc.setFontSize(10);
      doc.setTextColor("#808080");
      doc.setFontStyle("normal");
      // doc.text("WW18122219822", pageWidth - 42, 15);
      // ================================================
      doc.line(data.settings.margin.left, 24, pageWidth - 15, 24);
    };

    // for (let i = 0; i < 2; i++) {
    //   doc.setFontSize(8);
    //   doc.setTextColor("#000");
    //   doc.setFont("courier");
    //   doc.text(`No nota: ${invoiceId}`, 15, 28);
    //   doc.text(`Kode / Nama: ${customerData.id} / ${customerData.name}`, 15, 32);
    //   doc.text(`No Telp: ${customerData.mobile}`, 15, 36);
    //   doc.text(`Alamat: ${customerData.address.substring(0, 50)}`, 15, 40);
    //   if (customerData.address.length >= 50) {
    //     doc.text(`${customerData.address.substring(50)}`, 25.5, 44);
    //   }

    //   doc.text(`Tanggal Terima: ${invoiceDate}`, pageWidth - 61, 28);
    //   doc.text(`Jam Terima: ${invoiceTime}`, pageWidth - 45, 32);
    //   doc.text(`Tanggal Selesai: ${invoiceFinished}`, pageWidth - 62.3, 36);

    //   doc.autoTable(columnServices, [...dataServices], jspdfStyle(pageContent));
    //   let first = doc.autoTable.previous.finalY;
    //   doc.autoTable(columnItems, [...dataItems], jspdfStyle(null, first, 75));
    //   doc.autoTable(columnDetail, [...dataDetail], jspdfStyle(null, first, null, 75, false));

    //   doc.setFontSize(36);
    //   doc.setTextColor("#e74c3c");
    //   if (invoiceIsExpress) doc.addImage(ExpressLogo, "png", pageWidth - 70, 110, 60, 29);

    //   if (!staffInvoice) {
    //     doc.addPage();
    //   }
    //   staffInvoice = true;
    // }

    document.getElementById("output").src = doc.output("datauristring");
  }

  render() {
    return <embed id="output" type="application/pdf" />;
  }
}

export default PrintDeposit;

import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import numeral from "numeral";

import servicesUrl, { datetimeFormat } from "../../config";
import { calculateService } from "../../formula";

import "../../styles/print-frame.css";

import jsPDF from "jspdf";
import "jspdf-autotable";

import TransactionLogo from "../../images/TransactionLogo";
import ExpressLogo from "../../images/ExpressLogo";

class PrintTransaction extends Component {
  constructor() {
    super();

    this.state = {
      transactionLogo: TransactionLogo,
      expressLogo: ExpressLogo,
      columnServices: [
        { title: "Nama Layanan", dataKey: "name" },
        { title: "Qty", dataKey: "quantity" },
        { title: "Unit", dataKey: "unit" },
        { title: "", dataKey: "isExpress" },
        { title: "Harga", dataKey: "price" },
        { title: "Total", dataKey: "total_price" }
      ],
      dataServices: [],
      columnItems: [{ title: "Nama Item", dataKey: "name" }, { title: "Qty", dataKey: "quantity" }],
      dataItems: [],
      columnDetail: [{ title: "ColName", dataKey: "colName" }, { title: "ColValue", dataKey: "colValue" }],
      dataDetail: []
    };
  }

  async componentDidMount() {
    let { columnServices, dataServices, columnItems, dataItems, columnDetail, dataDetail } = this.state;

    let invoiceId = this.props.match.params.id;

    const data = await axios.get(`${servicesUrl}/transactions/${invoiceId}`).then(res => res.data);

    let { invoiceDate, invoiceFinished, isPaid, useDeposit } = data;

    let invoiceTime = moment(invoiceDate, datetimeFormat).format("HH:mm");
    invoiceDate = moment(invoiceDate, datetimeFormat).format("DD MMM YYYY");
    invoiceFinished = moment(invoiceFinished, datetimeFormat).format("DD MMM YYYY");

    // Get customerData
    let customerData = await axios.get(`${servicesUrl}/customers/${data.customerId}`).then(res => res.data);

    customerData.id = data.customerId;

    let totalPrice = 0;
    let totalItemQuantity = 0;

    let invoiceIsExpress = false;
    data.transactionServices.forEach(item => {
      item.name = item.serviceName;
      item.quantity = item.serviceQuantity;
      item.unit = item.serviceUnit || "kg";
      item.price = numeral(item.servicePrice + (item.serviceIsExpress ? item.serviceExpressPrice : 0)).format("0,0");
      item.total_price = calculateService(item.serviceQuantity, item.serviceUnit, item.servicePrice, item.serviceIsExpress, item.serviceExpressPrice);
      if (item.serviceIsExpress) invoiceIsExpress = true;

      // Grandtotal
      totalPrice += numeral(item.total_price).value();

      dataServices.push(item);
    });

    data.transactionItems.forEach(item => {
      item.name = item.itemName;
      item.quantity = item.itemQuantity;

      // Total item
      totalItemQuantity += item.itemQuantity;

      dataItems.push(item);
    });

    if (dataItems.length === 0) dataItems.push({ name: "Tidak ada detail" });

    dataDetail = [
      {
        colName: "Sub Total",
        colValue: `Rp ${numeral(totalPrice).format("0,0")}`
      },
      {
        colName: "Discount",
        colValue: `Rp ${numeral((totalPrice * data.discountPrice) / 100).format("0,0")} (${data.discountPrice}%)`
      },
      {
        colName: "Jumlah barang",
        colValue: totalItemQuantity
      },
      {
        colName: "Total Harga",
        colValue: `Rp ${numeral(totalPrice - (data.discountPrice * totalPrice) / 100).format("0,0")}`
      }
    ];

    if (useDeposit) {
      dataDetail.push({
        colName: "Sisa Deposit",
        colValue: `Rp ${numeral(customerData.balance).format("0,0")}`
      });
    } else if (isPaid) {
      dataDetail.push({
        colName: "Status",
        colValue: "Sudah Lunas"
      });
    } else {
      dataDetail.push({
        colName: "Status",
        colValue: "Belum Lunas"
      });
    }

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
      doc.setTextColor("#303030");
      doc.text("Whatsapp: +62-852-1048-2952", pageWidth - 61, 22);
      // ================================================

      // HEADER INVOICE
      doc.setFontSize(10);
      doc.setTextColor("#808080");
      doc.setFontStyle("normal");
      // doc.text("WW18122219822", pageWidth - 42, 15);
      // ================================================
      doc.line(data.settings.margin.left, 24, pageWidth - 15, 24);

      // FOOTER
      doc.setFontSize(7);
      doc.setTextColor("#808080");

      if (!staffInvoice) {
        let footNotes = [
          "Perhatian",
          "1. Barang yang tidak diambil setelah 1 bulan diluar tanggung jawab kami",
          "2. Barang hilang/rusak diganti maksimal 5x ongkos cuci",
          "3. Kerusakan/kelunturan/mengerut karena sifat bahan merupakan resiko konsumen",
          "4. Hak CLAIM berlaku 24 jam setelah cucian di ambil",
          "5. Hasil cucian yang tidak bersih dapat di kembalikan untuk di cuci ulang, max 24 jam setelah pengambilan",
          "6. Kami tidak bertanggung jawab apabila ada barang/dokumen yang ikut tercuci",
          "7. Cek dahulu cucian anda sewaktu pengambilan, apabila cucian sudah keluar dari outlet kami, maka kami tidak menerima COMPLAIN berupa apapun & dgn ALASAN apapun"
        ];
        let footerStartY = 10;
        let footerLineSpace = 3;
        footNotes
          .slice()
          .reverse()
          .forEach((item, index) => {
            footerStartY += item.length >= 77 ? 2.5 : 0;
            doc.text(doc.splitTextToSize(item, pageWidth - 35, {}), data.settings.margin.left, pageHeight - (footerStartY + footerLineSpace * index));
          });
      } else {
        doc.setTextColor("#303030");
        let marginLeft = data.settings.margin.left - 5;
        let marginBottom = pageHeight - 30;
        let printedName = customerData.name;
        if (customerData.name.length <= 7) {
          doc.setFontSize(80);
        } else if (customerData.name.length <= 15) {
          doc.setFontSize(50);
        } else {
          printedName = customerData.name.substring(0, 15);
          doc.setFontSize(40);
        }
        doc.text(`${printedName}`, marginLeft, marginBottom);
      }
    };

    for (let i = 0; i < 2; i++) {
      doc.setFontSize(8);
      doc.setTextColor("#000");
      doc.setFont("courier");
      doc.text(`No nota: ${invoiceId}`, 15, 28);
      doc.text(`Kode / Nama: ${customerData.id} / ${customerData.name}`, 15, 32);
      doc.text(`No Telp: ${customerData.mobile}`, 15, 36);
      doc.text(`Alamat: ${customerData.address.substring(0, 50)}`, 15, 40);
      if (customerData.address.length >= 50) {
        doc.text(`${customerData.address.substring(50)}`, 25.5, 44);
      }

      doc.text(`Tanggal Terima: ${invoiceDate}`, pageWidth - 61, 28);
      doc.text(`Jam Terima: ${invoiceTime}`, pageWidth - 45, 32);
      doc.text(`Tanggal Selesai: ${invoiceFinished}`, pageWidth - 62.3, 36);

      doc.autoTable(columnServices, [...dataServices], jspdfStyle(pageContent));
      let first = doc.autoTable.previous.finalY;
      doc.autoTable(columnItems, [...dataItems], jspdfStyle(null, first, 75));
      doc.autoTable(columnDetail, [...dataDetail], jspdfStyle(null, first, null, 75, false));

      doc.setFontSize(36);
      doc.setTextColor("#e74c3c");
      if (invoiceIsExpress) doc.addImage(ExpressLogo, "png", pageWidth - 70, 110, 60, 29);

      if (!staffInvoice) {
        doc.addPage();
      }
      staffInvoice = true;
    }

    document.getElementById("output").src = doc.output("datauristring");
  }

  render() {
    return <embed id="output" type="application/pdf" />;
  }
}

export default PrintTransaction;

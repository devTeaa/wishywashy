import React, { Component } from "react";
import moment from "moment";
import numeral from "numeral";
import PropTypes from "prop-types";

import { datetimeFormat } from "../../config";
import { calculateServiceNumber } from "../../formula";

import "../../styles/print-frame.css";

import jsPDF from "jspdf";
import "jspdf-autotable";

import TransactionLogo from "../../images/TransactionLogo";

class PrintReportTransaction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactionLogo: TransactionLogo,
      columnTransactions: [
        { title: "Tanggal", dataKey: "invoiceDate" },
        { title: "Invoice", dataKey: "invoiceId" },
        { title: "Customer", dataKey: "customerName" },
        { title: "Quantity Unit", dataKey: "invoiceQuantity" },
        { title: "Total", dataKey: "totalPrice" }
      ],
      columnDeposits: [
        { title: "Tanggal", dataKey: "date" },
        { title: "Nama Pelanggan", dataKey: "customerName" },
        { title: "Nama Deposit", dataKey: "depositName" },
        { title: "Harga Deposit", dataKey: "depositPrice" }
      ]
    };
  }

  async componentDidMount() {
    let { columnTransactions, columnDeposits } = this.state;
    let { dataTransactions, dataDeposits } = this.props;

    let totalDeposit = 0;
    let totalDepositIncome = 0;

    let totalTransactions = 0;
    let totalAllPrice = 0;
    let totalAllPriceDeposit = 0;
    let totalKilos = 0;
    let totalPcs = 0;
    let totalMeters = 0;

    dataDeposits.forEach(item => {
      totalDeposit++;
      totalDepositIncome += item.depositPrice;
      item.date = moment(item.date, datetimeFormat).format("DD MMM YYYY");
      item.depositPrice = numeral(item.depositPrice).format("0,0");
    });

    dataTransactions.forEach(item => {
      item.customerName = `(${item.customerId}) ${item.customerName}`;

      item.invoiceDate = moment(item.invoiceDate, datetimeFormat).format("DD MMM YYYY");

      item.totalPrice = 0;
      let invoiceQuantity = [];
      item.invoiceServices.forEach(service => {
        invoiceQuantity.push(`${service.serviceQuantity} ${service.serviceUnit}`);
        item.totalPrice += calculateServiceNumber(
          service.serviceQuantity,
          service.servicePrice,
          service.serviceIsExpress,
          service.serviceExpressPrice
        );
        if (service.serviceUnit === "kg") {
          totalKilos += service.serviceQuantity;
        } else if (service.serviceUnit === "pcs") {
          totalPcs += service.serviceQuantity;
        } else if (service.serviceUnit === "meter") {
          totalMeters += service.serviceQuantity;
        }
      });

      item.invoiceQuantity = invoiceQuantity.join(", ");

      totalTransactions++;
      item.useDeposit ? (totalAllPriceDeposit += item.totalPrice) : (totalAllPrice += item.totalPrice);

      item.totalPrice = `${numeral(item.totalPrice).format("0,0")}${item.useDeposit ? " (Deposit)" : ""}`;
    });

    let jspdfStyle = (pageContent = null, lastY = null, marginRight = null, marginLeft = null, useHeader = null) => ({
      addPageContent: pageContent || "",
      showHeader: useHeader === null ? true : false,
      margin: { top: 30, right: marginRight || 15, bottom: 44, left: marginLeft || 15 },
      startY: lastY === null ? 65 : lastY + 5,
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

    let doc = new jsPDF("potrait", "mm", "a4");
    // Auto page width
    let pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

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
    };

    doc.setFontSize(10);
    doc.setTextColor("#000");
    doc.setFont("courier");

    doc.text(`Total Deposit Count: ${totalDeposit}`, 15, 28);
    doc.text(`Total Deposit Income: ${numeral(totalDepositIncome).format("0,0")}`, 15, 33);

    doc.text(`Number of Transactions: ${numeral(totalTransactions).format("0,0")}`, 15, 40);
    doc.text(`Total Income: Rp ${numeral(totalAllPrice).format("0,0")} (Deposit: ${numeral(totalAllPriceDeposit).format("0,0")})`, 15, 45);
    doc.text(`Total Kilos: ${totalKilos}`, 15, 50);
    doc.text(`Total Pieces: ${totalPcs}`, 15, 55);
    doc.text(`Total Meter: ${totalMeters}`, 15, 60);

    doc.autoTable(columnDeposits, [...dataDeposits], jspdfStyle(pageContent));
    doc.autoTable(columnTransactions, [...dataTransactions], jspdfStyle(pageContent, doc.autoTable.previous.finalY));

    document.getElementById("output").src = doc.output("datauristring");
  }

  render() {
    return <embed id="output" type="application/pdf" />;
  }
}

PrintReportTransaction.propTypes = {
  dataTransactions: PropTypes.array.isRequired,
  dataDeposits: PropTypes.array.isRequired
};

export default PrintReportTransaction;

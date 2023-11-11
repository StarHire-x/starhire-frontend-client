"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { useEffect, useRef, useState } from "react";
import {
  getAllCorporateInvoices,
  updateInvoicePaymentStatus,
} from "../api/invoices/route";
import styles from "./page.module.css";
import { Toast } from "primereact/toast";

const Invoices = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    router.push("/login");
  }

  const accessToken =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.accessToken;

  const corporateId =
    session.status === "authenticated" &&
    session.data &&
    session.data.user.userId;

  const [invoices, setInvoices] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [selectedInvoicePaymentId, setSelectedInvoicePaymentId] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  const loadInvoices = async () => {
    const allInvoices = await getAllCorporateInvoices(accessToken, corporateId);
    setInvoices(allInvoices);
    setIsLoading(false);
  };

  useEffect(() => {
    if (accessToken) {
      setIsLoading(true);
      loadInvoices();
    }
  }, [accessToken, corporateId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatMoney = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const expandAll = () => {
    let _expandedRows = {};

    invoices.forEach((p) => (_expandedRows[`${p.invoiceId}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.invoiceDate);
  };

  const amountBodyTemplate = (rowData) => {
    return formatMoney(rowData.totalAmount);
  };

  const requestedBodyTemplate = (rowData) => {
    return rowData.administrator?.userName;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        severity={getOrderSeverity(rowData.invoiceStatus)}
        value={rowData.invoiceStatus.replace("_", " ")}
      ></Tag>
    );
  };

  const getOrderSeverity = (status) => {
    switch (status) {
      case "Not_Paid":
        return "danger";

      case "Indicated_Paid":
        return "info";

      case "Confirmed_Paid":
        return "success";

      default:
        return null;
    }
  };

  const allowExpansion = (rowData) => {
    return rowData.jobApplications?.length > 0;
  };

  const titleBodyTemplate = (rowData) => {
    return rowData.jobListing?.title;
  };

  const salaryBodyTemplate = (rowData) => {
    return formatMoney(rowData.jobListing?.averageSalary);
  };

  const usernameBodyTemplate = (rowData) => {
    return rowData.jobSeeker?.userName;
  };

  const paidButtons = (rowData) => {
    if (rowData.invoiceStatus === "Not_Paid") {
      return (
        <Button
          label="Indicate Payment"
          severity="success"
          size="small"
          className={styles.paymentButton}
          onClick={() => setSelectedInvoicePaymentId(rowData?.invoiceId)}
        />
      );
    }
    return rowData?.invoiceLink ? (
      <Button
        label="Invoice"
        severity="info"
        size="small"
        className={styles.paymentButton}
        icon="pi pi-download"
        onClick={() => window.location.assign(rowData?.invoiceLink)}
      />
    ) : (
      <></>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <Badge
          value={`Job Applications under Invoice ${data.invoiceId}`}
          severity="info"
          size="large"
          className={styles.badge}
        />
        <DataTable value={data.jobApplications} showGridlines>
          <Column
            field="jobApplicationId"
            header="Application ID"
            sortable
            style={{ width: "5rem" }}
          />
          <Column
            field="jobListing"
            header="Job Listing Title"
            sortable
            body={titleBodyTemplate}
            style={{ width: "25rem" }}
          />
          <Column
            field="averageSalary"
            header="Salary"
            sortable
            body={salaryBodyTemplate}
            style={{ width: "10rem" }}
          />
          <Column
            field="jobSeeker"
            header="Job Seeker"
            sortable
            body={usernameBodyTemplate}
            style={{ width: "10rem" }}
          />
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className={styles.expandCollapseHeader}>
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );

  const handlePaidClick = async () => {
    setIsLoading(true);
    await updateInvoicePaymentStatus(accessToken, selectedInvoicePaymentId, {
      invoiceStatus: "Indicated_Paid",
    });
    await loadInvoices();
    setSelectedInvoicePaymentId(null);
    setIsLoading(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Indicated payment for invoice!",
      life: 5000,
    });
  };

  const DialogConfirmation = (
    <ConfirmDialog
      visible={selectedInvoicePaymentId != null}
      onHide={() => setSelectedInvoicePaymentId(null)}
      message="Have you paid to StarHire?"
      header="Confirm Payment"
      icon="pi pi-exclamation-triangle"
      accept={() => handlePaidClick()}
      reject={() => setSelectedInvoicePaymentId(null)}
    />
  );

  return (
    <div>
      <Toast ref={toast} />
      {DialogConfirmation}
      <div className={styles.heading}>
        <h2>Invoices</h2>
      </div>
      {isLoading && <ProgressSpinner style={{marginLeft: "45vw"}}/>}
      {!isLoading && (
        <Card className={styles.mainTable}>
          <DataTable
            value={invoices}
            expandedRows={expandedRows}
            onRowToggle={(e) => {
              setExpandedRows(e.data);
            }}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="invoiceId"
            header={header}
            tableStyle={{ minWidth: "60rem" }}
            scrollable
            scrollHeight="40vh"
            rowClassName={styles.mainTableRow}
          >
            <Column expander={allowExpansion} style={{ width: "5rem" }} />
            <Column field="invoiceId" header="ID" sortable />
            <Column
              field="invoiceDate"
              header="Date Created"
              sortable
              body={dateBodyTemplate}
            />
            <Column
              field="dueDate"
              header="Due Date"
              sortable
              body={dateBodyTemplate}
            />
            <Column
              field="invoiceStatus"
              header="Status"
              sortable
              body={statusBodyTemplate}
            />
            <Column
              field="totalAmount"
              header="Total Amount"
              sortable
              body={amountBodyTemplate}
            />
            <Column
              field="corporate"
              header="Requested By"
              sortable
              body={requestedBodyTemplate}
            />
            <Column
              field="paidButtons"
              header="Paid?"
              body={paidButtons}
              style={{ width: "10rem" }}
            />
          </DataTable>
        </Card>
      )}
    </div>
  );
};

export default Invoices;

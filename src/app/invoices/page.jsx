"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { getAllCorporateInvoices } from "../api/invoices/route";
import styles from "./page.module.css";

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

  const loadInvoices = async () => {
    const allInvoices = await getAllCorporateInvoices(accessToken, corporateId);
    setInvoices(allInvoices);
  };

  useEffect(() => {
    loadInvoices();
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

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h3>Job Applications under Invoice {data.invoiceId}</h3>
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
    <div className="flex flex-wrap justify-content-end gap-2">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
      <Button
        icon="pi pi-minus"
        label="Collapse All"
        onClick={collapseAll}
        text
      />
    </div>
  );

  return (
    <div>
      <div className={styles.heading}>
        <h2>Invoices</h2>
      </div>
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
      </DataTable>
    </div>
  );
};

export default Invoices;

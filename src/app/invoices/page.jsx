"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import HumanIcon from "../../../public/icon.png";
import {
  getAllCorporateInvoices,
  updateInvoicePayment,
} from "../api/invoices/route";
import { uploadFile } from "../api/upload/route";
import styles from "./page.module.css";

const Invoices = () => {
  const session = useSession();
  const router = useRouter();
  const toast = useRef(null);

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
  const [selectedInvoicePayment, setSelectedInvoicePayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    invoiceId: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const loadInvoices = async () => {
    setIsLoading(true);
    const allInvoices = await getAllCorporateInvoices(accessToken, corporateId);
    setInvoices(allInvoices);
    const selectedInvoiceUpdateList = allInvoices.filter(
      (invoice) => invoice.invoiceId === selectedInvoicePayment?.invoiceId
    );
    selectedInvoicePayment &&
      setSelectedInvoicePayment(
        selectedInvoiceUpdateList.length > 0
          ? selectedInvoiceUpdateList[0]
          : null
      );
    setIsLoading(false);
  };

  useEffect(() => {
    if (accessToken) {
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

  const userDetailBodyTemplate = (userData) => {
    const userName = userData?.userName;
    const avatar = userData?.profilePictureUrl;
    return (
      <div className={styles.imageContainer}>
        {avatar !== "" ? (
          <img
            alt={avatar}
            src={avatar}
            className={styles.avatarImageContainer}
          />
        ) : (
          <Image
            src={HumanIcon}
            alt="Icon"
            className={styles.avatarImageContainer}
          />
        )}
        <span>{userName}</span>
      </div>
    );
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
    return (
      <div className={styles.actionButtons}>
        {rowData?.invoiceLink && (
          <Button
            label="Invoice"
            severity="info"
            size="small"
            className={styles.paymentButton}
            icon="pi pi-download"
            onClick={() =>
              window.open(
                rowData?.stripePaymentLink !== ""
                  ? rowData?.stripePaymentLink
                  : rowData?.invoiceLink,
                "_blank"
              )
            }
          />
        )}
        {rowData?.invoiceStatus === "Not_Paid" && (
          <Button
            label="Make Payment"
            severity="success"
            size="small"
            className={styles.makePaymentButton}
            onClick={() => setSelectedInvoicePayment(rowData)}
          />
        )}
      </div>
    );
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        {/* <Badge
          value={}
          severity="info"
          size="large"
          className={styles.badge}
        /> */}
        <DataTable
          value={data.jobApplications}
          showGridlines
          header={`Invoice ${data.invoiceId} Job Applications`}
        >
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
            header="Applicant"
            sortable
            body={(rowData) => userDetailBodyTemplate(rowData?.jobSeeker)}
            style={{ width: "10rem" }}
          />
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className={styles.tableHeader}>
      <div className={styles.expandCollapseHeader}>
        <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
        <Button
          icon="pi pi-minus"
          label="Collapse All"
          onClick={collapseAll}
          text
        />
      </div>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search By ID"
        />
      </span>
    </div>
  );

  const handlePaidClick = async () => {
    setIsLoading(true);
    let request = {};
    if (selectedInvoicePayment?.proofOfPaymentLink !== "") {
      request = {
        invoiceStatus: "Indicated_Paid",
        proofOfPaymentLink: selectedInvoicePayment?.proofOfPaymentLink,
        stripePaymentLink: "",
        stripeInvoiceId: "",
      };
    } else {
      request = {
        invoiceStatus: "Indicated_Paid",
      };
    }
    await updateInvoicePayment(
      accessToken,
      selectedInvoicePayment?.invoiceId,
      request
    );
    await loadInvoices();
    setSelectedInvoicePayment(null);
    setIsLoading(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Indicated payment for invoice!",
      life: 5000,
    });
  };

  const handleUploadNewFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const response = await uploadFile(file, accessToken);

      const updatedInvoice = {
        ...selectedInvoicePayment,
        proofOfPaymentLink: response?.url,
      };
      console.log(updatedInvoice);
      setSelectedInvoicePayment(updatedInvoice);
      setIsUploading(false);
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => setSelectedInvoicePayment(null)}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => handlePaidClick()}
        autoFocus
        loading={isUploading}
        disabled={
          !(
            selectedInvoicePayment?.invoiceStatus === "Indicated_Paid" ||
            selectedInvoicePayment?.proofOfPaymentLink !== ""
          )
        }
      />
    </div>
  );

  const DialogConfirmation = (
    <>
      <Dialog
        header="Payment Methods"
        visible={selectedInvoicePayment != null}
        style={{ width: "50vw" }}
        onHide={() => setSelectedInvoicePayment(null)}
        footer={footerContent}
      >
        <div className={styles.dialogConfirmation}>
          <div className={styles.stripeHeader}>
            <b>{"1) Stripe"}</b>
            <Checkbox
              checked={
                selectedInvoicePayment?.invoiceStatus === "Indicated_Paid"
              }
              disabled
            />
            <Button
              icon="pi pi-refresh"
              rounded
              text
              onClick={() => loadInvoices()}
            />
          </div>
          <div className={styles.stripePayment}>
            <p> Make payment with Stripe: </p>
            <Button
              label="Payment Link"
              severity="info"
              text
              styles={{ width: "1px" }}
              onClick={() => {
                window.open(
                  selectedInvoicePayment?.stripePaymentLink,
                  "_blank"
                );
              }}
            />
          </div>

          <div className={styles.stripeHeader}>
            <b>{"2) Others"}</b>
            <Checkbox
              checked={selectedInvoicePayment?.proofOfPaymentLink !== ""}
              disabled
            />
          </div>
          <div>
            <input type="file" onChange={(e) => handleUploadNewFile(e)} />
          </div>
        </div>
      </Dialog>
    </>
  );

  return (
    <div>
      <Toast ref={toast} />
      {DialogConfirmation}
      <div className={styles.heading}>
        <h2>Invoices</h2>
      </div>
      {isLoading && <ProgressSpinner style={{ marginLeft: "45vw" }} />}
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
            emptyMessage="No invoices found."
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            filters={filters}
            globalFilterFields={["invoiceId"]}
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
              body={(rowData) => userDetailBodyTemplate(rowData?.administrator)}
            />
            <Column
              field="paidButtons"
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

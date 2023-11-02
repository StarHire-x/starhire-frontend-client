"use client"

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // Choose your desired theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ViewCustomerInvoices = () => {
    const [invoices, setInvoices] = useState([]); // Your list of invoices
  
    const columns = [
      { field: "invoiceNumber", header: "Invoice Number" },
      { field: "customerName", header: "Customer Name" },
      { field: "amount", header: "Amount" },
      { field: "dueDate", header: "Due Date" },
    ];
  
    useEffect(() => {
      // Fetch your invoices data and update the state using setInvoices
    }, []); // Make an API call or use your preferred data source
  
    return (
      <div>
        <h1>View Customer Invoices</h1>
        <div className="content-section implementation">
          <DataTable value={invoices}>
            {columns.map((col) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </div>
      </div>
    );
  };
  
  export default ViewCustomerInvoices;
  
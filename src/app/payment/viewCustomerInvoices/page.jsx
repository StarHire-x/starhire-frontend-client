"use client"

import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; 
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { getInvoiceFromCustomer } from '@/app/api/payment/route';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation";
import { Button } from "primereact/button";

const ViewCustomerInvoices = () => {

    const session = useSession();
    const router = useRouter();

    const accessToken =
      session.status === "authenticated" &&
      session.data &&
      session.data.user.accessToken;

    const userIdRef =
      session.status === "authenticated" &&
      session.data &&
      session.data.user.userId;

    const params = useSearchParams();
    const stripeCustId = params.get("id");

    if (session.status === "unauthenticated") {
      router?.push("/login");
    }

    //const [invoices, setInvoices] = useState([]); // Your list of invoices
    const [invoices, setInvoices] = useState({ data: [] });
    const convertCentsToDollars = (cents) => (cents / 100).toFixed(2);

    function convertToSingaporeDate(utcDateString) {
      const utcDate = new Date(utcDateString * 1000);

      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Display time in 24-hour format
        timeZoneName: "short",
        timeZone: "Asia/Singapore",
      };
      return utcDate.toLocaleString("en-SG", options);
    }
  

    useEffect(() => {
      if (session.status === "authenticated") {
        getInvoiceFromCustomer(stripeCustId, accessToken)
          .then((invoices) => {
            setInvoices(invoices);
          })
          .catch((error) => {
            console.error("Error fetching invoices:", error);
          });
      } else {
        router.push("/login");
      }
    }, [session.status, stripeCustId, accessToken, router]);

    return (
      <div>
        <h1>My Invoices</h1>
        <div className="content-section implementation">
          <DataTable value={invoices.data}>
            <Column field="id" header="Invoice Number" />
            <Column
              field="created"
              header="Created Date:"
              body={(rowData) => convertToSingaporeDate(rowData.created)}
            />
            <Column
              field="period_start"
              header="Period Start"
              body={(rowData) => convertToSingaporeDate(rowData.period_start)}
            />
            <Column
              field="period_end"
              header="Period End:"
              body={(rowData) => convertToSingaporeDate(rowData.period_end)}
            />
            <Column field="customer" header="Customer ID" />
            <Column field="customer_email" header="Email" />
            <Column
              field="amount_paid"
              header="Amount Paid (SGD)"
              body={(rowData) => convertCentsToDollars(rowData.amount_paid)}
            />
            <Column
              header="Actions"
              body={(rowData) => (
                <div>
                  <Button
                    label="View Invoice"
                    icon="pi pi-search"
                    style={{ backgroundColor: "purple", color: "white" }}
                    onClick={() =>
                      window.open(rowData.hosted_invoice_url, "_blank")
                    }
                  />
                  <span style={{ marginRight: "10px" }}></span>{" "}
                  <Button
                    label="Download"
                    icon="pi pi-download"
                    onClick={() => window.open(rowData.invoice_pdf)}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
    );
      
  
    
  };
  
  export default ViewCustomerInvoices;
  
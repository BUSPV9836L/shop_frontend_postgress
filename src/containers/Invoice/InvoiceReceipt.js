import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import String from "../../string";

const InvoiceReceipt = () => {
  const [invoiceData,setInvoiceData]=useState([]);

  const navigate = useNavigate();
  const data = useLocation();
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const getSalesDetails = async (invoice_no) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/sales/saleswithinvoiceno`);
      url.searchParams.append("user_id", sessionStorage.getItem("userid"));
      url.searchParams.append("invoice_no", invoice_no);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setInvoiceData(data);
      }
    } catch (error) {
      alert(error.message)
    }
  };

  useEffect(()=>{
    getSalesDetails(data.state.invoice_no)
  },[])
  useEffect(() => {
    let grand_total = 0;
    let total_quantity = 0;
    invoiceData?.forEach((e) => {
      grand_total = grand_total + parseFloat(e.total_price);
      total_quantity = total_quantity + parseInt(e.quantity);
    });
    setGrandTotal(grand_total);
    setTotalQuantity(total_quantity);
  }, [invoiceData]);

  useEffect(() => {
    if (grandTotal !== 0) {
      window.print();
      navigate("/"+String.Sales)
    }
  }, [grandTotal]);
  const showCompayDetails = () => {
    return (
      <table className="table w-75 print-table">
        <thead
          style={{
            backgroundColor: "var(--main-bg-color)",
            color: "white",
          }}
          className="table-header"
        >
          <td>Company Details</td>
        </thead>
        <tbody>
          <tr>
            <td>{sessionStorage.getItem("username").toLocaleUpperCase()}</td>
          </tr>
          <tr>
            <td>{sessionStorage.getItem("companyaddress")}</td>
          </tr>
          <tr>
            <td>
              Invoice Date :{" "}
              {new Date().getUTCDate() +
                "-" +
                new Date().getMonth() +
                "-" +
                new Date().getUTCFullYear()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };
  const showCustomerDetails = () => {
    return (
      <table className="table w-75 print-table">
        <thead
          style={{
            backgroundColor: "var(--main-bg-color)",
            color: "white",
          }}
          className="table-header"
        >
          <td>Customer Details</td>
        </thead>
        <tbody>
          <tr>
            <td>{invoiceData[0]?.customer_name}</td>
          </tr>
          <tr>
            <td>{invoiceData[0]?.phone_no}</td>
          </tr>
        </tbody>
      </table>
    );
  };
  const showTaxInvoice = () => {
    return (
      <div className="row">
        <div className="row justify-content-center ">
          <h4 style={{ width: "fit-content" }} className="heading-text mb-5">
            Invoice Receipt
          </h4>
        </div>
        <div className="row justify-content-center ">
          {showCompayDetails()}
          {showCustomerDetails()}
          <table className="table w-75 print-table">
            <thead
              style={{
                backgroundColor: "var(--main-bg-color)",
                color: "white",
              }}
              className="table-header"
            >
              <td>Product Name</td>
              <td>Brand</td>
              <td>Category</td>
              <td>MRP</td>
              <td>Quantity</td>
              <td>Total</td>
            </thead>
            <tbody>
              {invoiceData?.map((e, index) => (
                <tr key={index}>
                  <td>{e?.name}</td>
                  <td>{e?.brand}</td>
                  <td>{e?.category}</td>
                  <td>{e?.price}</td>
                  <td>{e?.quantity}</td>
                  <td>
                    {e?.total_price
                      ? parseFloat(e?.total_price).toFixed(2)
                      : 0.0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Grand Total</td>
                <td>{totalQuantity&&parseFloat(totalQuantity).toFixed(2)}</td>
                <td>{grandTotal?.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <body id="printarea">
        <table style={{ width: "100%" }}>
          <thead className="thead"></thead>
          <tbody>{showTaxInvoice()}</tbody>
          <tfoot className="tfoot"></tfoot>
        </table>
      </body>
    </div>
  );
};

export default InvoiceReceipt;

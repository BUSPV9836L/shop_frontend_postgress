import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import String from "../../string";

const InvoiceReceipt = () => {
  const navigate = useNavigate();
  const data = useLocation();
  console.log(data,"Fdfjkdjfj")
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  useEffect(() => {
    let grand_total = 0;
    let total_quantity = 0;
    data?.state?.forEach((e) => {
      grand_total = grand_total + parseFloat(e.total_price);
      total_quantity = total_quantity + parseInt(e.quantity);
    });
    setGrandTotal(grand_total);
    setTotalQuantity(total_quantity);
  }, []);

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
            <td>Lalto Electronics</td>
          </tr>
          <tr>
            <td>Tatisilwai ranchi, 835103, Near Beet Banglow, Shop No-34</td>
          </tr>
          <tr>
            <td>
              Date :{" "}
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
              {data?.state?.map((e, index) => (
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
                <td>{grandTotal}</td>
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

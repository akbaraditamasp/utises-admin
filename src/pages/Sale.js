import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import NumberFormat from "react-number-format";
import { useOutletContext } from "react-router-dom";
import Heading from "../components/Heading";
import PageLoader from "../components/PageLoader";
import Table, { Tbody, Td, Th, Thead } from "../components/Table";
import service from "../service";

export default function Sale() {
  const context = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const _getData = () => {
    setLoading(true);
    service
      .get("/invoice")
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    context.setActive("sales");
    _getData();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <Fragment>
      <Helmet>
        <title>Penjualan</title>
      </Helmet>
      <Heading>Penjualan</Heading>
      <div className="bg-white h-64 m-5 lg:m-8 rounded-sm p-5">
        <Table>
          <Thead>
            <tr>
              <Th>No</Th>
              <Th>TANGGAL</Th>
              <Th>PRODUK</Th>
              <Th>TOTAL</Th>
              <Th>STATUS</Th>
            </tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <tr key={`${index}`}>
                <Td>{index + 1}</Td>
                <Td>{moment(item.created_at).format("DD/MM/YYYY HH:mm")}</Td>
                <Td>{item.detail?.name}</Td>
                <NumberFormat
                  displayType="text"
                  value={item.detail?.price}
                  thousandSeparator={true}
                  prefix="Rp"
                  renderText={(value) => <Td>{value}</Td>}
                />
                <Td>
                  {item.is_paid
                    ? "SELESAI"
                    : item.expired
                    ? "KADALUARSA"
                    : "PENDING"}
                </Td>
              </tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Fragment>
  );
}

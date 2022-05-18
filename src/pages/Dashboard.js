import { Fragment, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Helmet } from "react-helmet-async";
import { FaArrowUp, FaBox, FaBoxes, FaDollarSign } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import DashCard from "../components/DashCard";
import Heading from "../components/Heading";
import PageLoader from "../components/PageLoader";
import service from "../service";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Dashboard() {
  const context = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const _changeFormat = (count) => {
    if (count >= 1000000000000) {
      return `${String.format("%.2f", count / 1000000000000)}T`;
    } else if (count >= 1000000000) {
      return `${String.format("%.2f", count / 1000000000)}M`;
    } else if (count >= 1000000) {
      return `${String.format("%.2f", count / 1000000)}JT`;
    } else if (count >= 1000) {
      return `${String.format("%.2f", count / 1000)}RB`;
    } else {
      return `${count}`;
    }
  };

  const _getData = () => {
    setLoading(true);
    service
      .get("/stats")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setData({});
        setLoading(false);
      });
  };

  useEffect(() => {
    context.setActive("dashboard");
  }, [context]);

  useEffect(() => {
    _getData();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <Fragment>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Heading>Dashboard</Heading>
      <div className="grid grid-flow-row grid-cols-4 gap-5 lg:gap-8 p-5 lg:p-8">
        <DashCard
          icon={FaBox}
          boxClassName="bg-primary-base text-white"
          title="Produk"
        >
          {_changeFormat(data.products)}
        </DashCard>
        <DashCard
          icon={FaBoxes}
          boxClassName="bg-red-500 text-white"
          title="Kategori"
        >
          {_changeFormat(data.categories)}
        </DashCard>
        <DashCard
          icon={FaArrowUp}
          boxClassName="bg-yellow-400 text-white"
          title="Terjual Hari Ini"
        >
          {_changeFormat(data.invoices)}
        </DashCard>
        <DashCard
          icon={FaDollarSign}
          boxClassName="bg-green-700 text-white"
          title="Pemasukan Hari Ini"
        >
          {_changeFormat(data.income)}
        </DashCard>
      </div>
      <div className="mx-5 lg:mx-8 mb-8 mt-0 bg-white p-5">
        <Line
          data={{
            labels: data.graph?.map((item) => item.date),
            datasets: [
              {
                label: "Item Terjual",
                data: data.graph?.map((item) => item.val),
                borderWidth: 2,
                borderColor: "rgb(75, 192, 192)",
              },
            ],
          }}
        />
      </div>
    </Fragment>
  );
}

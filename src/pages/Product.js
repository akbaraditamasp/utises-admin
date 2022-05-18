import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaPlus } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import BaseLink from "../components/BaseLink";
import Heading from "../components/Heading";
import PageLoader from "../components/PageLoader";
import ProductList from "../components/ProductList";
import service from "../service";

export default function Product() {
  const context = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const _getData = () => {
    setLoading(true);
    service
      .get("/product")
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
    context.setActive("product");
    _getData();
  }, [context]);

  if (loading) return <PageLoader />;

  return (
    <Fragment>
      <Helmet>
        <title>Produk</title>
      </Helmet>
      <Heading>Produk</Heading>
      <div className="p-5 lg:p-8">
        <BaseLink to="/product/add">
          <FaPlus className="inline text-sm mr-2" />
          Tambah
        </BaseLink>
        {data.length ? (
          data.map((item, index) => (
            <ProductList
              id={item.id}
              title={item.name}
              date={item.updated_at}
              image={item.images[0]?.url}
              key={`${index}`}
              afterDelete={() => _getData()}
            />
          ))
        ) : (
          <div className="bg-white rounded-sm text-center p-5 mt-5">
            Belum ada produk
          </div>
        )}
      </div>
    </Fragment>
  );
}

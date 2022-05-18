import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import NumberField from "../components/input/NumberField";
import SelectField from "../components/input/SelectField";
import Textarea from "../components/input/Textarea";
import TextField from "../components/input/TextField";
import BaseButton from "../components/input/BaseButton";
import DropField from "../components/input/DropField";
import { FaTimes } from "react-icons/fa";
import service from "../service";
import MiniLoader from "../components/MiniLoader";
import Heading from "../components/Heading";
import PageLoader from "../components/PageLoader";
import { toast } from "react-toastify";

function mergeImage(values = []) {
  return values.map((value) => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    } else {
      return value.url;
    }
  });
}

function mergeCategories(values = [], options = []) {
  return values.map((value) =>
    value.id
      ? options.find((element) => element.value === value.id)
      : { label: value.name, value: value.name, __isNew__: true }
  );
}

export default function ComposeProduct({ edit = false }) {
  const { id } = useParams();
  const [pageLoad, setPageLoad] = useState(edit);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const context = useOutletContext();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categories: [],
      images: [],
      file: null,
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const _getData = () => {
    setPageLoad(true);
    service
      .get("/product/" + id)
      .then(
        ({ data: { name, description, price, categories, images, file } }) => {
          reset({
            name,
            description,
            price,
            categories: categories.map((value) => ({ id: value.id })),
            images,
            file,
          });
          setPageLoad(false);
        }
      )
      .catch(() => {});
  };

  const _getCategory = () => {
    service
      .get("/category")
      .then((response) => {
        setCategoryOptions(
          response.data.map((value) => ({ value: value.id, label: value.name }))
        );
      })
      .catch(() => {});
  };

  const _proceed = ({ name, description, price, categories, images, file }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    if (file instanceof File) formData.append("file", file);
    for (let category of categories) {
      if (category.id) {
        formData.append("categories[]", category.id);
      } else {
        formData.append("create_categories[]", category.name);
      }
    }
    for (let image of images) {
      if (image instanceof File) {
        formData.append(edit ? "uploaded_images[]" : "images[]", image);
      } else {
        formData.append("images[]", image.id);
      }
    }

    setLoading(true);
    service({
      url: edit ? "/product/" + id : "/product",
      data: formData,
      method: edit ? "PUT" : "POST",
    })
      .then((response) => {
        toast.success("Berhasil disimpan");
        setLoading(false);
        if (edit) _getCategory();
        navigate("/product/" + response.data.id, {
          replace: true,
        });
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    context.setActive("product");
  }, [context]);

  useEffect(() => {
    if (edit) {
      _getData();
    }
  }, [edit]);

  useEffect(() => {
    _getCategory();
  }, [id]);

  if (pageLoad) return <PageLoader />;

  return (
    <Fragment>
      <Helmet>
        <title>Tambah Produk</title>
      </Helmet>
      <Heading>{edit ? "Edit Produk" : "Tambah Produk"}</Heading>
      <form
        onSubmit={handleSubmit(_proceed)}
        className="flex flex-col lg:flex-row p-5 lg:p-8"
      >
        <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mr-0 lg:mr-8 border-r-0 lg:border-r">
          <TextField
            label="Nama Produk"
            type="text"
            className="mb-4"
            message={errors.name?.message}
            {...register("name", {
              required: "Tidak boleh kosong",
              minLength: {
                value: 30,
                message: "Tidak boleh kurang dari 30 karakter",
              },
            })}
          />
          <Textarea
            label="Deskripsi Produk"
            rows={4}
            className="mb-4"
            message={errors.description?.message}
            {...register("description", {
              required: "Tidak boleh kosong",
              minLength: {
                value: 120,
                message: "Tidak boleh kurang dari 120 karakter",
              },
            })}
          />
          <Controller
            control={control}
            name="price"
            rules={{ required: "Tidak boleh kosong" }}
            render={({ field: { value, onChange } }) => (
              <NumberField
                thousandSeparator={true}
                value={value}
                prefix="Rp"
                label="Harga"
                type="text"
                message={errors.price?.message}
                className="mb-4"
                onValueChange={({ value }) => onChange(value)}
              />
            )}
          />
          <Controller
            control={control}
            name="categories"
            render={({ field: { value, onChange } }) => (
              <SelectField
                className="mb-4"
                label="Kategori"
                isMulti={true}
                options={categoryOptions}
                value={mergeCategories(value, categoryOptions)}
                onChange={(inputValue) => {
                  const values = [];
                  for (let value of inputValue) {
                    if (value.__isNew__) {
                      values.push({ name: value.value });
                    } else {
                      values.push({ id: value.value });
                    }
                  }

                  onChange(values);
                }}
              />
            )}
          />
          <BaseButton
            type="submit"
            disabled={loading}
            className="hidden lg:block"
          >
            {loading ? <MiniLoader /> : "Posting"}
          </BaseButton>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-sm p-5">
            <p className="font-bold text-gray-800 mb-5">Gambar Produk</p>
            <Controller
              control={control}
              name="images"
              render={({ field: { value, onChange } }) => (
                <Fragment>
                  <DropField
                    onSelect={(files) => {
                      onChange([...value, ...files]);
                    }}
                  />
                  {value.length ? (
                    <div className="grid grid-flow-row grid-cols-3 gap-5 mt-5">
                      {mergeImage(value).map((image, index) => (
                        <div
                          className="w-16-9 bg-black group"
                          key={`img-${index}`}
                        >
                          <img src={image} />
                          <div className="bg-black absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-50" />
                          <button
                            onClick={() => {
                              const temp = value;
                              temp.splice(index, 1);
                              onChange(temp);
                            }}
                            type="button"
                            className="absolute top-0 right-0 w-5 h-5 bg-red-400 rounded-sm m-1 opacity-0 group-hover:opacity-100 flex justify-center items-center"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Fragment>
              )}
            />
          </div>
          <div className="bg-white rounded-sm mt-5 p-5">
            <p className="font-bold text-gray-800 mb-5">Downloadable File</p>
            <Controller
              control={control}
              name="file"
              rules={{ required: "Tidak boleh kosong" }}
              render={({ field: { value, onChange } }) => (
                <Fragment>
                  <DropField
                    multiple={false}
                    message={errors.file?.message}
                    onSelect={(files) => {
                      onChange(files[0]);
                    }}
                  />
                  {value && (
                    <div className="bg-blue-200 py-2 px-5 mt-5">
                      {value instanceof File ? value.name : value}
                    </div>
                  )}
                </Fragment>
              )}
            />
          </div>
          <BaseButton
            type="submit"
            disabled={loading}
            className="block lg:hidden mt-5"
          >
            {loading ? <MiniLoader /> : "Posting"}
          </BaseButton>
        </div>
      </form>
    </Fragment>
  );
}

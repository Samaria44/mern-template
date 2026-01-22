import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MiniDrawer from "../components/MiniDrawer";
import { storeService } from "../services/storeServices";
import { CircularProgress } from "@mui/material";

const ProductDetail = () => {
  const { code } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await storeService.getStoreByCode(code);
        setItem(data);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [code]);

  if (loading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <p>Product not found.</p>
      </>
    );
  }

  return (
    <>
      <h1>{item.name}</h1>
      <p>Weight: {item.weight}</p>
      <p>Carats: {item.carats}</p>
      <p>Price: {item.price}</p>
      <p>Code: {item.code}</p>
    </>
  );
};

export default ProductDetail;

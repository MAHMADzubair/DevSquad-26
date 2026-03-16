import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductDetails from '../components/product/ProductDetails';
import ProductInfo from '../components/product/ProductInfo';
import RecommendedProducts from '../components/product/RecommendedProducts';
import { getProductById } from '../services/productService';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data.success) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <main className="flex-1 flex flex-col w-full bg-[var(--color-brand-bg)]">
      <div className="max-w-[1400px] w-full mx-auto px-8 lg:px-16 pt-12">
        {/* Breadcrumbs */}
        <div className="text-[10px] font-semibold tracking-[0.5px] text-gray-500 uppercase mb-16">
          <Link to="/" className="hover:text-black">HOME</Link> / <Link to="/collection" className="hover:text-black">COLLECTIONS</Link> / {product.category} / <span className="text-[var(--color-brand-primary)]">{product.name}</span>
        </div>
        
        <ProductDetails product={product} />
      </div>

      <ProductInfo product={product} />

      <RecommendedProducts currentProductId={product._id} />
    </main>
  );
};

export default ProductPage;

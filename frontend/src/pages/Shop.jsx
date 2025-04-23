import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';

import { setCategories, setProducts, setChecked, setRadio } from '../redux/features/shop/shopSlice';
import Loader from '../components/Loader';
import ProductCard from './Products/ProductCard';

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const isBikeServicePage = categoryParam === 'Bike Service';

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState('');

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  // Handle category query parameter
  useEffect(() => {
    if (categoryParam && categoriesQuery.data) {
      const category = categoriesQuery.data.find((c) => c.name === categoryParam);
      if (category) {
        dispatch(setChecked([category._id]));
      }
    } else {
      // Reset filters when there's no category parameter
      dispatch(setChecked([]));
      dispatch(setRadio([]));
    }
  }, [location.search, categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      if (isBikeServicePage) {
        // If on Bike Service page, only show Bike Service category
        const bikeServiceCategory = categoriesQuery.data.find(
          (category) => category.name === 'Bike Service'
        );
        dispatch(setCategories(bikeServiceCategory ? [bikeServiceCategory] : []));
      } else {
        // Otherwise, filter out Bike Service category
        const filteredCategories = categoriesQuery.data.filter(
          (category) => category.name !== 'Bike Service'
        );
        dispatch(setCategories(filteredCategories));
      }
    }
  }, [categoriesQuery.data, dispatch, categoriesQuery.isLoading, isBikeServicePage]);

  useEffect(() => {
    if ((!checked.length || !radio.length) && filteredProductsQuery.data) {
      let filteredProducts;

      if (isBikeServicePage) {
        // If on Bike Service page, only show Bike Service products
        filteredProducts = filteredProductsQuery.data.filter(
          (product) => product.category?.name === 'Bike Service'
        );
      } else {
        // Otherwise, filter out Bike Service products
        filteredProducts = filteredProductsQuery.data.filter(
          (product) => product.category?.name !== 'Bike Service'
        );
      }

      // Apply price filter
      filteredProducts = filteredProducts.filter((product) => {
        return (
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
      });

      // Sort products alphabetically by name
      const sortedProducts = [...filteredProducts].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );

      dispatch(setProducts(sortedProducts));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, isBikeServicePage]);

  const handleBrandClick = (brand) => {
    if (filteredProductsQuery.data) {
      let productsToShow;

      if (isBikeServicePage) {
        // If on Bike Service page, only show Bike Service products
        if (brand === 'All Brands') {
          productsToShow = filteredProductsQuery.data.filter(
            (product) => product.category?.name === 'Bike Service'
          );
        } else {
          productsToShow = filteredProductsQuery.data.filter(
            (product) => product.brand === brand && product.category?.name === 'Bike Service'
          );
        }
      } else {
        // Otherwise, filter out Bike Service products
        if (brand === 'All Brands') {
          productsToShow = filteredProductsQuery.data.filter(
            (product) => product.category?.name !== 'Bike Service'
          );
        } else {
          productsToShow = filteredProductsQuery.data.filter(
            (product) => product.brand === brand && product.category?.name !== 'Bike Service'
          );
        }
      }

      // Sort products alphabetically by name
      const sortedProducts = [...productsToShow].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      dispatch(setProducts(sortedProducts));
    }
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  // Get unique brands and sort them alphabetically
  const uniqueBrands = filteredProductsQuery.data
    ? Array.from(
        new Set(
          filteredProductsQuery.data
            .map((product) => product.brand)
            .filter((brand) => brand !== undefined)
        )
      ).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    : [];

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  if (filteredProductsQuery.isLoading) {
    return <Loader />;
  }

  if (filteredProductsQuery.error) {
    return <div className="text-center text-red-500">Error loading products</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHero
        title="Shop"
        description="Discover our amazing collection of products"
        backgroundImage="/images/shopHero.webp"
      />
      <div className="container mx-auto px-4 py-8 my-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4 bg-[#1A1A1A] rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Filters</h2>

            {/* Categories Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Categories
              </h3>
              <div className="space-y-3">
                {categories?.map((c) => (
                  <div key={c._id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${c._id}`}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 focus:ring-2"
                    />
                    <label
                      htmlFor={`category-${c._id}`}
                      className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                    >
                      {c.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Brands
              </h3>
              <div className="space-y-3">
                {uniqueBrands?.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      type="radio"
                      id={`brand-${brand}`}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 focus:ring-pink-500 focus:ring-2"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="ml-3 text-sm font-medium text-gray-300 hover:text-white cursor-pointer"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
                Price
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 pb-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition duration-300"
            >
              Reset Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col items-start mb-8">
              <h2 className="text-3xl font-bold text-black mb-2">
                {isBikeServicePage ? 'Bike Service' : 'Our Collection'}
              </h2>
              <div className="flex items-center">
                <span className="text-xl text-pink-500 font-semibold">{products?.length || 0}</span>
                <span className="text-gray-400 ml-2 text-lg">Products Available</span>
              </div>
              <div className="w-20 h-1 bg-pink-500 mt-4"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
              {!products || products.length === 0 ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : (
                products?.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;

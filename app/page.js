import CategoryListings from "./components/CategoryListings/CategoryListings";
import LatestProducts from "./components/LatestProducts/LatestProducts";
import TopProductBanners from "./components/TopProductBanners/TopProductBanners";

export default function Home() {
  return (
    <div className="middle_content">
      <TopProductBanners />
      <div className="category_product_listing">
        <CategoryListings />
      </div>
      <div className="latest_product_listing">
        <LatestProducts />
      </div>
    </div>
  );
}

import Loader from "./Loader";

export default function PageLoader() {
  return (
    <div className="page-loader">
      <Loader />

      <span>
        Завантаження...
      </span>
    </div>
  );
}
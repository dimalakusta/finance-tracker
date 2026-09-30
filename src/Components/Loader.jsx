export default function Loader({
  small = false,
}) {
  return (
    <div
      className={
        small
          ? "loader small"
          : "loader"
      }
    />
  );
}
export default function Alert({ message, type }) {

  if (!message) return null;

  const styles = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500"
  };

  return (
    <div className={`text-white px-4 py-2 rounded ${styles[type]} mb-4`}>
      {message}
    </div>
  );
}
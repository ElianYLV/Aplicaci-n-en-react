export default function Table({ columns, data, onDelete, onEdit }) {

  return (
    <table className="w-full border-collapse">

      <thead className="bg-gray-800 text-white">
        <tr>

          {columns.map((col, i) => (
            <th key={i} className="border p-2 text-left">
              {col}
            </th>
          ))}

          <th className="border p-2">
            Acciones
          </th>

        </tr>
      </thead>

      <tbody>

        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border">

            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border p-2">
                {cell}
              </td>
            ))}

            <td className="border p-2 flex gap-2">

              <button
                onClick={() => onEdit && onEdit(rowIndex)}
                className="px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
              >
                Editar
              </button>

              <button
                onClick={() => onDelete && onDelete(rowIndex)}
                className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700 transition"
              >
                Eliminar
              </button>

            </td>

          </tr>
        ))}

      </tbody>

    </table>
  );
}
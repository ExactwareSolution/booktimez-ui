import React, { useState, useMemo } from "react";

const DataTable = ({
  columns,
  data,
  pageSizeOptions = [5, 10, 20],
  actions,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSizeOptions[0]);

  // 🔍 Search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.accessor] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, data, columns]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredData.length / limit);
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  return (
    <div className="bg-white border border-violet-600 rounded-xl shadow-sm p-4 space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-violet-600 rounded-lg px-3 py-2 text-sm w-full sm:w-64"
        />

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-violet-600 rounded-lg px-3 py-2 text-sm w-32"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / page
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-violet-600 bg-gray-50 text-gray-600">
              {columns.map((col) => (
                <th key={col.accessor} className="text-left px-4 py-2">
                  {col.header}
                </th>
              ))}
              {actions && <th className="px-4 py-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.accessor} className="px-4 py-2">
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-2 space-x-2">
                      {actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => action.onClick(row)}
                          className={`text-xs px-3 py-1 rounded-md ${action.className}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-6 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm">
        <span>
          Page {page} of {totalPages || 1}
        </span>

        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border border-violet-600 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border border-violet-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;

const TableWidget: React.FC<any> = (props: any) => {
  const { data } = props;
  const fields = ["objectid", "num_deaths", "sec", "year_"];

  return (
    <div className="bg-white p-5 overflow-scroll" style={{ height: 370 }}>
      <table className="table-auto">
        <thead>
          <tr className="bg-gray-200">
            {fields.map((field: any, index: number) => {
              return (
                <th key={index} className="px-4 py-2">
                  {field}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.map((row: any, index: number) => {
            return (
              <tr key={index}>
                {fields.map((field: any, index: number) => {
                  return (
                    <td key={index} className="border px-4 py-2">
                      {row[field]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableWidget;

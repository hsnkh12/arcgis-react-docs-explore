export const parkPopupTemplate = () => {
  return {
    title: "{Park}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "TOTAL",
            label: "Total visits",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
          {
            fieldName: "F2018",
            label: "2018",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
          {
            fieldName: "F2019",
            label: "2019",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
          {
            fieldName: "F2020",
            label: "2020",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
        ],
      },
    ],
  };
};

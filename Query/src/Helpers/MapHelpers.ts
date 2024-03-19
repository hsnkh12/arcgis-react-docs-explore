export const parkPopupTemplate = () => {
  return {
    title: "{name}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "num_deaths",
            label: "Deaths",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
          {
            fieldName: "year_",
            label: "Year",
            format: {
              places: 0,
              digitSeparator: true,
            },
          },
          {
            fieldName: "sec",
            label: "Seconds",
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

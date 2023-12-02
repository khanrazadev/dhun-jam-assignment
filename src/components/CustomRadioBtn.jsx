// eslint-disable-next-line react/prop-types
export default function CustomRadioBtn({ setSelectedOption, selectedOption }) {
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  let opt = selectedOption ? "yes" : "no";

  const options = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <div className="flex gap-4 w-[300px] justify-center">
      {options.map((option) => (
        <div
          key={option.value}
          className="flex items-center gap-4"
          onClick={() => handleOptionChange(option.value)}
        >
          <div
            className={`w-4 h-4 flex justify-center items-center rounded-full bg-white border border-red-500 ${
              opt !== option.value ? "border-opacity-0" : ""
            }`}
          >
            {opt === option.value && (
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            )}
          </div>
          <label>{option.label}</label>
        </div>
      ))}
    </div>
  );
}

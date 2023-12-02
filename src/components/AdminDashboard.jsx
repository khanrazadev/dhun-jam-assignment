import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import CustomRadioBtn from "./CustomRadioBtn";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [chargeToCustomers, setChargeToCustomers] = useState(true);
  const [amount, setAmount] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [allowedToSave, setAllowedToSave] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!storedAdminInfo) {
          navigate("/");
          return;
        }
        const { data } = await axios.get(
          `https://stg.dhunjam.in/account/admin/${storedAdminInfo.id}`
        );
        setAdminData(data);
        setChargeToCustomers(data?.data?.charge_customers);
        // Assuming your received data structure has amounts for the categories
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handlePriceUpdate = async () => {
    if (Object.keys(amount).length < 1) return;
    setLoading(true);
    try {
      const updatedAmount = { ...adminData.data.amount };

      // Validation checks for custom song request amount
      if (amount.category_6 && parseInt(amount.category_6) <= 99) {
        setLoading(false);
        toast.error("Custom song request amount should be greater than 99");
        return;
      }

      Object.keys(amount).forEach((key) => {
        if (key !== "category_6") {
          const parsedValue = parseInt(amount[key]);
          const currentValue = updatedAmount[key];

          if (!isNaN(parsedValue) && parsedValue <= currentValue) {
            setLoading(false);
            setAllowedToSave(true);
            alert(
              `The value for ${key} should be greater than ${currentValue}`
            );
            return;
          }

          updatedAmount[key] = parsedValue;
        } else {
          updatedAmount[key] = parseInt(amount[key]);
        }
      });

      await axios.put(
        `https://stg.dhunjam.in/account/admin/${adminData?.data?.id}`,
        { amount: updatedAmount }
      );

      setLoading(false);
      toast.success("Amount Updated Successfully");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  let newData = adminData?.data?.amount;
  let labels = newData ? ["Custom", ...Object.keys(newData).slice(1)] : [];

  const data = {
    labels: labels, // Dynamically generate labels from keys
    datasets: [
      {
        backgroundColor: "#F0C3F1",
        hoverBackgroundColor: "#F0C3F1",
        barThickness: 30,
        borderRadius: 5,
        borderWidth: 2, // Border width for all sides of the bars
        data: newData
          ? Object.values(newData) // Use values of newData as bar data
          : [], // Sample amounts for each category if newData is not available
      },
    ],
  };

  const options = {
    indexAxis: "x", // Set the index axis to 'y' for vertical bars
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: false, // Hide title
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis gridlines
        },
      },
      y: {
        display: false, // Hide y-axis labels
        grid: {
          display: false, // Hide y-axis gridlines
        },
      },
    },
  };

  return (
    <div className="container sm:max-w-xl px-4 sm:px-0 max-w-md h-[100vh] flex flex-col gap-4 justify-center">
      <label className="text-heading font-extrabold justify-center flex">
        {adminData?.data.name}, {adminData?.data.location} on Dhun Jam
      </label>

      <div className=" flex flex-col gap-4">
        <div className="flex justify-between">
          <p className=" w-[40%]">
            Do you want to charge your customers for requesting songs?
          </p>
          <CustomRadioBtn
            setSelectedOption={setChargeToCustomers}
            selectedOption={chargeToCustomers}
          />
        </div>
        <div className="flex justify-between">
          <p className="w-[40%]">Custom song request amount- </p>
          <input
            type="text"
            defaultValue={adminData?.data?.amount?.category_6}
            onChange={(e) =>
              setAmount({ ...amount, category_6: e.target.value })
            }
            disabled={chargeToCustomers ? false : true}
            className={`bg-transparent border w-[300px] h-10 rounded-xl p-1 text-center ${
              !chargeToCustomers
                ? "border-[#c2c2c2] text-[#c2c2c2] cursor-not-allowed"
                : "border-[#ffffff]"
            }`}
          />
        </div>
        <div className="flex justify-between">
          <p className=" w-[40%]">
            Regular song request amounts, from high to low-
          </p>
          <div className=" flex w-[300px] h-10 justify-between">
            {Object.keys(adminData?.data?.amount || {}).map(
              (categoryKey, index) => (
                <input
                  type="number"
                  key={index}
                  defaultValue={adminData?.data?.amount[categoryKey] || ""} // Use value instead of defaultValue
                  disabled={chargeToCustomers ? false : true}
                  className={`bg-transparent border rounded-xl w-12 text-center ${
                    !chargeToCustomers
                      ? "border-[#c2c2c2]  text-[#c2c2c2] cursor-not-allowed"
                      : "border-[#ffffff]"
                  }`}
                  onChange={(e) => {
                    const updatedAmountValue = e.target.value;
                    const currentValue = adminData?.data?.amount[categoryKey];

                    // Check if the entered value is less than the current value
                    if (parseInt(updatedAmountValue) < currentValue) {
                      setAllowedToSave(true);
                    } else {
                      setAllowedToSave(false);
                    }

                    setAmount({ ...amount, [categoryKey]: updatedAmountValue });
                  }} // Update amount object on change
                />
              )
            )}
          </div>
        </div>
      </div>

      {chargeToCustomers && <Bar data={data} options={options} />}
      <button
        disabled={chargeToCustomers ? false : true}
        className={`p-2 rounded-xl ${
          !chargeToCustomers ||
          parseInt(amount?.category_6) < 99 ||
          allowedToSave
            ? "bg-[#c2c2c2] cursor-not-allowed"
            : "bg-[#6741D9]"
        }`}
        onClick={handlePriceUpdate}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default AdminDashboard;

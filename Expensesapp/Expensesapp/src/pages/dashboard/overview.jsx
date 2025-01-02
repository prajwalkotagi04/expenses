import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export function Overview() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editExpense, setEditExpense] = useState({
    id: "",
    amount: "",
    category: "",
    date: "",
    time: "",
    paymentMethod: "",
    location: "",
    note: "",
  });

  // Fetch expenses from the server
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:5000/expenses");
        if (response.ok) {
          const result = await response.json();
          setExpenses(result.expenses);
          console.log('Featch data from database successfully')
        } else {
          setError("Failed to load expenses.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An error occurred while fetching expenses.");
      }
    };
    fetchExpenses();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/expenses/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense.id !== id));
      } else {
        setError("Failed to delete expense.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while deleting the expense.");
    }
  };

  // Open edit modal with current expense details
  const handleEdit = (expense) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS

    setEditExpense({
      ...expense,
      date: formattedDate,
      time: formattedTime,
    });
    setIsEditOpen(true);
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/expenses/${editExpense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: editExpense.amount,
          category: editExpense.category,
          paymentMethod: editExpense.paymentMethod,
          location: editExpense.location,
          note: editExpense.note,
        }),
      });

      if (response.ok) {
        setExpenses(
          expenses.map((expense) =>
            expense.id === editExpense.id ? editExpense : expense
          )
        );
        setIsEditOpen(false);
      } else {
        setError("Failed to update expense.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while updating the expense.");
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Overview Expenses
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Amount", "Category", "Date", "Time", "Method", "Location", "Note", "Actions"].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-5 py-3">{expense.id}</td>
                    <td className="px-5 py-3">₹ {expense.amount}</td>
                    <td className="px-5 py-3">{expense.category}</td>
                    <td className="px-5 py-3">{expense.date}</td>
                    <td className="px-5 py-3">{expense.time}</td>
                    <td className="px-5 py-3">{expense.paymentMethod}</td>
                    <td className="px-5 py-3">{expense.location}</td>
                    <td className="px-5 py-3">{expense.note}</td>
                    <td className="px-5 py-3">
                      <ul className="flex gap-5">
                        <li>
                          <PencilIcon
                            className="w-4"
                            onClick={() => handleEdit(expense)}
                          />
                        </li>
                        <li>
                          <TrashIcon
                            className="w-4"
                            onClick={() => handleDelete(expense.id)}
                          />
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    {error ? error : "No expenses available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} handler={setIsEditOpen}>
        <DialogHeader>Edit Expense</DialogHeader>
        <DialogBody divider>
          <div className="grid gap-4">
            <Input
              label="Amount"
              value={editExpense.amount}
              onChange={(e) =>
                setEditExpense({ ...editExpense, amount: e.target.value })
              }
            />
            <Input
              label="Category"
              value={editExpense.category}
              onChange={(e) =>
                setEditExpense({ ...editExpense, category: e.target.value })
              }
            />
            <Input label="Date" value={editExpense.date} readOnly />
            <Input label="Time" value={editExpense.time} readOnly />
            <Input
              label="Payment Method"
              value={editExpense.paymentMethod}
              onChange={(e) =>
                setEditExpense({ ...editExpense, paymentMethod: e.target.value })
              }
            />
            <Input
              label="Location"
              value={editExpense.location}
              onChange={(e) =>
                setEditExpense({ ...editExpense, location: e.target.value })
              }
            />
            <Input
              label="Note"
              value={editExpense.note}
              onChange={(e) =>
                setEditExpense({ ...editExpense, note: e.target.value })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="gray"
            onClick={() => setIsEditOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleUpdate}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Overview;

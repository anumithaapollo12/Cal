import { motion } from "framer-motion";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface MobileDatePickerProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function MobileDatePicker({
  currentDate,
  onDateChange,
}: MobileDatePickerProps) {
  const dates = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const date =
      offset < 0
        ? subDays(currentDate, Math.abs(offset))
        : addDays(currentDate, offset);
    return date;
  });

  return (
    <div className="md:hidden w-full bg-white border-b border-gray-200">
      <div className="px-4 py-3">
        {/* Date Picker */}
        <div className="flex justify-between items-center">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className="flex-1 flex flex-col items-center"
            >
              <span className="text-xs font-medium text-gray-500 mb-1">
                {format(date, "EEE")}
              </span>
              <motion.div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium
                  ${
                    isSameDay(date, currentDate)
                      ? "bg-blue-600 text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {format(date, "d")}
              </motion.div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

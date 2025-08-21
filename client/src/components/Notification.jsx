import { useSelector } from "react-redux";

const Notification = () => {
  const message = useSelector((state) => state.notification.message);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/95 font-mono">
      <div className="border p-1 w-full h-[18em] max-w-md">
        <div className="border w-full h-full p-6 pb-3 flex flex-col justify-between items-center">
          <div>
            <p>{message || "No Notification Yet !"}</p>
          </div>
          <button
            className="border px-6 py-1 cursor-pointer font-semibold text-sm"
            onClick={() => {
              document.querySelector(".fixed.inset-0.z-50").style.display =
                "none";
            }}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;

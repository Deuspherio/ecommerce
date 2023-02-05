const MessageBox = ({ children, danger, info }) => {
  return (
    <div
      className={`${
        danger
          ? "bg-red-500 border-red-600"
          : info
          ? "bg-blue-400 border-primary"
          : ""
      } custom-container text-white px-6 py-4 rounded border`}
    >
      {children}
    </div>
  );
};

export default MessageBox;

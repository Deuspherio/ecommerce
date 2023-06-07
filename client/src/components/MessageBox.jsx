const MessageBox = ({ children, danger, info }) => {
  return (
    <div
      className={`${
        danger
          ? "bg-red-600 border-red-600 text-white"
          : info
          ? "text-white border-blue-600 bg-blue-600"
          : ""
      } custom-container text-white px-6 py-4 rounded border`}
    >
      {children}
    </div>
  );
};

export default MessageBox;

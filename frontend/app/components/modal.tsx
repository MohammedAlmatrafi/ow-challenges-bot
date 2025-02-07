type modal = {
  children: React.ReactNode;
  title: string;
  modalHandler: (b: boolean) => void;
};

const Modal = ({ children, title, modalHandler }: modal) => {
  return (
    <div className="bg-black/15 absolute top-0 left-0 h-dvh w-dvw flex items-center justify-center">
      <div className="bg-white w-xl p-5 rounded-xl">
        <div className="flex justify-between mb-5 ">
          <h1 className="font-bold text-xl">{title}</h1>
          <p
            onClick={() => modalHandler(false)}
            className="font-bold select-none cursor-pointer w-7 h-7 rounded-full flex items-center justify-center text-red-700 bg-red-50 hover:bg-red-100 duration-150 active:scale-95"
          >
            X
          </p>
        </div>
        <section className="flex flex-col">{children}</section>
      </div>
    </div>
  );
};
export default Modal;

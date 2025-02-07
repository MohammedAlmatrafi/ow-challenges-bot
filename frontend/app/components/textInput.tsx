interface textInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref: React.Ref<HTMLInputElement>;
}

const TextInput: React.FC<textInput> = ({ label, ref, ...props }) => {
  return (
    <div className="flex items-center gap-3">
      <label>{label}</label>
      <input
        ref={ref}
        type="text"
        className="border border-gray-300 rounded-md py-1 px-2"
        autoFocus
        {...props}
      />
    </div>
  );
};
export default TextInput;

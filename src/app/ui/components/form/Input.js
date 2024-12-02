function InputBox({ type, name, value, handleChange, placeholder, customClassName }) {
    return (
        <input
            type={type}
            name={name}
            defaultValue={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full p-3 border-[1.5px] ${customClassName}
                }  rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600`}
        />
    )
}
export default InputBox
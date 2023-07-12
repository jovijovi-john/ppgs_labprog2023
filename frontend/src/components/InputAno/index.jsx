export default function InputAno({ ano, setAno, className }) {
  const handleInputAno = (e) => {
    const inputAno = e.target.value;
    const regex = /^\d{0,4}$/; // Expressão regular para permitir até 4 dígitos
    if (regex.test(inputAno)) {
      setAno(inputAno);
    }
  };

  return (
    <input
      className={`${className}`}
      type="text"
      id="inputAno"
      pattern="\d{0,4}" // Atributo pattern para validar a entrada
      maxLength={4} // Limita o comprimento máximo do input a 4 caracteres
      value={ano}
      onChange={handleInputAno}
    />
  );
}

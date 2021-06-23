import { getNewId } from "../services/idService";

export default function TextArea({
  labelDescription = 'Descrição do label:',
  inputTextArea = 'Valor padrão do Text Area',
  onTextAreaChange = null,
  id = getNewId(),
  maxLength = 230,
  rows = 4,
}) {
  function handleInputChange({ currentTarget }) {
    if (onTextAreaChange) {
      const newValue = currentTarget.value;
      onTextAreaChange(newValue);
    }
  }

  const currentCharacterCount = inputTextArea.length;

  return (
    <div className="flex flex-col my-4">
      <label className="text-sm mb-1" htmlFor={id}>
        {labelDescription}
      </label>

      <textarea
        id={id}
        className="border p-1"
        maxLength={maxLength}
        rows={rows}
        value={inputTextArea}
        onChange={handleInputChange}
      />

      <div className="text-right mr-2">
        <span>{currentCharacterCount} / {maxLength}</span>
      </div>
    </div>
  );
}

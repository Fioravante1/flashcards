import React, {useEffect, useState} from 'react'
import Button from './Button';
import TextArea from './TextArea'
import TextInput from './TextInput'
import Error from './Error';
import { span } from 'prelude-ls';

function FlashCardForm({createMode = true, onPersist = null, children: flashcard = null}) {

  const [title, setTitle] = useState(flashcard?.title || '');
  const [description, setDescription] = useState(flashcard?.description || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if(createMode) {
      setTitle('');
      setDescription('');
    }
  }, [createMode]);

  function handleInputChange(newTitle) {
    setTitle(newTitle)
  }

  function handleDescriptionChange(newDescription) {
    setDescription(newDescription)
  }

  function clearFields() {
    setTitle('');
    setDescription('');
  }

  function validateForm() {
    return title.trim() !== '' 
    && description.trim() !== '';
   }

  function handleFormSubmit(event) {
    event.preventDefault();

    if(validateForm()) { 
      setError('');
      if(onPersist) {
        onPersist(title, description);
        clearFields();
      }
    } else {
      setError('Título e Descrição são obrigatórios!')
    }
  }

  function handleFormReset() {
   clearFields();
  }

  const backgroundClassName = createMode ? 'bg-green-100' : 'bg-yellow-100'
  return (
    <form 
      className={`${backgroundClassName} p-4`} 
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
    >
      <h2 className="text-center font-semibold">Manutenção de Flash Cards</h2>

      <TextInput 
        labelDescription="Título:" 
        inputValue={title}
        onInputChange={handleInputChange}
      />
      <TextArea 
        labelDescription="Descrição:" 
        inputTextArea={description}
        onTextAreaChange={handleDescriptionChange}
      />

      <div className="flex item-center justify-between">
        {error.trim() !== '' ? <Error>{error}</Error> : <span>&nbsp;</span>}
        <div>
          <Button colorClass="bg-red-500" type="reset">Limpar</Button>
          <Button colorClass="bg-green-500" type="submit">Salvar</Button>
        </div>
      </div>
    </form>
  )
}

export default FlashCardForm

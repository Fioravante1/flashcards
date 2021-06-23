import React from 'react'
import {TiEdit as EditIcon} from 'react-icons/ti'
import {AiOutlineDelete as DeleteIcon} from 'react-icons/ai'

function FlashCardItem({ 
  children: flashcard, 
  onDelete = null,
  onEdit = null
}) {
  const { title, description } = flashcard;

  function handleDeleteIconClick() {
    if(onDelete) {
      onDelete(flashcard.id);
    };
  };
  function handleEditIconClick() {
    if(onEdit) {
      onEdit(flashcard);
    };
  };

  return (
    <div className="border p-2 m-2">
      <ul className="flex flex-col space-y-2">
        <li>
          <strong>Título:</strong> <span>{title}</span>
        </li>
        <li>
          <strong>Descrição:</strong> <span>{description}</span>
        </li>
      </ul>
      <div className="mt-4 flex flex-row items-center justify-end space-x-4">
        <EditIcon 
          className="cursor-pointer" 
          size={26} 
          onClick={handleEditIconClick}
        />
        <DeleteIcon 
          onClick={handleDeleteIconClick}
          className="cursor-pointer" 
          size={26} 
        />
      </div>
    </div>
  )
}

export default FlashCardItem

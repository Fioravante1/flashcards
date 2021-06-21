import { useState, useEffect } from 'react';
import Button from '../components/Button';
import FlashCard from '../components/FlashCard';
import FlashCards from '../components/FlashCards';
import Header from '../components/Header';
import Main from '../components/Main';
import RadioButton from '../components/RadioButton';
import { helperShuffleArray } from '../helpers/arrayHelpers';
import { apiGetAllFlashCards } from '../services/apiServises';

export default function FlashCardsPage() {
  const [allCards, setAllCards] = useState([]);
  const [studyCards, setStudyCards] = useState([]);
  const [radioButtonShowTitle, setRadioButtonShowTitle] = useState(true);
  const [lading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllCards() {
      const backEndAllCards = await apiGetAllFlashCards();
      setAllCards(backEndAllCards);
      setLoading(false);
    }
    getAllCards();
  }, []);

  function handleShuffle() {
    const shuffledCards = helperShuffleArray(studyCards);
    setStudyCards(shuffledCards);
  }

  useEffect(() => {
    setStudyCards(allCards.map(card => ({...card, showTitle: true})))
  }, [allCards]);

  function handleRadioShowDescriptionClick() {
    const updatedCards = [...studyCards].map(card => ({...card, showTitle: false}));
    setStudyCards(updatedCards);
    setRadioButtonShowTitle(false);
  }

  function handleRadioShowTitleClick() {
    const updatedCards = [...studyCards].map(card => ({...card, showTitle: true}));
    setStudyCards(updatedCards);
    setRadioButtonShowTitle(true);
  }

  function handleToggleFlashCard(cardId) {
    const updatedCards = [...studyCards];
    const cardIndex = updatedCards.findIndex(card => card.id === cardId);
    updatedCards[cardIndex].showTitle = !updatedCards[cardIndex].showTitle;

    setStudyCards(updatedCards);
  }

  return (
    <>
      <Header>react-flash-cards-v2</Header>
      <Main>
        <div className="text-center mb-4">
          <Button onButtonClick={handleShuffle}>Embaralhar cards</Button>
        </div>

        <div className="flex flex-row items-center justify-center space-x-4 m-4">
          <RadioButton
            id="radioButtonShowTitle"
            name="showInfo"
            buttonChecked={radioButtonShowTitle}
            onButtonClick={handleRadioShowTitleClick}
          >
            Mostrar título
          </RadioButton>

          <RadioButton
            id="radioButtonShowDescription"
            name="showInfo"
            buttonChecked={!radioButtonShowTitle}
            onButtonClick={handleRadioShowDescriptionClick}
          >
            Mostrar descrição
          </RadioButton>
        </div>

        <FlashCards>
          {studyCards.map(({ id, title, description, showTitle }) => {
            return (
              <FlashCard
                key={id}
                id={id}
                title={title}
                description={description}
                showFlashCardTitle={showTitle}
                onToggleFlashCard={handleToggleFlashCard}
              />
            );
          })}
        </FlashCards>
      </Main>
    </>
  );
}

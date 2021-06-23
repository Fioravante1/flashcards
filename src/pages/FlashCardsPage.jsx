import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../components/Button';
import FlashCard from '../components/FlashCard';
import FlashCards from '../components/FlashCards';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Main from '../components/Main';
import RadioButton from '../components/RadioButton';
import { helperShuffleArray } from '../helpers/arrayHelpers';
import { apiCreateFlashCard, apiDeleteFlashCard, apiGetAllFlashCards, apiUpdateFlashCard } from '../services/apiServises';
import Error from '../components/Error';
import FlashCardItem from '../components/FlashCardItem';
import FlashCardForm from '../components/FlashCardForm';

export default function FlashCardsPage() {
  const [allCards, setAllCards] = useState([]);
  const [studyCards, setStudyCards] = useState([]);
  const [radioButtonShowTitle, setRadioButtonShowTitle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createMode, setCreateMode] = useState(true);
  const [selectdTab, setSelectdTab] = useState(0);
  const [selectedFlashCard, setSelectedFlashCard] = useState(null);

  useEffect(() => {
    async function getAllCards() {
      try {
        const backEndAllCards = await apiGetAllFlashCards();
        setAllCards(backEndAllCards);
        setTimeout(() => {
          setLoading(false);
        }, 2000)
      } catch(error) {
        setError(error.message)
      }
    }
    getAllCards();
  }, []);

  function handleShuffle() {
    const shuffledCards = helperShuffleArray(studyCards);
    setStudyCards(shuffledCards);
  };

  useEffect(() => {
    setStudyCards(allCards.map(card => ({...card, showTitle: true})))
  }, [allCards]);

  function handleRadioShowDescriptionClick() {
    const updatedCards = [...studyCards].map(card => ({...card, showTitle: false}));
    setStudyCards(updatedCards);
    setRadioButtonShowTitle(false);
  };

  function handleRadioShowTitleClick() {
    const updatedCards = [...studyCards].map(card => ({...card, showTitle: true}));
    setStudyCards(updatedCards);
    setRadioButtonShowTitle(true);
  };

  function handleToggleFlashCard(cardId) {
    const updatedCards = [...studyCards];
    const cardIndex = updatedCards.findIndex(card => card.id === cardId);
    updatedCards[cardIndex].showTitle = !updatedCards[cardIndex].showTitle;

    setStudyCards(updatedCards);
  };

  async function handleDeleteFlashCard(cardId) {
    try {
     //Back-End
     await apiDeleteFlashCard(cardId);
     // Front-End
     setAllCards(allCards.filter(card => card.id !== cardId))
     setError('');
     toast.success('Card excluído com sucesso!')
    } catch (error) {
      setError(error.message)
    }
  };

  function hamdleEditFlashCard(card) {
    setCreateMode(false);
    setSelectdTab(1);
    setSelectedFlashCard(card);
  };

  function handleNewFlashCard() {
    setCreateMode(true);
    setSelectedFlashCard(null);
  };

  function handleTabSelect(tabIndex) {
    setSelectdTab(tabIndex);
  };

  async function handlePersist(title, description) {
    if(createMode) {
      try {

        //Back-End
        const newFlashCard = await apiCreateFlashCard(title, description);
        //Front-End
        setAllCards([...allCards, newFlashCard]);
        setError('');
        toast.success(`Card ${title} incluido com sucesso!`)
      } catch(error) {
        setError(error.message)
      }
    } else {
      try {
        //Back-End
        await apiUpdateFlashCard(
          selectedFlashCard.id, 
          title, 
          description
          );

        //Front-End
        setAllCards(allCards.map((card) => {
          if(card.id === selectedFlashCard.id) {
            return {...card, title, description};
          }
          return card;
        }))
        setSelectedFlashCard(null);
        setCreateMode(true);
        setError('');
        toast.success(`Card ${title} alterado com sucesso!`)
      } catch(error) {
        setError(error.message)
      }
    };
  };

  let mainJsx = (
    <div className="flex justify-center my-4">
      <Loading />
    </div>
  );

  if(error) {
    mainJsx = (
     <Error>{error}</Error>
    );
  };

  if(!loading && !error) {
    mainJsx = (
      <>
         <Tabs selectedIndex={selectdTab} onSelect={handleTabSelect}>
            <TabList>
              <Tab>Listagem</Tab>
              <Tab>Cadastro</Tab>
              <Tab>Estudo</Tab>
            </TabList>

            <TabPanel>
              {
                allCards.map((card) => {
                  return (
                    <FlashCardItem 
                      key={card.id} 
                      onDelete={handleDeleteFlashCard}
                      onEdit={hamdleEditFlashCard}
                    >
                      {card}
                    </FlashCardItem>
                  )
                })
              }
            </TabPanel>

            <TabPanel>

              <div className="my-4">
                <Button onButtonClick={handleNewFlashCard}>Novo flash card</Button>
              </div>

              <FlashCardForm 
                createMode={createMode} 
                onPersist={handlePersist}
              >
                {selectedFlashCard}
              </FlashCardForm>

            </TabPanel>

            <TabPanel>
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
            </TabPanel>
          </Tabs>
      </>
    )
  }

  console.log(process.env.NODE_ENV);

  return (
    <>
      <ToastContainer />
      <Header>Flash Card</Header>
      
      <Main>
        {mainJsx}
      </Main>
    </>
  );
}

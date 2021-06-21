import { get } from "./httpServices";

const URL = ' http://localhost:3001/flashcards';


export async function apiGetAllFlashCards() {
  const allFlashCards = await get(URL);
  return allFlashCards;
};
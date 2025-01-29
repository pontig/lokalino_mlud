import Book from "./Book";

export default interface BookEntry extends Book {
    Dec_conditions: string;
    Comment?: string;
}


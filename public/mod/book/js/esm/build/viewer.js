import { createElement } from 'react';

const BookViewer = ({ title = 'Book Viewer' }) =>
    createElement('h2', null, title);

export default BookViewer;

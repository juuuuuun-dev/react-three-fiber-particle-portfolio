import img1 from '../images/curly_braces.png';
import img2 from '../images/q.png';
import img3 from '../images/contact.png';

export default [
  {
    title: 'Home',
    src: img1,
    // texts: [ 'I am a', 'frontend', '& backend', 'developer' ],
    texts: ['I am a', 'web', 'developer', '&designer'],
    textSize: 4.6,
    lineHeight: 3.4,
    bottomY: -9.0,
    positionX: -14.0,
    lotationY: 0.8,
    description: 'descriptionです'
  },
  {
    title: 'ABOUT',
    src: img2,
    texts: ['ABOUT', 'ME'],
    path: '/about',
    componentName: 'About',
    description: 'ABOUT descriptionです'
  },
  {
    title: 'CONTACT',
    src: img3,
    texts: ['COTACT', 'ME'],
    path: '/contact',
    componentName: 'Contact',
    description: 'CONTACT descriptionです'
  }
];

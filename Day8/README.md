# Frontend Mentor - Tip calculator app solution

This is a solution to the [Tip calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/tip-calculator-app-ugJNGbJUX). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Calculate the correct tip and total cost of the bill per person

=


### Links
- Live Site URL: [text](https://tip-calculator-ahmad.vercel.app/)


### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- JavaScript

### What I learned

During this project, I learned valuable skills in:

- **Responsive Design**: Using Flexbox and CSS Grid to create layouts that work seamlessly on mobile and desktop screens
- **DOM Manipulation**: Selecting and dynamically updating HTML elements with JavaScript
- **Event Handling**: Using click and input events to respond to user interactions in real-time
- **Calculation Logic**: Implementing accurate tip calculations and handling edge cases
- **CSS Styling**: Creating interactive hover effects and maintaining visual consistency

```js
// Example: Calculating tip per person
const calculateTipPerPerson = (billAmount, tipPercentage, numberOfPeople) => {
  const tipAmount = billAmount * (tipPercentage / 100);
  return (billAmount + tipAmount) / numberOfPeople;
}
```

### Continued development

Areas to focus on in future projects:

- Advanced form validation and error handling
- Local storage to save calculation history
- Accessibility improvements (keyboard navigation, ARIA labels)
- Unit testing with JavaScript testing frameworks

### Useful resources

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Comprehensive documentation for JavaScript concepts
- [CSS-Tricks - Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - Great visual guide for Flexbox
- [Web.dev - Responsive Design](https://web.dev/responsive-web-design-basics/) - Best practices for responsive layouts

### AI Collaboration

I used GitHub Copilot and Claude AI during this project:

- **Debugging**: Got help identifying logic errors in my tip calculation function
- **Code Review**: Received suggestions for improving code readability and structure
- **Problem-solving**: Brainstormed approaches for responsive layout challenges

What worked well was asking specific questions about concepts I didn't fully understand. The AI helped me learn the "why" behind solutions, not just the "how."

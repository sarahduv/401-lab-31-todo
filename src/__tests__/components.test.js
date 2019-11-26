import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import renderer from "react-test-renderer";
import Todo from '../components/todo/todo-form.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Our components are functioning', () => {
  it('Deck renders', () => {
    let deck = mount(<Todo />);
    let h3 = deck.find('h3');
    expect(h3.exists()).toBeTruthy();
  });

  it('Our components are functioning', () => {
    let deck = mount(<Todo />);
    let span = deck.find('span');
    expect(span.exists()).toBeTruthy();
  });

  it('Our components are functioning', () => {
    let deck = mount(<Todo />);
    let button = deck.find('button');
    expect(button.exists()).toBeTruthy();
  });
});

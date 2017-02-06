/* @jsx retractor */

import webdriver from 'selenium-webdriver';
import expect from 'unexpected';

import TodoItem from './fixture/TodoItem';
import TodoApp from './fixture/TodoApp';

import retractor from '..';

describe('retractor', () => {
  it('should return a function with a displayName', () => {
    expect(<TodoItem key="item1" todo={{ text: /text/ }} completed />, 'to be a function')
      .and('to have property', 'displayName',
      "<TodoItem key={'item1'} todo={({ 'text': /text/ })} completed={true} />");
  });
});

describe('todo app', () => {
  const driver = new webdriver.Builder().forBrowser('phantomjs').build();

  beforeEach(() =>
    driver.get(`file://${__dirname}/fixture/index.html`)
  );

  beforeEach(() => {
    driver.executeScript(() => {
      const list1 = [
        {
          id: '31202915-f2e7-4506-a96a-8acdf3d2a680',
          title: 'Test React App',
          completed: true,
        }, {
          id: '39fb31e6-4539-4d77-9868-f3f0cab72297',
          title: 'Use Retractor',
          completed: false,
        },
      ];
      const list2 = [
        {
          id: 'fb03277a-e4ab-4346-9615-00cc4e75804c',
          title: 'Use Retractor Scoping',
          completed: false,
        }, {
          id: 'ccc26b71-e8ee-4073-bec8-1ccc6da239a0',
          title: 'Try out Selene',
          completed: false,
        },
      ];
      localStorage.setItem('todolist-1', JSON.stringify(list1));
      localStorage.setItem('todolist-2', JSON.stringify(list2));
    });
    return driver.navigate().refresh();
  });

  it('should load the demo page', () =>
    expect(driver.getTitle(), 'to be fulfilled with', 'Retractor Todo App')
  );

  it('should find a single element', () => {
    const item = driver.findElement(<TodoItem />);
    return expect(item, 'when fulfilled', 'to be a', webdriver.WebElement);
  });

  it('should find a single element by props', () => {
    const item = driver.findElement(<TodoItem todo={{ title: /React/ }} />);
    return expect(item, 'when fulfilled', 'to be a', webdriver.WebElement);
  });

  it('should find all elements', () => {
    const items = driver.findElements(<TodoItem />);
    return expect(items, 'when fulfilled', 'to have length', 4);
  });

  it('should limit results to the given scope', () => {
    const el = driver.findElement(<TodoApp model={{ key: 'todolist-2' }} />)
      .findElement(<TodoItem todo={{ title: /Retractor/ }} />);
    return expect(el.getText(), 'to be fulfilled with', 'Use Retractor Scoping');
  });
});

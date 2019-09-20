import { TimePlayZeroTemplatePage } from './app.po';

describe('TimePlayZero App', function() {
  let page: TimePlayZeroTemplatePage;

  beforeEach(() => {
    page = new TimePlayZeroTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

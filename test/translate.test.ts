import { expect } from 'chai';
import translate, { parseMultiple } from '../src/index';
import { createProxy } from './help'

describe('google-translate-open-api-proxy', () => {
  it('not support from', async() => {
    try {
      const result = await translate(`I'm fine.`, {
        tld: "cn",
        from: "xxx",
        to: "zh-CN",
      });
    } catch(e) {
      expect(e.code).to.equal(400);
    }
  })
  it('not support to', async() => {
    try {
      const result = await translate(`I'm fine.`, {
        tld: "cn",
        to: "xxx",
      });
    } catch(e) {
      expect(e.code).to.equal(400);
    }
  })
  it('translate single', async () => {
    const result = await translate(`I'm fine.`, {
      tld: "cn",
      to: "zh-CN",
    });
    const data = result.data[0];
    const compare = '我很好。';
    expect(data).to.equal(compare);
  });
  it('translate multiple', async () => {
    const result = await translate([`I'm fine.`, `I'm ok.`], {
      tld: "cn",
      to: "zh-CN",
    });
    const data = result.data[0];
    const compare = '[[[["我很好。"]],null,"en"],[[["我可以。"]],null,"en"]]';
    expect(JSON.stringify(data)).to.equal(compare);
  });
  it('translate parseMultiple', async () => {
    const result = await translate([`I'm fine. And you?`,`I'm ok.`], {
      tld: "cn",
      to: "zh-CN",
    });
    const data = result.data[0];
    const parseData = parseMultiple(data);
    const compare = '["我很好。你呢？","我可以。"]';
    expect(JSON.stringify(parseData)).to.equal(compare);
  });

  it('translate format text', async () => {
    const result = await translate(`I'm fine. And you?\nI'm fine. And you?`, {
      tld: "cn",
      to: "zh-CN",
      format: "text",
    });
    const data = result.data[0];
    const compare = '我很好。你呢？\n我很好。你呢？';
    expect(data).to.equal(compare);
  });

  it('translate format html', async () => {
    const result = await translate(`I'm fine. And you?\nI'm fine. And you?`, {
      tld: "cn",
      to: "zh-CN",
      format: "html",
    });
    const data = result.data[0];
    const compare = '我很好。你呢？我很好。你呢？';
    expect(data).to.equal(compare);
  });

  it('translate browers', async () => {
    const result = await translate(`I'm fine.`, {
      tld: "cn",
      to: "zh-CN",
      browers: true
    });
    const data = result.data[0];
    const compare = '我很好。';
    expect(data).to.equal(compare);
  });
})

describe('proxy', () => {
  let proxy

  before(async () => {
    proxy = createProxy();
    await proxy.start();
  });

  after(function () {
    proxy.stop();
  });

  it('translate proxy', async () => {
    const result = await translate(`I'm fine.`, {
      tld: "cn",
      to: "zh-CN",
      proxy: {
        host: proxy.host,
        port: proxy.port
      }
    });

    const data = result.data[0];
    const compare = '我很好。';
    expect(data).to.equal(compare);
  });
});
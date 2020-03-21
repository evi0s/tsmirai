# tsmirai

A QQ bot written by TypeScript based on Mirai

This package relies on [mirai-console v0.1.3](https://github.com/mamoe/mirai-console/releases/tag/wrapper-0.1.3) and [mirai api http v1.2.3](https://github.com/mamoe/mirai-api-http/releases/tag/v.1.2.3)

`src/core` is rebuilt from [node-mirai](https://github.com/RedBeanN/node-mirai)

Also, `enableWebsocket: true` must be added to `plugins/MiraiAPIHTTP/setting.yml`

## Bootstrap

```bash
git clone https://github.com/evi0s/tsmirai
```

### Install mirai-console

```bash
cd console && chmod +x bootstrap.sh && ./bootstrap.sh
```

### Start mirai-console

```bash
cd console && chmod +x start.sh && ./start.sh
# or simply
cd console && java -jar mirai-console.jar
```


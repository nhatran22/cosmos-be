# Cosmos Backend System

---

## Generate Serverless Function

```bash
npm run gen:api -- -f {functionName} -m {method} -u {url}
```

## Lint

```bash
npm run lint
```

---

## Project Structure
```
└── cosmos-be/
    ├── .github/ (Github Action CI / CD) 
    |── deploy/ (Cloudformation deployment)
    ├── scripts/ (Scripts for build layer, cleanup stage,...)
    └── src/
        ├── errors/ (Common Error)
        ├── lambda/ (Function)
        ├── middleware/
        ├── repository/
        ├── services/
        └── utils/
```

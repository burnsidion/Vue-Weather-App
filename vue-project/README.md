# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development
```sh
npm run dev
```

### Compile and Minify for Production
```sh
npm run build
```

### Backend set up
For this project, you need to run the front-end and back end simultaneously. You will also need an API key. 

-In the `backend` folder, rename `.env.sample` to `.env`
-Generate an API key at `https://docs.mapbox.com/help/getting-started/access-tokens/`  
-Add your API key to `backend/.env`

### Install dependencies 
```
-cd backend
-npm install 
```

### Launch the backend 
```
nodemon index.js
```